<template>
  <a-card
    title="镜像源设置"
    style="margin-top: 16px"
    hoverable
  >
    <template #extra>
      <a-button
        class="button"
        size="small"
        type="link"
        style="margin-right: 12px"
        @click="formData.push({} as DockerRegistry)"
      >
        增加镜像源
      </a-button>
      <a-button
        type="primary"
        :disabled="!canSave"
        @click="onSubmit"
      >
        保存
      </a-button>
    </template>
    <a-form
      ref="formRef"
      :model="formData"
      :label-col="{ style: { width: '120px', fontWeight: '500' } }"
      hide-required-mark
    >
      <a-table
        :data-source="formData"
        :columns="columns"
        size="middle"
        :pagination="false"
      >
        <template #headerCell="{ column }">
          <template v-if="['username', 'password'].includes(column.key)">
            <a-tooltip>
              <template #title>可选，需要身份认证的源需要该字段</template>
              <span> {{ column.key }} (可选) <QuestionCircleOutlined /></span>
            </a-tooltip>
          </template>
        </template>
        <template #emptyText>
          无条目，
          <a-button
            size="small"
            type="link"
            @click="formData.push({} as DockerRegistry)"
          >
            请添加
          </a-button>
        </template>
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'name'">
            <a-form-item
              label-width="0"
              :name="[index, 'name']"
              :rules="[{ required: true, message: '请输入' }]"
            >
              <a-input
                v-model:value="record.name"
                :disabled="record.url === 'hub.docker.com'"
                placeholder="请输入"
                style="width: 100%"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'url'">
            <a-form-item
              label-width="0"
              :name="[index, 'url']"
              :rules="[{ required: true, message: '请输入' }]"
            >
              <a-input
                v-model:value="record.url"
                :disabled="record.url === 'hub.docker.com'"
                placeholder="请输入，例：10.0.0.10:5000 或 myregistry.domain.tld"
                style="width: 100%"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'username'">
            <a-form-item
              label-width="0"
              :name="[index, 'username']"
            >
              <a-input
                v-model:value="record.username"
                :disabled="record.url === 'hub.docker.com'"
                placeholder="请输入"
                style="width: 100%"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'password'">
            <a-form-item
              label-width="0"
              :name="[index, 'password']"
            >
              <a-input
                v-model:value="record.password"
                :disabled="record.url === 'hub.docker.com'"
                placeholder="请输入"
                style="width: 100%"
              />
            </a-form-item>
          </template>
          <template v-if="column.key === 'operate'">
            <a-button
              type="link"
              danger
              :disabled="record.url === 'hub.docker.com'"
              @click="onRemove(index)"
            >
              移除
            </a-button>
          </template>
        </template>
      </a-table>
    </a-form>
  </a-card>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { message } from 'ant-design-vue';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';

import type { DockerRegistry } from '@common/types/setting';

import { updateRegistryList } from '@/apis/setting';

import type { FormInstance, TableColumnProps } from 'ant-design-vue';

const props = defineProps<{ data: DockerRegistry[] }>();
const emits = defineEmits(['change']);
const formRef = ref<FormInstance>();
const formData = ref<DockerRegistry[]>(JSON.parse(JSON.stringify(props.data)));

const columns: TableColumnProps[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '序号',
    width: 50,
    customRender: ({ index }) => index + 1,
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: '名称',
    width: 100,
  },
  {
    key: 'url',
    dataIndex: 'url',
    title: '源地址',
    width: 200,
  },
  {
    key: 'username',
    dataIndex: 'username',
    title: 'username(可选)',
    width: 100,
  },
  {
    key: 'password',
    dataIndex: 'password',
    title: 'password(可选)',
    width: 100,
  },
  {
    key: 'operate',
    dataIndex: 'operate',
    title: '操作',
    width: 50,
  },
];

watch(
  () => props.data,
  () => {
    formData.value = JSON.parse(JSON.stringify(props.data));
  },
);

const canSave = computed(() => JSON.stringify(props.data) !== JSON.stringify(formData.value));

const onSubmit = async () => {
  await formRef.value?.validate();
  const res = await updateRegistryList(formData.value);
  if (res.success) {
    message.success('修改成功');
    emits('change', { registrys: formData.value });
  }
};

const onRemove = (index: number) => {
  formData.value.splice(index, 1);
};
</script>
