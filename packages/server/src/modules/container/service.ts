import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Docker from 'dockerode';
import { execSync } from 'child_process';
import { ContainerStats } from '@common/types/container';
import { ContainerActive } from '@common/constants/enum';

@Injectable()
export class ContainerService {
    private docker: Docker;
    private currentContainerId: string;
    constructor() {
        this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
        try {
            this.currentContainerId = execSync('hostname', { timeout: 1000, encoding: 'utf-8' });
            console.log(this.currentContainerId);
        } catch (error) {
            console.log('获取容器本身ID失败，', error);
        }
    }
    async getContainerList() {
        const list = await this.docker.listContainers({
            all: true,
        });
        return list.map(item => {
            if (item.Id.startsWith(this.currentContainerId)) {
                return { ...item, disabled: true };
            }
            return item;
        });
    }
    async getContainerDetail(id: string) {
        return await this.docker.getContainer(id).inspect();
    }

    async getContainerStats(ids: string[]): Promise<ContainerStats[]> {
        const statsList = await Promise.all(
            ids.map(id => this.docker.getContainer(id).stats({ stream: false })),
        );
        return statsList.map(item => {
            const { cpu_stats, precpu_stats, memory_stats, id } = item as Docker.ContainerStats & {
                id: string;
            };
            const cpuDelta = cpu_stats.cpu_usage.total_usage - precpu_stats.cpu_usage.total_usage;
            const systemDelta = cpu_stats.system_cpu_usage - precpu_stats.system_cpu_usage;
            return {
                id,
                cpu: (cpuDelta / systemDelta) * cpu_stats.online_cpus * 100,
                memory_usage: memory_stats.usage,
                memory_limit: memory_stats.limit,
            };
        });
    }

    async activeContainer(id: string, type: ContainerActive) {
        const container = this.docker.getContainer(id);
        if (id.startsWith(this.currentContainerId)) {
            throw new HttpException('禁止操作提供容器管理的容器本身', HttpStatus.FORBIDDEN);
        }
        switch (type) {
            case ContainerActive.start:
                await container.start();
                break;
            case ContainerActive.stop:
                await container.stop();
                break;
            case ContainerActive.restart:
                await container.restart();
                break;
            case ContainerActive.remove:
                await container.remove();
                break;
            case ContainerActive.pause:
                await container.pause();
                break;
            case ContainerActive.unpause:
                await container.unpause();
                break;
            default:
                break;
        }
    }

    async getContainerLogs(id: string) {
        const container = this.docker.getContainer(id);
        const res = await container.logs({
            follow: false,
            tail: 200,
            timestamps: true,
            stderr: true,
            stdout: true,
        });
        return res.toString();
    }
}
