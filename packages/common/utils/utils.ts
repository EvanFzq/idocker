import type { ContainerDetail } from '../types/container';

export const webUrlTemplateFormat = (
  template: string,
  hostname: string,
  protocol: string,
  containerDetail: Partial<ContainerDetail>,
) => {
  const { networks, exposedPorts, ports } = containerDetail;
  if (!template?.trim()) return;
  const isHost = !!networks?.some(item => item.type === 'host');

  const arr = [...template.matchAll(/\[[a-zA-Z0-9]+\]/g)];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const index = template.indexOf(item[0]);
    if (item[0] === '[HOST]') {
      template = `${template.slice(0, index)}${hostname}${template.slice(index + item[0].length)}`;
    }
    if (item[0] === '[PROTOCOL]') {
      template = `${template.slice(0, index)}${protocol}${template.slice(index + item[0].length)}`;
    }
    if (/\[PORT\d*\]/.test(item[0])) {
      let num = Number(item[0].slice(5, item[0].length - 1));
      num = isNaN(num) ? 0 : num;
      const port = isHost
        ? parseInt(exposedPorts?.[num].hostPort as string)
        : parseInt(ports?.[num].hostPort as string);
      if (!isNaN(port)) {
        template = `${template.slice(0, index)}${port}${template.slice(index + item[0].length)}`;
      }
    }
  }
  return template;
};
