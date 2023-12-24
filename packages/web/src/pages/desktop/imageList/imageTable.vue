<template>
  <a-table
    :data-source="list"
    :columns="columns"
    :loading="false"
    size="middle"
    :pagination="{ showSizeChanger: true }"
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
          v-for="tag in record.RepoTags"
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
          <a-tooltip :title="!!record.Containers ? '存在使用容器' : ''">
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
          </a-tooltip>

          <a-button
            type="primary"
            size="small"
            :icon="h(PlusOutlined)"
            @click="onGoToCreate(record)"
          >
            创建容器
          </a-button>
        </a-space>
      </template>
    </template>
  </a-table>
</template>
<script setup lang="ts">
import { ref, h } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
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
    title: 'Tags',
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
const router = useRouter();

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
const onGoToCreate = async (record: ImageItem) => {
  router.push({
    path: '/d/container/newOrEdit',
    query: {
      image: record.RepoTags[0] || record.Name,
    },
  });
};
</script>
<style scoped lang="less">
.image-containers {
  text-decoration: underline;
}
</style>
