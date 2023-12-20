export const VolumeUnit = {
  B: 'B',
  KB: 'KB',
  MB: 'MB',
  GB: 'GB',
  TB: 'TB',
  PB: 'PB',
};

export const VolumeUnitSize = {
  [VolumeUnit.B]: 1,
  [VolumeUnit.KB]: 1024,
  [VolumeUnit.MB]: 1024 * 1024,
  [VolumeUnit.GB]: 1024 * 1024 * 1024,
  [VolumeUnit.TB]: 1024 * 1024 * 1024 * 1024,
  [VolumeUnit.PB]: 1024 * 1024 * 1024 * 1024 * 1024,
};

export enum ContainerActive {
  start = 'start',
  stop = 'stop',
  restart = 'restart',
  remove = 'remove',
  pause = 'pause',
  unpause = 'unpause',
}

export enum ContainerStatus {
  running = 'running',
  paused = 'paused',
  exited = 'exited',
  created = 'created',
  restarting = 'restarting',
}
export const ContainerStatusName: Record<string, string> = {
  [ContainerStatus.running]: '运行中',
  [ContainerStatus.paused]: '已暂停',
  [ContainerStatus.exited]: '已关闭',
  [ContainerStatus.created]: '已创建',
  [ContainerStatus.restarting]: '重启中',
};

export const ContainerStatusColor: Record<string, string> = {
  running: '#07c160',
  paused: '#ed6a0c',
  created: '#57abff',
  exited: '#999',
};

export const ContainerButtonColor = {
  running: '#07c160',
  restart: '#1989fa',
  paused: '#ed6a0c',
  exited: '#888',
  delete: '#ee0a24',
};

export const NumberLevel: {
  [key: string]: number;
} = {
  K: Math.pow(10, 3),
  M: Math.pow(10, 6),
  B: Math.pow(10, 9),
};

export enum RestartPolicy {
  No = 'no',
  OnFailure = 'on-failure',
  Always = 'always',
  UnlessStopped = 'unless-stopped',
}

export enum PortType {
  Tcp = 'tcp',
  Udp = 'udp',
}

export enum MountType {
  Bind = 'bind',
  Volume = 'volume',
  Device = 'device',
}
export const MountTypeList = [
  {
    label: '路径',
    value: MountType.Bind,
  },
  {
    label: '卷',
    value: MountType.Volume,
  },
  {
    label: '设备',
    value: MountType.Device,
  },
];

export enum ImageFit {
  Cover = 'cover',
  Contain = 'contain',
  Fill = 'fill',
  Inside = 'inside',
  Outside = 'outside',
}

export enum EmailType {
  QQ = 'QQ邮箱',
  Outlook = '微软Outlook邮箱',
  WangYi163 = '网易163邮箱',
}

export const EmailTypeList = [
  {
    text: EmailType.QQ,
    value: EmailType.QQ,
  },
  {
    text: EmailType.Outlook,
    value: EmailType.Outlook,
  },
  {
    text: EmailType.WangYi163,
    value: EmailType.WangYi163,
  },
];

export enum EventType {
  Container = 'container',
  Image = 'image',
  Volume = 'volume',
  Network = 'network',
  Daemon = 'daemon',
}
export const EventTypeName: Record<string, string> = {
  [EventType.Container]: '容器',
  [EventType.Image]: '镜像',
  [EventType.Volume]: '卷',
  [EventType.Network]: '网络',
  [EventType.Daemon]: 'docker进程',
};

export enum EventAction {
  Create = 'create',
  Destroy = 'destroy',
  Kill = 'kill',
  Pause = 'pause',
  Unpause = 'unpause',
  Rename = 'rename',
  Resize = 'resize',
  Restart = 'restart',
  Start = 'start',
  Stop = 'stop',
  Update = 'update',
  Delete = 'delete',
  Import = 'import',
  Pull = 'pull',
  Push = 'push',
  Mount = 'mount',
  Unmount = 'unmount',
  Connect = 'connect',
  Disconnect = 'disconnect',
  Remove = 'remove',
  Reload = 'reload',
}
export const EventActionName: Record<string, string> = {
  [EventAction.Create]: '创建',
  [EventAction.Destroy]: '销毁',
  [EventAction.Kill]: '杀死',
  [EventAction.Pause]: '暂停',
  [EventAction.Unpause]: '恢复',
  [EventAction.Rename]: '重命名',
  [EventAction.Resize]: '重设大小',
  [EventAction.Restart]: '重启',
  [EventAction.Start]: '启动',
  [EventAction.Stop]: '停止',
  [EventAction.Update]: '更新',
  [EventAction.Delete]: '删除',
  [EventAction.Import]: '导入',
  [EventAction.Pull]: '拉取',
  [EventAction.Push]: '推送',
  [EventAction.Mount]: '挂载',
  [EventAction.Unmount]: '卸载',
  [EventAction.Connect]: '链接',
  [EventAction.Disconnect]: '断开',
  [EventAction.Remove]: '移除',
  [EventAction.Reload]: '重载',
};

