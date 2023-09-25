export const messageMap = {
  'network with name test already exists': '存在同名的网络',
  'could not find an available, non-overlapping IPv6 address pool among the defaults to assign to the network':
    '不支持IPv6',
  'user specified IP address is supported only when connecting to networks with user configured subnets':
    '只有用户配置子网的网络支持指定IP',
};

export const messageFormat = msg => {
  if (msg.indexOf("It does not belong to any of this network's subnets") >= 0) {
    return 'IP不属于该网络子网';
  }
  if (msg.indexOf('Requested address is out of range') >= 0) {
    return 'Ip地址超出子网范围';
  }
  return messageMap[msg] || msg;
};
