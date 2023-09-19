export const statusLabelMap: {
  [key: string]: string;
} = {
  running: '运行中',
  paused: '已暂停',
  exited: '已关闭',
  created: '已创建',
  restarting: '重启中',
};

export const statusColorMap: {
  [key: string]: string;
} = {
  running: '#07c160',
  paused: '#ed6a0c',
  exited: '#999',
};
export const buttonColorMap = {
  running: '#07c160',
  restart: '#1989fa',
  paused: '#ed6a0c',
  exited: '#888',
  delete: '#ee0a24',
};
