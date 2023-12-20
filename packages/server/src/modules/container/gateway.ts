import * as stream from 'stream';

import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

import { DockerService } from '../docker';

@WebSocketGateway({ namespace: 'container' })
export class ContainerGateway {
  constructor(private readonly dockerService: DockerService) {}
  @WebSocketServer()
  server: Server;
  execStream: stream.Duplex;
  @SubscribeMessage('terminal')
  async handleTerminal(@MessageBody() body: { id: string }) {
    const container = await this.dockerService.docker.getContainer(body.id);
    if (!container) {
      await this.server.emitWithAck('error', { msg: '容器不存在' });
      this.server.disconnectSockets(true);
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
    this.execStream = stream;
    this.execStream.on('data', (chunk: Buffer) => {
      this.server.emit('data', chunk.toString());
    });
    this.execStream.on('error', error => {
      this.server.emit('error', error);
    });
    this.execStream.on('end', () => {
      this.server.emit('end');
    });
  }
  @SubscribeMessage('message')
  async handleMessage(@MessageBody() body: string) {
    this.execStream.write(body, 'utf-8');
  }
}
