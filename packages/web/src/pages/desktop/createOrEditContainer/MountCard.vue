<template>
  <a-card
    class="form-card"
    title="挂载配置"
  >
    <template #extra>
      <a-button
        class="button"
        size="small"
        type="link"
        @click="form.mounts?.push({ type: 'bind', container: '', readonly: false })"
      >
        增加挂载
      </a-button>
    </template>
    <a-table
      :data-source="form.mounts"
      :columns="mountColumns"
      size="middle"
      :pagination="false"
    >
      <template #emptyText> 无条目，请添加 </template>
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'type'">
          <a-form-item
            label-width="0"
            :name="['mounts', index, 'type']"
            :rules="[{ required: true, message: '请选择' }]"
          >
            <a-select
              v-model:value="record.type"
              placeholder="请选择"
              style="width: 100%"
              :options="MountTypeList"
            />
          </a-form-item>
        </template>
        <template v-if="column.key === 'host'">
          <a-form-item
            v-if="['bind', 'device'].includes(record.type)"
            label-width="0"
            :name="['mounts', index, 'hostBind']"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <a-input
              v-model:value="record.hostBind"
              placeholder="请输入"
              style="width: 100%"
            />
          </a-form-item>
          <a-form-item
            v-else
            label-width="0"
            :name="['mounts', index, 'volume']"
            :rules="[{ required: true, message: '请选择' }]"
          >
            <div style="display: flex; align-items: center">
              <a-select
                v-model:value="record.volume"
                style="width: 100%"
                placeholder="请选择"
                :options="volumeList"
                :field-names="{ label: 'Name', value: 'Name' }"
              />
              <a-button
                type="primary"
                shape="circle"
                size="small"
                style="margin-left: 6px"
                :icon="h(PlusOutlined)"
                @click="showCreateVolumeModal = true"
              />
            </div>
          </a-form-item>
        </template>
        <template v-if="column.key === 'container'">
          <a-form-item
            label-width="0"
            :name="['mounts', index, 'container']"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <a-input
              v-model:value="record.container"
              placeholder="请输入"
              style="width: 100%"
            />
          </a-form-item>
        </template>
        <template v-if="column.key === 'rw'">
          <a-form-item
            label-width="0"
            :name="['mounts', index, 'readonly']"
          >
            <a-switch v-model:checked="record.readonly" />
          </a-form-item>
        </template>
        <template v-if="column.key === 'operate'">
          <a-button
            type="link"
            danger
            @click="onRemove(index)"
          >
            移除
          </a-button>
        </template>
      </template>
    </a-table>
  </a-card>
  <CreateVolumeModal
    v-model:open="showCreateVolumeModal"
    @created="getVolumeData()"
  />
</template>
<script setup lang="ts">
import { ref, onMounted, h, watch } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';

import type { Volume } from '@common/types/volume';
import { MountTypeList } from '@common/constants/enum';

import CreateVolumeModal from '@/components/desktop/CreateVolumeModal.vue';
import { getVolumeList } from '@/apis';

import type { FormData } from './type';
import type { TableColumnProps } from 'ant-design-vue';

const props = defineProps<{ formData: FormData }>();
const emit = defineEmits(['valueChange']);

const showCreateVolumeModal = ref(false);
const volumeList = ref<Volume[]>([]);

const form = ref<Pick<FormData, 'mounts'>>({
  mounts: props.formData.mounts,
});

watch(
  () => props.formData,
  () => {
    const { mounts } = props.formData;
    form.value = {
      mounts,
    };
  },
  { deep: true },
);
watch(
  form,
  () => {
    emit('valueChange', form.value);
  },
  { deep: true },
);

const mountColumns: TableColumnProps[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '序号',
    customRender: ({ index }) => index + 1,
  },
  {
    key: 'type',
    dataIndex: 'type',
    title: '类型',
  },
  {
    key: 'host',
    dataIndex: 'host',
    title: '主机路径/卷',
  },
  {
    key: 'container',
    dataIndex: 'container',
    title: '容器路径',
  },
  {
    key: 'rw',
    dataIndex: 'rw',
    title: '只读',
  },
  {
    key: 'operate',
    dataIndex: 'operate',
    title: '操作',
  },
];
const getVolumeData = async () => {
  const res = await getVolumeList();
  if (res.success) {
    volumeList.value = res.data;
  }
};

onMounted(async () => {
  getVolumeData();
});

const onRemove = (index: number) => {
  form.value.mounts.splice(index, 1);
};
</script>
