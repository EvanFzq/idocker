import { HttpException, HttpStatus } from '@nestjs/common';

export enum DockerErrorCode {
  ServiceError = 10000,
  ImageNotExist,
  PullImageTimeout,
}

const DockerErrorMsg = {
  [DockerErrorCode.ServiceError]: 'docker 服务异常',
  [DockerErrorCode.ImageNotExist]: '镜像不存在或无权访问',
  [DockerErrorCode.PullImageTimeout]: '拉取镜像超时',
};

export class DockerException extends HttpException {
  constructor(code = DockerErrorCode.ServiceError, error?: Error) {
    super({ code, msg: DockerErrorMsg[code], error }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export enum BusinessErrorCode {
  NetworkConnectError = 20000,
}
const BusinessErrorMsg = {
  [BusinessErrorCode.NetworkConnectError]: '网络链接异常',
};
export class BusinessException extends HttpException {
  constructor(code: BusinessErrorCode, error?: Error) {
    super({ code, msg: BusinessErrorMsg[code], error }, HttpStatus.OK);
  }
}
