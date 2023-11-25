<template>
  <a-table
    :data-source="list"
    :columns="columns"
    :loading="false"
    size="middle"
  >
    <template
      #bodyCell="{ column, record }: { record: ImageItem; column: TableColumnProps<ImageItem> }"
    >
      <template v-if="column.key === 'Containers'">
        <RouterLink
          v-if="record.Containers"
          :to="'/d/container/list?imageId=' + record.Id"
          class="image-containers"
        >
          {{ record.Containers }}
        </RouterLink>
        <span v-else>{{ record.Containers }}</span>
      </template>
      <template v-if="column.key === 'Created'">
        <a-tooltip :title="dayjs.unix(record.Created).format('YYYY-MM-DD HH:mm:ss')">
          {{ timeLongFormat(dayjs.unix(record.Created)) }}
        </a-tooltip>
      </template>
      <template v-if="column.key === 'Tags'">
        <div
          v-for="tag in record.Tags"
          :key="tag"
        >
          {{ tag }}
        </div>
      </template>
      <template v-if="column.key === 'Size'">
        {{ fileSizeFormat(record.Size) }}
      </template>
      <template v-if="column.key === 'operate'">
        <a-space>
          <a-button
            danger
            :disabled="!!record.Containers"
            type="primary"
            size="small"
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

import type { ImageItem } from '@common/types/image';

import { removeImage } from '@/apis';
import { timeLongFormat, fileSizeFormat } from '@/utils/utils';

import type { TableColumnProps } from 'ant-design-vue';

defineProps<{ list: ImageItem[]; loading: boolean }>();
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
    key: 'Tags',
    dataIndex: 'Tags',
    title: 'Tag',
  },
  {
    key: 'Size',
    dataIndex: 'Size',
    title: '大小',
  },
  {
    key: 'operate',
    dataIndex: 'Id',
    title: '操作',
  },
];

const onRemove = async (id: string) => {
  operateLoadingId.value = id;
  const res = await removeImage(id);
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
