<template>
  <a-card
    title="通知事件"
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
      class="setting-form"
      :model="formData"
      :label-col="{ style: { width: '120px', fontWeight: '500' } }"
      hide-required-mark
    >
      <a-row>
        <a-col
          v-for="item in eventTypeList"
          v-bind="fieldLayout"
          :key="item.key"
        >
          <a-form-item
            :label="item.name"
            :name="item.key"
          >
            <a-checkbox-group
              v-model:value="formData[item.key]"
              :options="
                EventTypeActions[item.key].map(active => ({
                  label: EventActionName[active],
                  value: active,
                }))
              "
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

import { EventTypeName, EventTypeActions, EventActionName } from '@common/constants/enum';

import { updateNoticeInfo } from '@/apis/setting';

import type { FormInstance } from 'ant-design-vue';

const fieldLayout = {
  xs: 24,
  md: 12,
  xl: 8,
};

const props = defineProps<{ data: Record<string, string[]> | null }>();
const emits = defineEmits(['change']);
const formRef = ref<FormInstance>();
const formData = ref<Record<string, string[]>>({
  ...props.data,
});

const eventTypeList = Object.entries(EventTypeName).map(([key, value]) => ({ key, name: value }));

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
    events: {
      container: formData.value.container || [],
      image: formData.value.image || [],
      volume: formData.value.volume || [],
      network: formData.value.network || [],
      daemon: formData.value.daemon || [],
    },
  });
  if (res.success) {
    message.success('修改成功');
    emits('change', { events: formData.value });
  }
};
</script>
