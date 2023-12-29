<template>
  <a-card
    class="form-card"
    title="端口配置"
  >
    <template #extra>
      <a-button
        class="button"
        size="small"
        type="link"
        @click="form.ports?.push({ protocol: 'tcp' } as PortConfig)"
      >
        增加端口
      </a-button>
    </template>
    <a-table
      :data-source="form.ports"
      :columns="portColumns"
      size="middle"
      :pagination="false"
    >
      <template #emptyText>
        无条目，
        <a-button
          size="small"
          type="link"
          @click="form.ports?.push({ protocol: 'tcp' } as PortConfig)"
        >
          请添加
        </a-button>
      </template>
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'host'">
          <a-form-item
            label-width="0"
            :name="['ports', index, 'host']"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <a-input-number
              v-model:value="record.host"
              :precision="0"
              :min="1"
              :max="65535"
              placeholder="请输入"
              style="width: 100%"
            />
          </a-form-item>
        </template>
        <template v-if="column.key === 'container'">
          <a-form-item
            label-width="0"
            :name="['ports', index, 'container']"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <a-input-number
              v-model:value="record.container"
              :precision="0"
              :min="1"
              :max="65535"
              placeholder="请输入"
              style="width: 100%"
            />
          </a-form-item>
        </template>
        <template v-if="column.key === 'protocol'">
          <a-form-item
            label-width="0"
            :name="['ports', index, 'protocol']"
            :rules="[{ required: true, message: '请选择' }]"
          >
            <a-select
              v-model:value="record.protocol"
              placeholder="请选择"
              style="width: 100%"
              :options="[
                { label: 'TCP', value: 'tcp' },
                { label: 'UDP', value: 'udp' },
              ]"
            />
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
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';

import type { PortConfig } from '@common/types/network';

import type { FormData } from './type';
import type { TableColumnProps } from 'ant-design-vue';

const props = defineProps<{ formData: FormData }>();
const emit = defineEmits(['valueChange']);

const form = ref<Pick<FormData, 'ports'>>({
  ports: props.formData.ports,
});

watch(
  () => props.formData,
  () => {
    const { ports } = props.formData;
    form.value = {
      ports,
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

const portColumns: TableColumnProps[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '序号',
    customRender: ({ index }) => index + 1,
  },
  {
    key: 'host',
    dataIndex: 'host',
    title: '主机端口',
  },
  {
    key: 'container',
    dataIndex: 'container',
    title: '容器端口',
  },
  {
    key: 'protocol',
    dataIndex: 'protocol',
    title: '协议',
  },
  {
    key: 'operate',
    dataIndex: 'operate',
    title: '操作',
  },
];

const onRemove = (index: number) => {
  form.value.ports.splice(index, 1);
};
</script>
