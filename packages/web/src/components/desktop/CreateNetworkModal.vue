<template>
  <a-modal
    :open="open"
    title="创建网络"
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
      class="create-network-form"
      :model="networkForm"
      :label-col="{ style: { width: '100px' } }"
    >
      <a-form-item
        name="name"
        label="网络名"
        :rules="[{ required: true, message: '请输入网络名' }]"
      >
        <a-input
          v-model:value="networkForm.name"
          style="width: 100%"
          placeholder="请输入网络名"
        />
      </a-form-item>
      <a-form-item
        name="gateway"
        label="网关"
      >
        <a-input
          v-model:value="networkForm.gateway"
          style="width: 100%"
          placeholder="示例：172.20.0.1"
        />
      </a-form-item>
      <a-form-item
        name="subnet"
        label="子网"
      >
        <a-input
          v-model:value="networkForm.subnet"
          style="width: 100%"
          placeholder="示例：172.20.0.0/16"
        />
      </a-form-item>
      <a-form-item
        name="enableIPv6"
        label="启用IPv6"
      >
        <a-switch v-model:checked="networkForm.enableIPv6" />
      </a-form-item>
      <a-form-item
        v-if="networkForm.enableIPv6"
        name="IPv6gateway"
        label="IPv6网关"
      >
        <a-input
          v-model:value="networkForm.IPv6gateway"
          style="width: 100%"
          placeholder="示例：2001:db8:abcd::1011"
        />
      </a-form-item>
      <a-form-item
        v-if="networkForm.enableIPv6"
        name="IPv6subnet"
        label="IPv6子网"
      >
        <a-input
          v-model:value="networkForm.IPv6subnet"
          style="width: 100%"
          placeholder="示例：2001:db8:abcd::/64"
        />
      </a-form-item>
      <a-form-item name="internal">
        <template #label>
          <span>内部网络</span>
          <a-tooltip
            title="默认创建可与外部链接的网络。
              开启时，将创建外部隔离的网络"
          >
            <QuestionCircleOutlined style="margin-left: 4px" />
          </a-tooltip>
        </template>
        <a-switch v-model:checked="networkForm.internal" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import type { AddNetworkParams } from '@common/types/network';

import { addNetwork } from '@/apis/network';

import type { FormInstance } from 'ant-design-vue';

const props = defineProps<{ open: boolean }>();
const emits = defineEmits(['update:open', 'finish']);
const formRef = ref<FormInstance>();
const loading = ref(false);

const networkForm = ref<AddNetworkParams>({
  name: '',
  gateway: '',
  subnet: '',
  enableIPv6: false,
  IPv6gateway: '',
  IPv6subnet: '',
  internal: false,
});

watch(props, () => {
  if (!props.open) {
    networkForm.value = {
      name: '',
      gateway: '',
      subnet: '',
      enableIPv6: false,
      IPv6gateway: '',
      IPv6subnet: '',
      internal: false,
    };
  }
});

const onCreate = async () => {
  await formRef.value?.validate();
  if (
    (networkForm.value.gateway || networkForm.value.subnet) &&
    !(networkForm.value.gateway && networkForm.value.subnet)
  ) {
    message.error('网关和子网需同时存在！');
    return;
  }
  if (
    (networkForm.value.IPv6gateway || networkForm.value.IPv6subnet) &&
    !(networkForm.value.IPv6gateway && networkForm.value.IPv6subnet)
  ) {
    message.error('网关和子网需同时存在！');
    return;
  }
  loading.value = true;
  const res = await addNetwork(networkForm.value);
  if (res.success) {
    message.success('创建成功');
    emits('update:open', false);
    emits('finish');
  }
  loading.value = false;
};
</script>
<style scoped lang="less">
.create-network-form {
  margin: 16px 0;
}
</style>
