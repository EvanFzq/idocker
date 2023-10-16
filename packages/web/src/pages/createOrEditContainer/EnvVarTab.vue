<template>
  <van-cell-group
    v-for="(env, index) in envList"
    :key="index"
    class="env-card"
    inset
    style="margin-top: 16px; padding-right: 36px"
  >
    <van-field
      v-model="env.key"
      :name="'envs[' + index + '].key'"
      label="键"
      placeholder="请输入键"
      required
      :rules="[{ required: true, message: '请填写键' }]"
    />
    <van-field
      v-model="env.value"
      :name="'envs[' + index + '].value'"
      label="值"
      placeholder="请输入值"
      required
      :rules="[{ required: true, message: '请填写值' }]"
    />
    <van-button
      icon="delete-o"
      size="small"
      round
      type="danger"
      class="delete-icon"
      @click="() => onDeleteEnv(index)"
    />
  </van-cell-group>
  <div class="add-env">
    <van-button
      size="small"
      class="add-env-btn"
      @click="onAddEnv"
    >
      新增环境变量
    </van-button>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import type { ContainerFormData } from './CreateOrEditContainerPage.vue';

const props = defineProps<{ formData: ContainerFormData }>();

interface Env {
  key: string;
  value: string;
}

const envList = ref<Env[]>(props.formData.envs || []);

const emit = defineEmits(['valueChange']);

watch(
  () => props.formData.envs,
  () => {
    envList.value = props.formData.envs;
  },
  { deep: true },
);
watch(
  envList,
  () => {
    emit('valueChange', { envs: envList.value });
  },
  { deep: true },
);

const onAddEnv = () => {
  envList.value = [
    ...envList.value,
    {
      key: '',
      value: '',
    },
  ];
};
const onDeleteEnv = (index: number) => {
  envList.value.splice(index, 1);
};
</script>
<style scoped lang="less">
.add-env {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  margin-bottom: 32px;
  box-sizing: border-box;
  .add-env-btn {
    width: 80%;
  }
}
.env-card {
  position: relative;
  .delete-icon {
    position: absolute;
    right: 6px;
    top: 6px;
  }
}
</style>