export const EventTypeActions: Record<string, string[]> = {
  [EventType.Container]: [
    EventAction.Create,
    EventAction.Destroy,
    EventAction.Kill,
    EventAction.Pause,
    EventAction.Unpause,
    EventAction.Rename,
    EventAction.Resize,
    EventAction.Restart,
    EventAction.Start,
    EventAction.Stop,
    EventAction.Update,
  ],
  [EventType.Image]: [EventAction.Delete, EventAction.Import, EventAction.Pull, EventAction.Push],
  [EventType.Volume]: [
    EventAction.Create,
    EventAction.Destroy,
    EventAction.Mount,
    EventAction.Unmount,
  ],
  [EventType.Network]: [
    EventAction.Connect,
    EventAction.Disconnect,
    EventAction.Create,
    EventAction.Destroy,
    EventAction.Update,
    EventAction.Remove,
  ],
  [EventType.Daemon]: [EventAction.Reload],
};

export const Capability = {
  AUDIT_CONTROL: 'AUDIT_CONTROL',
  AUDIT_WRITE: 'AUDIT_WRITE',
  BLOCK_SUSPEND: 'BLOCK_SUSPEND',
  CHOWN: 'CHOWN',
  DAC_OVERRIDE: 'DAC_OVERRIDE',
  DAC_READ_SEARCH: 'DAC_READ_SEARCH',
  FOWNER: 'FOWNER',
  FSETID: 'FSETID',
  IPC_LOCK: 'IPC_LOCK',
  IPC_OWNER: 'IPC_OWNER',
  KILL: 'KILL',
  LEASE: 'LEASE',
  LINUX_IMMUTABLE: 'LINUX_IMMUTABLE',
  MAC_ADMIN: 'MAC_ADMIN',
  MAC_OVERRIDE: 'MAC_OVERRIDE',
  MKNOD: 'MKNOD',
  NET_ADMIN: 'NET_ADMIN',
  NET_BIND_SERVICE: 'NET_BIND_SERVICE',
  NET_BROADCAST: 'NET_BROADCAST',
  NET_RAW: 'NET_RAW',
  SETFCAP: 'SETFCAP',
  SETGID: 'SETGID',
  SETPCAP: 'SETPCAP',
  SETUID: 'SETUID',
  SYSLOG: 'SYSLOG',
  SYS_ADMIN: 'SYS_ADMIN',
  SYS_BOOT: 'SYS_BOOT',
  SYS_CHROOT: 'SYS_CHROOT',
  SYS_MODULE: 'SYS_MODULE',
  SYS_NICE: 'SYS_NICE',
  SYS_PACCT: 'SYS_PACCT',
  SYS_PTRACE: 'SYS_PTRACE',
  SYS_RAWIO: 'SYS_RAWIO',
  SYS_RESOURCE: 'SYS_RESOURCE',
  SYS_TIME: 'SYS_TIME',
  SYS_TTY_CONFIG: 'SYS_TTY_CONFIG',
  WAKE_ALARM: 'WAKE_ALARM',
};

export const defaultCapability = [
  Capability.AUDIT_WRITE,
  Capability.CHOWN,
  Capability.DAC_OVERRIDE,
  Capability.FOWNER,
  Capability.FSETID,
  Capability.KILL,
  Capability.MKNOD,
  Capability.SETGID,
  Capability.SYS_CHROOT,
  Capability.NET_RAW,
  Capability.SETFCAP,
  Capability.NET_BIND_SERVICE,
  Capability.SETPCAP,
  Capability.SETUID,
];
