export interface ContainerFormat {
    startedAt: string;
    status: string;
    id: string;
    image: string;
    labels: Record<string, any>;
    name: string;
    created: string;
    icon: string;
    cpu?: number;
    memory_usage?: number;
    memory_limit?: number;
}
