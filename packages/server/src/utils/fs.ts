import {
  accessSync,
  mkdirSync as _mkdirSync,
  writeFileSync as _writeFileSync,
  promises as fs,
  ObjectEncodingOptions,
  Mode,
  OpenMode,
  WriteFileOptions,
  constants,
} from 'fs';
import path from 'path';
import { Stream } from 'node:stream';

export const mkdir = async (dirPath: string) => {
  const fullPaths = dirPath.split(/[/\\]+/).map(item => (item === '' ? '/' : item));
  const dirPaths = [...fullPaths];
  while (dirPaths.length > 0) {
    try {
      const _dirpath = path.join(...dirPaths);
      await fs.access(_dirpath, constants.W_OK);
      break;
    } catch (error) {
      dirPaths.pop();
    }
  }
  while (dirPaths.length < fullPaths.length) {
    dirPaths.push(fullPaths[dirPaths.length]);
    const _dirpath = path.join(...dirPaths);
    await fs.mkdir(_dirpath);
  }
};
export const mkdirSync = (dirPath: string) => {
  const fullPaths = dirPath.split(/[/\\]+/).map(item => (item === '' ? '/' : item));
  const dirPaths = [...fullPaths];
  while (dirPaths.length > 0) {
    try {
      const _dirpath = path.join(...dirPaths);
      accessSync(_dirpath, constants.W_OK);
      break;
    } catch (error) {
      console.error(error);
      dirPaths.pop();
    }
  }

  while (dirPaths.length < fullPaths.length) {
    dirPaths.push(fullPaths[dirPaths.length]);
    const _dirpath = path.join(...dirPaths);
    _mkdirSync(_dirpath);
  }
};

export const writeFile = async (
  filePath: string,
  data:
    | string
    | NodeJS.ArrayBufferView
    | Iterable<string | NodeJS.ArrayBufferView>
    | AsyncIterable<string | NodeJS.ArrayBufferView>
    | Stream,
  option?:
    | (ObjectEncodingOptions & {
        mode?: Mode | undefined;
        flag?: OpenMode | undefined;
      })
    | BufferEncoding
    | null,
) => {
  const pathInfo = path.parse(filePath);
  await mkdir(pathInfo.dir);
  await fs.writeFile(filePath, data, option);
};

export const writeFileSync = (
  filePath: string,
  data: string | NodeJS.ArrayBufferView,
  option?: WriteFileOptions,
) => {
  const pathInfo = path.parse(filePath);
  mkdirSync(pathInfo.dir);
  _writeFileSync(filePath, data, option);
};
