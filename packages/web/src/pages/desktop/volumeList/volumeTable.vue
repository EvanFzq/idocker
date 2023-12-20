<template>
  <a-table
    :data-source="list"
    :columns="columns"
    :loading="loading"
    size="middle"
    :pagination="{ showSizeChanger: true }"
  >
    <template #bodyCell="{ column, record }: { record: Volume; column: TableColumnProps<Volume> }">
      <template v-if="column.key === 'Containers'">
        <RouterLink
          v-if="record.ContainerNum"
          :to="'/d/container/list?volumeName=' + record.Name"
          class="image-containers"
        >
          {{ record.ContainerNum }}
        </RouterLink>
        <span v-else>{{ record.ContainerNum }}</span>
      </template>
      <template v-if="column.key === 'Mountpoint'">
        <span style="word-break: break-all">{{ record.Mountpoint }}</span>
      </template>
      <template v-if="column.key === 'CreatedAt'">
        <a-tooltip :title="dayjs(record.CreatedAt).format('YYYY-MM-DD HH:mm:ss')">
          {{ timeLongFormat(record.CreatedAt) }}
        </a-tooltip>
      </template>
      <template v-if="column.key === 'operate'">
        <a-space>
          <a-button
            danger
            :disabled="!!record.ContainerNum"
            type="primary"
            size="small"
            :icon="h(DeleteOutlined)"
            :loading="operateLoadingName === record.Name"
            @click="onRemove(record.Name)"
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

import type { Volume } from '@common/types/volume';

import { removeVolume } from '@/apis';
import { timeLongFormat } from '@/utils/utils';

import type { TableColumnProps } from 'ant-design-vue';

defineProps<{ list: Volume[]; loading: boolean }>();
const emits = defineEmits(['reload']);

const operateLoadingName = ref('');
const columns: TableColumnProps[] = [
  {
    key: 'Name',
    dataIndex: 'Name',
    title: '名称',
    width: 120,
    customRender: ({ value }) =>
      value.length > 20 ? value.slice(0, 10) + '...' + value.slice(-10) : value,
  },
  {
    key: 'Containers',
    dataIndex: 'Containers',
    title: '容器数量',
    width: 80,
  },
  {
    key: 'Mountpoint',
    dataIndex: 'Mountpoint',
    title: '挂载点',
    width: 300,
  },
  {
    key: 'CreatedAt',
    dataIndex: 'CreatedAt',
    title: '创建时间',
    width: 120,
    customRender: ({ value }) => timeLongFormat(dayjs.unix(value)),
  },
  {
    key: 'operate',
    dataIndex: 'Id',
    title: '操作',
    width: 120,
  },
];

const onRemove = async (name: string) => {
  operateLoadingName.value = name;
  const res = await removeVolume(name);
  if (res.success) {
    message.success('删除成功！');
  } else {
    message.error('删除失败！' + res.msg);
  }
  emits('reload');
  operateLoadingName.value = '';
};
</script>
<style scoped lang="less">
.image-containers {
  text-decoration: underline;
}
</style>
