export interface ContainerFormat {
  startedAt: string;
  status: string;
  id: string;
  disabled?: boolean;
  image: string;
  labels: Record<string, string>;
  name: string;
  created: string;
  icon: string;
  cpu?: number;
  memory_usage?: number;
  memory_limit?: number;
  localUrl?: string;
  internetUrl?: string;
}
