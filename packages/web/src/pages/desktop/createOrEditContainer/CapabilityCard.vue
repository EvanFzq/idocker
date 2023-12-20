<template>
  <a-card
    class="form-card"
    title="能力配置"
  >
    <a-row>
      <a-col :span="6">
        <a-form-item
          label="特权模式"
          name="privileged"
        >
          <a-switch v-model:checked="form.privileged" />
        </a-form-item>
      </a-col>
      <a-col
        v-if="!form.privileged"
        :span="8"
      >
        <a-form-item
          label="CPU限制"
          name="nanoCpus"
        >
          <a-slider
            v-model:value="form.nanoCpus"
            :max="cpuNum"
            :step="0.1"
            :marks="{
              0: '0',
              [cpuNum]: cpuNum,
            }"
          />
        </a-form-item>
      </a-col>
      <a-col
        v-if="!form.privileged"
        :span="8"
        :offset="1"
      >
        <a-form-item
          label="内存限制(MB)"
          name="memory"
        >
          <a-slider
            v-model:value="form.memory"
            :max="memTotal"
            :marks="{
              0: '0',
              [memTotal]: memFormatter(memTotal),
            }"
            :tip-formatter="memFormatter"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-typography-title
      v-if="!form.privileged"
      :level="4"
    >
      能力
      <a-button
        type="link"
        @click="onReset"
      >
        重置
      </a-button>
    </a-typography-title>
    <a-row v-if="!form.privileged">
      <a-col
        v-for="item in Capability"
        :key="item"
        :xs="24"
        :md="12"
        :lg="8"
        :xl="6"
        style="display: flex; justify-content: space-between; padding: 6px 0; padding-right: 64px"
      >
        <div>{{ item }}:</div>
        <a-switch
          :checked="form.capAdd?.includes(item)"
          @change="(checked: boolean) => onCapabilityChange(checked, item)"
        />
      </a-col>
    </a-row>
  </a-card>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

import { Capability, defaultCapability } from '@common/constants/enum';

import { getSystemInfo } from '@/apis/setting';

import type { FormData } from './type';

const props = defineProps<{ formData: FormData }>();
const emit = defineEmits(['valueChange']);

const form = ref<Pick<FormData, 'privileged' | 'capAdd' | 'capDrop' | 'memory' | 'nanoCpus'>>({
  privileged: props.formData.privileged,
  capAdd: props.formData.capAdd,
  capDrop: props.formData.capDrop,
  memory: props.formData.memory,
  nanoCpus: props.formData.nanoCpus,
});
const cpuNum = ref(0);
const memTotal = ref(0);

watch(
  () => props.formData,
  () => {
    const { privileged, capAdd, capDrop, memory, nanoCpus } = props.formData;
    form.value = {
      privileged,
      capAdd,
      capDrop,
      memory,
      nanoCpus,
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
onMounted(async () => {
  const res = await getSystemInfo();
  if (res.success) {
    cpuNum.value = res.data.nCPU || 0;
    memTotal.value = Math.floor((res.data.memTotal || 0) / (1024 * 1024));
  }
});

const memFormatter = (value: number) =>
  value > 1024 ? `${(value / 1024).toFixed(1)}GB` : `${value}MB`;

const onCapabilityChange = (checked: boolean, capability: string) => {
  if (checked) {
    form.value.capAdd?.push(capability);
    form.value.capDrop = form.value.capDrop?.filter(item => item !== capability);
  } else {
    form.value.capAdd = form.value.capAdd?.filter(item => item !== capability);
    form.value.capDrop?.push(capability);
  }
};
const onReset = () => {
  form.value.capAdd = defaultCapability;
  form.value.capDrop = Object.keys(Capability).filter(
    capability => !defaultCapability.includes(capability),
  );
};
</script>
