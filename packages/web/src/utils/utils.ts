import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import 'dayjs/locale/zh-cn';
import { VolumeUnit, VolumeUnitSize, NumberLevel } from '@common/constants/enum';

import type { Dayjs } from 'dayjs';

dayjs.locale('zh-cn');

export const fileSizeFormat = (size: number) => {
  let str = '';
  Object.keys(VolumeUnit).forEach((unit: string) => {
    const num = size / VolumeUnitSize[unit];
    if (num > 10) {
      str = num.toFixed(0) + unit;
    } else if (num > 1) {
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

export const isMobile = () => {
  const userAgent = navigator.userAgent;
  const width = document.documentElement.offsetWidth;
  // 屏幕小于1000
  if (width > 1000) return false;
  // 且有移动端标识
  return (
    userAgent.indexOf('iPhone') > 0 ||
    userAgent.indexOf('Mobile') > 0 ||
    userAgent.indexOf('Android') > 0 ||
    userAgent.indexOf('iPad') > 0
  );
};

export const safeSvg = (svg?: string): boolean => {
  if (!svg) {
    return false;
  }
  if (
    ['<script', '</script', ']]>', '-->', '\u2028', '\u2029'].some(item => svg.indexOf(item) >= 0)
  ) {
    return false;
  }
  return true;
};
