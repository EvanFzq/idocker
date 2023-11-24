<template>
  <a-table
    :data-source="list"
    :columns="columns"
    :loading="loading"
    size="middle"
  >
    <template
      #bodyCell="{ column, record }: { record: Network; column: TableColumnProps<Network> }"
    >
      <template v-if="column.key === 'Containers'">
        <RouterLink
          v-if="record.Containers"
          :to="'/d/container/list?networkId=' + record.Id"
          class="image-containers"
        >
          {{ record.Containers }}
        </RouterLink>
        <span v-else>{{ record.Containers }}</span>
      </template>
      <template v-if="column.key === 'Created'">
        <a-tooltip :title="dayjs(record.Created).format('YYYY-MM-DD HH:mm:ss')">
          {{ timeLongFormat(record.Created) }}
        </a-tooltip>
      </template>
      <template v-if="column.key === 'operate'">
        <a-space>
          <a-button
            danger
            :disabled="!!record.Containers || ['host', 'none', 'bridge'].includes(record.Name)"
            type="primary"
            :icon="h(DeleteOutlined)"
            :loading="operateLoadingId === record.Id"
            @click="onRemove(record.Id)"
          >
            删除
          </a-button>
        </a-space>
      </template>
    </template>
  </a-table>
</template>
<script setup lang="ts">
import { ref, h } from 'vue';
import { RouterLink } from 'vue-router';
import dayjs from 'dayjs';
import { DeleteOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import type { Network } from '@common/types/network';

import { removeNetwork } from '@/apis';
import { timeLongFormat } from '@/utils/utils';

import type { TableColumnProps } from 'ant-design-vue';

defineProps<{ list: Network[]; loading: boolean }>();
const emits = defineEmits(['reload']);

const operateLoadingId = ref('');
const columns: TableColumnProps[] = [
  {
    key: 'Name',
    dataIndex: 'Name',
    title: '名称',
  },
  {
    key: 'Containers',
    dataIndex: 'Containers',
    title: '容器数量',
  },
  {
    key: 'Created',
    dataIndex: 'Created',
    title: '创建时间',
    customRender: ({ value }) => timeLongFormat(dayjs.unix(value)),
  },
  {
    key: 'Gateway',
    dataIndex: 'IPAM',
    title: '网关',
    customRender: ({ value }) => value.Config?.[0]?.Gateway,
  },
  {
    key: 'Subnet',
    dataIndex: 'IPAM',
    title: '子网掩码',
    customRender: ({ value }) => value.Config?.[0]?.Subnet,
  },
  {
    key: 'EnableIPv6',
    dataIndex: 'EnableIPv6',
    title: 'IPv6',
    customRender: ({ value }) => (value ? '是' : '否'),
  },
  {
    key: 'Internal',
    dataIndex: 'Internal',
    title: '内部网络',
    customRender: ({ value }) => (value ? '是' : '否'),
  },
  {
    key: 'operate',
    dataIndex: 'Id',
    title: '操作',
  },
];

const onRemove = async (id: string) => {
  operateLoadingId.value = id;
  const res = await removeNetwork(id);
  if (res.success) {
    message.success('删除成功！');
  } else {
    message.error('删除失败！' + res.msg);
  }
  emits('reload');
  operateLoadingId.value = '';
};
</script>
<style scoped lang="less">
.image-containers {
  text-decoration: underline;
}
</style>
