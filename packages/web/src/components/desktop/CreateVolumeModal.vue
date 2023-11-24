<template>
  <a-modal
    :open="open"
    title="创建数据卷"
    ok-text="创建"
    cancel-text="取消"
    destroy-on-close
    :confirm-loading="loading"
    :mask-closable="false"
    @cancel="$emit('update:open', false)"
    @ok="onCreate"
  >
    <a-form
      ref="formRef"
      class="create-volume-form"
      :model="volumeForm"
      :label-col="{ style: { width: '100px' } }"
    >
      <a-form-item
        name="name"
        label="卷名"
        :rules="[{ required: true, message: '请输入卷名' }]"
      >
        <a-input
          v-model:value="volumeForm.name"
          style="width: 100%"
          placeholder="请输入卷名"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { message } from 'ant-design-vue';

import { createVolume } from '@/apis/volume';

import type { FormInstance } from 'ant-design-vue';

const props = defineProps<{ open: boolean }>();
const emits = defineEmits(['update:open', 'created']);
const formRef = ref<FormInstance>();
const loading = ref(false);

const volumeForm = ref({
  name: '',
});

watch(props, () => {
  if (!props.open) {
    volumeForm.value = {
      name: '',
    };
  }
});

const onCreate = async () => {
  await formRef.value?.validate();

  loading.value = true;
  const res = await createVolume(volumeForm.value.name);
  if (res.success) {
    message.success('创建成功');
    emits('update:open', false);
    emits('created');
  }
  loading.value = false;
};
</script>
<style scoped lang="less">
.create-volume-form {
  margin: 16px 0;
}
</style>
