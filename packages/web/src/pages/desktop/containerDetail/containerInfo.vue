<template>
  <div
    v-if="!detail"
    class="loading"
  >
    <Spin />
  </div>
  <div
    v-if="detail"
    class="conatiner-detail-page"
  >
    <a-descriptions
      title="基础信息"
      bordered
      :content-style="{ background: '#fff' }"
      :label-style="{ background: '#f5f7fa', width: '150px' }"
    >
      <a-descriptions-item label="ID">
        {{ detail.id.slice(0, 16) }}
      </a-descriptions-item>
      <a-descriptions-item label="镜像">
        {{ detail.image }}
      </a-descriptions-item>
      <a-descriptions-item label="重启策略">
        {{
          detail.restartPolicyName
            ? restartPolicyList.find(item => item.value === detail?.restartPolicyName)?.text +
              `【${detail.restartPolicyMaximumRetryCount}次】`
            : ''
        }}
      </a-descriptions-item>
      <a-descriptions-item label="启动时间">
        {{ detail.startedAt ? dayjs(detail.startedAt).format('YYYY-MM-DD HH:mm:ss') : '-' }}
      </a-descriptions-item>
      <a-descriptions-item label="创建时间">
        {{ detail.created ? dayjs(detail.created).format('YYYY-MM-DD HH:mm:ss') : '-' }}
      </a-descriptions-item>
      <a-descriptions-item label="CMD">
        {{ detail.cmd || '-' }}
      </a-descriptions-item>
      <a-descriptions-item label="Entrypoint">
        {{ Array.isArray(detail.entrypoint) ? detail.entrypoint?.join(' ') : detail.entrypoint }}
      </a-descriptions-item>
      <a-descriptions-item label="Hostname">
        {{ detail.hostname }}
      </a-descriptions-item>
      <a-descriptions-item label="DomainName">
        {{ detail.domainName }}
      </a-descriptions-item>
      <a-descriptions-item label="内网地址">
        {{ detail.localUrl }}
      </a-descriptions-item>
      <a-descriptions-item label="外网地址">
        {{ detail.internetUrl }}
      </a-descriptions-item>
      <a-descriptions-item label="Hosts文件配置">
        <div
          v-for="line in detail.extraHosts?.split('\n') || []"
          :key="line"
          style="display: block"
        >
          {{ line }}
        </div>
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions
      title="网络信息"
      bordered
      class="block"
    />
    <a-table
      :data-source="detail.networks"
      :columns="networkColumns"
      style="width: 100%"
      :pagination="false"
    >
      <template #emptyText>
        <a-empty
          :image="Empty.PRESENTED_IMAGE_SIMPLE"
          style="margin: 0"
          description="未配置网络信息"
        />
      </template>
    </a-table>
    <a-descriptions
      v-if="!detail.networks.find(item => item.name === 'host')"
      title="端口信息"
      bordered
      class="block"
      :content-style="{ background: '#fff' }"
      :label-style="{ background: '#f5f7fa', width: '150px' }"
    >
      <a-descriptions-item
        v-for="(port, index) in detail.ports"
        :key="index"
        :label="'端口' + (index + 1)"
      >
        <div style="word-break: break-all">
          {{ port.hostPort }}（主机） -> {{ port.containerPort }}（容器） / {{ port.protocol }}
        </div>
      </a-descriptions-item>
    </a-descriptions>
    <div
      v-if="
        (!detail.ports || detail.ports.length === 0) &&
          !detail.networks.find(item => item.name === 'host')
      "
      style="background-color: #fff; padding: 12px 0 1px"
    >
      <a-empty
        :image="Empty.PRESENTED_IMAGE_SIMPLE"
        style="margin: 0"
        description="未配置端口信息"
      />
    </div>
    <a-descriptions
      title="挂载信息"
      bordered
      class="block"
    />
    <a-table
      :data-source="detail.mounts"
      :columns="mountColumns"
      style="width: 100%"
      :pagination="false"
    >
      <template #emptyText>
        <a-empty
          :image="Empty.PRESENTED_IMAGE_SIMPLE"
          style="margin: 0"
          description="未配置挂载信息"
        />
      </template>
    </a-table>
    <a-descriptions
      title="环境变量"
      bordered
      class="block"
      :content-style="{ background: '#fff' }"
      :label-style="{ background: '#f5f7fa', width: '150px', wordBreak: 'break-all' }"
    >
      <a-descriptions-item
        v-for="(env, index) in detail.envs"
        :key="index"
        :label="env.key"
      >
        <div style="word-break: break-all"> {{ env.value }}</div>
      </a-descriptions-item>
    </a-descriptions>
    <div
      v-if="!detail.envs || detail.envs.length === 0"
      style="background-color: #fff; padding: 12px 0 1px"
    >
      <a-empty
        :image="Empty.PRESENTED_IMAGE_SIMPLE"
        style="margin: 0"
        description="未配置环境变量"
      />
    </div>
    <a-descriptions
      title="能力配置"
      bordered
      class="block"
      :content-style="{ background: '#fff' }"
      :label-style="{ background: '#f5f7fa', width: '120px' }"
    >
      <a-descriptions-item label="特权模式">
        {{ detail.privileged ? '是' : '否' }}
      </a-descriptions-item>
      <a-descriptions-item label="CPU限制">
        {{ detail.nanoCpus !== undefined ? `${detail.nanoCpus}x` : '无限制' }}
      </a-descriptions-item>
      <a-descriptions-item label="内存限制">
        {{
          detail.memory === undefined
            ? '无限制'
            : detail.memory > 1024
              ? (detail.memory / 1024).toFixed(1) + 'GB'
              : detail.memory + 'MB'
        }}
      </a-descriptions-item>
      <a-descriptions-item label="启用能力">
        <div v-if="!detail.capAdd">默认值</div>
        <a-tag
          v-for="item in detail.capAdd"
          :key="item"
          color="success"
          style="margin-bottom: 12px"
        >
          {{ item }}
        </a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="禁用能力">
        <div v-if="!detail.capAdd">默认值</div>
        <a-tag
          v-for="item in detail.capDrop"
          :key="item"
          color="error"
          style="margin-bottom: 12px"
        >
          {{ item }}
        </a-tag>
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs';
import { Spin, Empty } from 'ant-design-vue';

