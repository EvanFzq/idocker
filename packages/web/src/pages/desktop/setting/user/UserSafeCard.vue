<template>
  <a-card
    title="用户安全"
    style="margin-top: 16px"
    hoverable
  >
    <template #extra>
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
      <a-form-item
        label="密码尝试次数"
        name="passwordMaxRetryNum"
        :rules="[{ required: true, message: '请输入密码尝试次数' }]"
      >
        <a-input-number
          v-model:value="formData.passwordMaxRetryNum"
          style="width: 100%"
          placeholder="请输入密码尝试次数"
          :max="100"
          :min="1"
          :precision="0"
        />
      </a-form-item>
    </a-form>
  </a-card>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { message } from 'ant-design-vue';

import { updateUserInfo } from '@/apis/setting';

import type { FormInstance } from 'ant-design-vue';

interface FormData {
  passwordMaxRetryNum?: number;
}

const props = defineProps<{ data: FormData }>();
const emits = defineEmits(['change']);
const formRef = ref<FormInstance>();
const formData = ref<FormData>({ ...props.data });

watch(
  () => props.data,
  () => {
    formData.value = {
      ...props.data,
    };
  },
);

const canSave = computed(() => JSON.stringify(props.data) !== JSON.stringify(formData.value));

const onSubmit = async () => {
  await formRef.value?.validate();
  const res = await updateUserInfo({
    passwordMaxRetryNum: formData.value.passwordMaxRetryNum,
  });
  if (res.success) {
    message.success('修改成功');
    emits('change', { passwordMaxRetryNum: formData.value.passwordMaxRetryNum });
  }
};
</script>
