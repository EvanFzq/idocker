import { RestartPolicy } from './enum';

export const restartPolicyList = [
  {
    text: '无（no）',
    value: RestartPolicy.No,
  },
  {
    text: '非正常退出（on-failure）',
    value: RestartPolicy.OnFailure,
  },
  {
    text: '总是重启（always）',
    value: RestartPolicy.Always,
  },
  {
    text: '退出时重启-忽略系统启动时已停止（unless-stopped）',
    value: RestartPolicy.UnlessStopped,
  },
];
