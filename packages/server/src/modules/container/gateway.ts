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

  async handleConnection(client: Socket) {
    console.info('handleConnection', client.id);
  }
  async handleDisconnect(client: Socket) {
    console.info('handleDisconnect', client.id);
    this.execMap.set(client.id, null);
    this.execStreamMap.set(client.id, null);
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

    this.execMap.set(client.id, exec);
    this.execStreamMap.set(client.id, stream);
    try {
      await exec.resize({ h: body.rows, w: body.cols });
    } catch (error) {
      console.error(client.id, error);
    }

    stream.on('data', (chunk: Buffer) => {
      client.emit('data', chunk.toString());
    });
    stream.on('error', error => {
      console.error(client.id, error);
      client.emit('error', error);
    });
    stream.on('end', () => {
      console.info(client.id, 'stream end: ');
      client.emit('end');
    });
  }
  @SubscribeMessage('terminal-data')
  async handleMessage(@MessageBody() body: string, @ConnectedSocket() client: Socket) {
    this.execStreamMap.get(client.id)?.write(body, 'utf-8');
  }
  @SubscribeMessage('terminal-resize')
  async handleResize(
    @MessageBody() body: { rows: number; cols: number },
    @ConnectedSocket() client: Socket,
  ) {
    await this.execMap.get(client.id).resize({ h: body.rows, w: body.cols });
  }
}
