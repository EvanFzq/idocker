import { createReadStream, promises as fs } from 'fs';
import { createHash } from 'node:crypto';

import { v4 as uuidV4 } from 'uuid';

export const getFileHash = async (path: string) => {
  await fs.access(path, fs.constants.R_OK);
  const hash = createHash('sha256');
  const stream = createReadStream(path);
  stream.on('data', (chunk: string) => {
    hash.update(chunk, 'utf8');
  });
  return new Promise<string>(resolve => {
    stream.on('end', () => {
      const md5 = hash.digest('hex');
      resolve(md5);
    });
  });
};

export const hash = (str: string) => {
  const hash = createHash('sha256');
  hash.update(str, 'utf8');
  return hash.digest('hex');
};

export const uuid = (): string => uuidV4().split('-').join('');
