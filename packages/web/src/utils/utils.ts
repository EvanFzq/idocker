import { VolumeUnit, VolumeUnitSize } from "@common/constants/enum";

export const fileSizeFormat = (size: number) => {
  let str = "";
  Object.keys(VolumeUnit).forEach((unit: string) => {
    const num = size / VolumeUnitSize[unit];
    if (num > 1) {
      str = num.toFixed(1) + unit;
    }
  });
  return str;
};