import type { ContainerDetail, Mount, Network } from '@common/types/container';
import { restartPolicyList } from '@common/constants/const';
import { MountTypeList } from '@common/constants/enum';

import type { TableColumnProps } from 'ant-design-vue';

defineProps<{ detail: ContainerDetail }>();

const mountColumns: TableColumnProps<Mount>[] = [
  {
    key: 'index',
    dataIndex: 'id',
    title: '序号',
    customRender: ({ index }) => index + 1,
  },
  {
    key: 'type',
    dataIndex: 'type',
    title: '类型',
    customRender: ({ value }) => MountTypeList.find(item => item.value === value)?.label,
  },
  {
    key: 'source',
    dataIndex: 'source',
    title: '主机',
  },
  {
    key: 'target',
    dataIndex: 'target',
    title: '容器',
  },
  {
    key: 'rw',
    dataIndex: 'rw',
    title: '读写',
    customRender: ({ value }) => (value ? '读写' : '只读'),
  },
];
const networkColumns: TableColumnProps<Network>[] = [
  {
    key: 'index',
    dataIndex: 'id',
    title: '序号',
    customRender: ({ index }) => index + 1,
  },
  {
    key: 'id',
    dataIndex: 'id',
    title: 'ID',
    customRender: ({ value }) => value.slice(0, 10) + '...' + value.slice(-10),
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: '网络',
  },
  {
    key: 'ip',
    dataIndex: 'ip',
    title: 'IP',
    customRender: ({ value, record }) => (value ? value + '/' : '') + (record.prefixLen || '-'),
  },
  {
    key: 'gateway',
    dataIndex: 'gateway',
    title: '网关',
  },
  {
    key: 'ipV6',
    dataIndex: 'ipV6',
    title: 'IPv6',
    customRender: ({ value, record }) => (value ? value + '/' : '') + (record.prefixLenV6 || '-'),
  },
  {
    key: 'gatewayV6',
    dataIndex: 'gatewayV6',
    title: '网关v6',
  },
  {
    key: 'mac',
    dataIndex: 'mac',
    title: 'MAC',
  },
];
</script>
<style scoped lang="less">
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.conatiner-detail-page {
  margin-bottom: 32px;
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
