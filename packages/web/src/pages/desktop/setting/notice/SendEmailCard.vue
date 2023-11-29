<template>
  <a-card
    title="通知发件箱"
    style="margin-top: 16px"
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
      <a-row>
        <a-col v-bind="fieldLayout">
          <a-form-item
            label="邮箱类型"
            name="type"
            :rules="[{ required: true, message: '请选择邮箱类型' }]"
          >
            <a-select
              v-model:value="formData.type"
              :options="EmailTypeList"
              placeholder="请选择邮箱类型"
            />
          </a-form-item>
        </a-col>
        <a-col v-bind="fieldLayout">
          <a-form-item
            label="邮箱账号"
            name="account"
            :rules="[
              { required: true, message: '请输入邮箱账号' },
              { type: 'email', message: '请输入邮箱账号' },
            ]"
          >
            <a-input
              v-model:value="formData.account"
              type="email"
              placeholder="请输入邮箱账号"
            />
          </a-form-item>
        </a-col>
        <a-col v-bind="fieldLayout">
          <a-form-item
            name="password"
            :label="formData.type !== EmailType.Outlook ? '授权码' : '邮箱密码'"
            :rules="[
              {
                required: true,
                message: formData.type !== EmailType.Outlook ? '请填写授权码' : '请填写邮箱密码',
              },
            ]"
          >
            <a-input-password
              v-model:value="formData.password"
              :placeholder="formData.type !== EmailType.Outlook ? '请填写授权码' : '请填写邮箱密码'"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { message } from 'ant-design-vue';

import type { NoticeEmail } from '@common/types/setting';
import { EmailType, EmailTypeList } from '@common/constants/enum';

import { updateNoticeInfo } from '@/apis/setting';

import type { FormInstance } from 'ant-design-vue';

const fieldLayout = {
  xs: 24,
  md: 12,
  xl: 8,
};

const props = defineProps<{ data: NoticeEmail | null }>();
const emits = defineEmits(['change']);
const formRef = ref<FormInstance>();
const formData = ref<Partial<NoticeEmail>>({
  ...props.data,
});

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
  const res = await updateNoticeInfo({
    email: formData.value as NoticeEmail,
  });
  if (res.success) {
    message.success('修改成功');
    emits('change', { email: formData.value });
  }
};
</script>
