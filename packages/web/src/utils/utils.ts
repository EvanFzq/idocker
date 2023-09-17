import { VolumeUnit, VolumeUnitSize, NumberLevel } from '@common/constants/enum';

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
