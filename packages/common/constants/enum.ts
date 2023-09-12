export const VolumeUnit = {
  KB: "KB",
  MB: "MB",
  GB: "GB",
  TB: "TB",
  PB: "PB",
};

export const VolumeUnitSize = {
  [VolumeUnit.KB]: 1024,
  [VolumeUnit.MB]: 1024 * 1024,
  [VolumeUnit.GB]: 1024 * 1024 * 1024,
  [VolumeUnit.TB]: 1024 * 1024 * 1024 * 1024,
  [VolumeUnit.PB]: 1024 * 1024 * 1024 * 1024 * 1024,
};

export enum ContainerActive {
  start = "start",
  stop = "stop",
  restart = "restart",
  remove = "remove",
  pause = "pause",
  unpause = "unpause",
}
