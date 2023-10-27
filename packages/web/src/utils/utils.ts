import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import 'dayjs/locale/zh-cn';
import { VolumeUnit, VolumeUnitSize, NumberLevel } from '@common/constants/enum';
import type { Container } from '@common/types/container';

import type { Dayjs } from 'dayjs';

dayjs.locale('zh-cn');

export const fileSizeFormat = (size: number) => {
  let str = '';
  Object.keys(VolumeUnit).forEach((unit: string) => {
    const num = size / VolumeUnitSize[unit];
    if (num > 1) {
      str = num.toFixed(1) + unit;
    }
  });
  return str;
};

export const numberFormat = (num: number) => {
  let str = '' + num;
  Object.keys(NumberLevel).forEach((unit: string) => {
    const value = num / NumberLevel[unit];
    if (value > 1) {
      str = value.toFixed(1) + unit;
    }
  });
  return str;
};

export const timeLongFormat = (
  date: number | string | Dayjs,
  baseDate?: number | string | Dayjs,
) => {
  dayjs.extend(relativeTime);
  date = dayjs(date);
  baseDate = baseDate ? dayjs(baseDate) : dayjs();
  return date.from(baseDate);
};

export const dataURLtoFile = (dataurl: string, filename: string) => {
  // 获取到base64编码
  const arr = dataurl.split(',');
  // 将base64编码转为字符串
  const bstr = window.atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n); // 创建初始化为0的，包含length个元素的无符号整型数组
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {
    type: 'image/jpeg',
  });
};

export const webUrlTemplateFormat = (template: string, containerDetail: Partial<Container>) => {
  const { HostConfig, Config } = containerDetail;
  if (!template?.trim()) return;

  const arr = [...template.matchAll(/\[[a-zA-Z0-9]+\]/g)];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const index = template.indexOf(item[0]);
    if (item[0] === '[HOST]') {
      template = `${template.slice(0, index)}${location.hostname}${template.slice(
        index + item[0].length,
      )}`;
    }
    if (item[0] === '[PROTOCOL]') {
      template = `${template.slice(0, index)}${location.protocol}${template.slice(
        index + item[0].length,
      )}`;
    }
    if (/\[PORT\d*\]/.test(item[0])) {
      let num = Number(item[0].slice(5, item[0].length - 1));
      num = isNaN(num) ? 0 : num;
      const port =
        HostConfig?.NetworkMode === 'host'
          ? parseInt(Object.keys(Config?.ExposedPorts || {})[num])
          : parseInt(Object.values(HostConfig?.PortBindings || {})[num][0].HostPort);
      if (!isNaN(port)) {
        template = `${template.slice(0, index)}${port}${template.slice(index + item[0].length)}`;
      }
    }
  }
  return template;
};
