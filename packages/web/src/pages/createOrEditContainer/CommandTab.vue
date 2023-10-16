<template>
  <van-cell-group
    inset
    style="margin-top: 16px"
  >
    <van-field
      v-model="command"
      rows="4"
      autosize
      name="command"
      label="启动命令"
      type="textarea"
      placeholder="请输入启动命令"
    />
  </van-cell-group>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import type { ContainerFormData } from './CreateOrEditContainerPage.vue';

const props = defineProps<{ formData: ContainerFormData }>();
const command = ref(props.formData.command || '');

const emit = defineEmits(['valueChange']);

watch(
  () => props.formData.command,
  () => {
    command.value = props.formData.command;
  },
  { deep: true },
);
watch(
  command,
  () => {
    emit('valueChange', { command: command.value });
  },
  { deep: true },
);
</script>
