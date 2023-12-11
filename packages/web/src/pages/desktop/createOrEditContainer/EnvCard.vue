<template>
  <a-card
    class="form-card"
    title="环境变量配置"
  >
    <template #extra>
      <a-button
        class="button"
        size="small"
        type="link"
        @click="form.envs?.push({ envKey: '', envValue: '' })"
      >
        增加环境变量
      </a-button>
    </template>
    <a-table
      :data-source="form.envs"
      :columns="envColumns"
      size="middle"
      :pagination="false"
    >
      <template #emptyText> 无条目，请添加 </template>
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'envKey'">
          <a-form-item
            label-width="0"
            :name="['envs', index, 'envKey']"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <a-input
              v-model:value="record.envKey"
              placeholder="请输入"
              style="width: 100%"
            />
          </a-form-item>
        </template>
        <template v-if="column.key === 'envValue'">
          <a-form-item
            label-width="0"
            :name="['envs', index, 'envValue']"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <a-input
              v-model:value="record.envValue"
              placeholder="请输入"
              style="width: 100%"
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

import type { FormData } from './type';
import type { TableColumnProps } from 'ant-design-vue';

const props = defineProps<{ formData: FormData }>();
const emit = defineEmits(['valueChange']);

const form = ref<Pick<FormData, 'envs'>>({
  envs: [],
});

watch(
  () => props.formData,
  () => {
    const { envs } = props.formData;
    form.value = {
      envs,
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

const envColumns: TableColumnProps[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '序号',
    customRender: ({ index }) => index + 1,
  },
  {
    key: 'envKey',
    dataIndex: 'envKey',
    title: '键',
  },
  {
    key: 'envValue',
    dataIndex: 'envValue',
    title: '值',
  },
  {
    key: 'operate',
    dataIndex: 'operate',
    title: '操作',
  },
];

const onRemove = (index: number) => {
  form.value.envs.splice(index, 1);
};
</script>
