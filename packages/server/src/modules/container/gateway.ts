import * as stream from 'stream';

import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import Dockerode from 'dockerode';

import { DockerService } from '../docker';

@WebSocketGateway({ namespace: 'container' })
export class ContainerGateway {
  execMap?: Map<string, Dockerode.Exec>;
  execStreamMap?: Map<string, stream.Duplex>;
  constructor(private readonly dockerService: DockerService) {
    this.execMap = new Map();
    this.execStreamMap = new Map();
  }

  @SubscribeMessage('terminal')
  async handleTerminal(
    @MessageBody() body: { id: string; rows: number; cols: number },
    @ConnectedSocket() client: Socket,
  ) {
    const container = await this.dockerService.docker.getContainer(body.id);
    if (!container) {
      await client.emitWithAck('error', { msg: '容器不存在' });
      client.disconnect(true);
    }
    const exec = await container.exec({
      AttachStderr: true,
      AttachStdin: true,
      AttachStdout: true,
      Tty: true,
      Cmd: ['bash'],
    });
    const stream = await exec.start({
      Detach: false,
      Tty: true,
      stdin: true,
      hijack: true,
    });

    client.emit('success', exec.id);
    this.execMap.set(exec.id, exec);
    this.execStreamMap.set(exec.id, stream);
    try {
      await exec.resize({ h: body.rows, w: body.cols });
    } catch (error) {
      console.error(exec.id, error);
    }

    stream.on('data', (chunk: Buffer) => {
      client.emit('data', chunk.toString());
    });
    stream.on('error', error => {
      console.error(exec.id, error);
      client.emit('error', error);
    });
    stream.on('end', () => {
      console.info(exec.id, 'stream end: ');
      client.emit('end');
    });
  }
  @SubscribeMessage('terminal-data')
  async handleMessage(@MessageBody() body: { execId: string; text: string }) {
    this.execStreamMap.get(body.execId)?.write(body.text, 'utf-8');
  }
  @SubscribeMessage('terminal-resize')
  async handleResize(@MessageBody() body: { execId: string; rows: number; cols: number }) {
    await this.execMap.get(body.execId).resize({ h: body.rows, w: body.cols });
  }
}
