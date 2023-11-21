<template>
  <div
    v-if="!detail"
    class="loading"
  >
    <van-loading />
  </div>
  <div v-if="detail">
    <el-descriptions
      title="基础信息"
      border
      class="block"
    >
      <el-descriptions-item label="ID">
        {{ detail.id.slice(0, 16) }}
      </el-descriptions-item>
      <el-descriptions-item label="镜像">
        {{ detail.image }}
      </el-descriptions-item>
      <el-descriptions-item label="重启策略">
        {{
          detail.restartPolicyName
            ? restartPolicyList.find(item => item.value === detail?.restartPolicyName)?.text +
              `【${detail.restartPolicyMaximumRetryCount}次】`
            : ''
        }}
      </el-descriptions-item>
      <el-descriptions-item label="启动时间">
        {{ detail.startedAt ? dayjs(detail.startedAt).format('YYYY-MM-DD HH:mm:ss') : '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="创建时间">
        {{ detail.created ? dayjs(detail.created).format('YYYY-MM-DD HH:mm:ss') : '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="CMD">
        {{ detail.cmd?.join(' ') || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="Entrypoint">
        {{ Array.isArray(detail.entrypoint) ? detail.entrypoint?.join(' ') : detail.entrypoint }}
      </el-descriptions-item>
      <el-descriptions-item label="内网地址">
        {{ detail.localUrl }}
      </el-descriptions-item>
      <el-descriptions-item label="外网地址">
        {{ detail.internetUrl }}
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions
      title="挂载信息"
      border
      class="block"
    />
    <el-table
      :data="detail.mounts"
      style="width: 100%"
    >
      <el-table-column
        prop="type"
        label="序号"
        width="80"
      >
        <template #default="{ $index }">{{ $index + 1 }}</template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        width="80"
      >
        <template #default="{ row }: { row: Mount }">
          {{ row.type === 'bind' ? '路径' : '卷' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="soure"
        label="主机"
      >
        <template #default="{ row }: { row: Mount }">
          {{ row.source }}
        </template>
      </el-table-column>
      <el-table-column
        prop="target"
        label="容器"
      >
        <template #default="{ row }: { row: Mount }">
          {{ row.target }}
        </template>
      </el-table-column>
      <el-table-column
        prop="rw"
        label="读写"
        width="80"
      >
        <template #default="{ row }: { row: Mount }">
          {{ row.rw ? '读写' : '只读' }}
        </template>
      </el-table-column>
    </el-table>
    <el-descriptions
      title="端口信息"
      border
      class="block"
    >
      <el-descriptions-item
        v-for="(port, index) in detail.ports"
        :key="index"
        :label="'端口' + (index + 1)"
        width="15%"
      >
        <div style="word-break: break-all">
          {{ port.hostPort }}（主机） -> {{ port.containerPort }}（容器） / {{ port.protocol }}
        </div>
      </el-descriptions-item>
    </el-descriptions>

    <el-descriptions
      title="网络信息"
      border
      class="block"
    />
    <el-table
      :data="detail.networks"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="200"
      >
        <template #default="{ row }: { row: Network }">
          {{ row.id.slice(0, 10) + '...' + row.id.slice(-10) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="网络"
      />

      <el-table-column
        prop="ip"
        label="IP"
      >
        <template #default="{ row }: { row: Network }">
          {{ row.ip ? row.ip + '/' : '' }}{{ row.prefixLen || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="gateway"
        label="网关"
      />
      <el-table-column
        prop="ipv6"
        label="IPv6"
      >
        <template #default="{ row }: { row: Network }">
          {{ row.ipV6 ? row.ipV6 + '/' : '' }}{{ row.prefixLenV6 || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="gatewayV6"
        label="网关v6"
      />
      <el-table-column
        prop="mac"
        label="MAC"
      />
    </el-table>
    <el-descriptions
      title="环境变量"
      border
      class="block"
    >
      <el-descriptions-item
        v-for="(env, index) in detail.envs"
        :key="index"
        :label="env.key"
        label-class-name="env-desc-label"
      >
        <div style="word-break: break-all"> {{ env.value }}</div>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs';

import type { ContainerDetail, Mount, Network } from '@common/types/container';
import { restartPolicyList } from '@common/constants/const';

defineProps<{ detail: ContainerDetail }>();
</script>
<style scoped lang="less">
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.name {
  font-size: 24px;
  font-weight: 700;
  color: #409eff;
  margin-bottom: 16px;
}
.block {
  margin-top: 32px;
}
</style>
<style>
.env-desc-label {
  white-space: wrap;
  word-break: break-all;
  max-width: 240px;
}
</style>
