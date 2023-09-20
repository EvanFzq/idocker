<template>
  <div class="page">
    <van-nav-bar
      title="创建容器"
      left-text="返回"
      left-arrow
      class="title"
      @click-left="onClickLeft"
    />
    <van-form
      class="form"
      @submit="onSubmit"
      @failed="onFailed"
    >
      <BaseinfoCard @network-change="(value: string) => (networkType = value)" />
      <van-tabs
        v-model:active="activeTab"
        class="tabs"
      >
        <van-tab
          class="tab"
          title="命令"
        >
          <CommandTab />
        </van-tab>
        <van-tab
          v-if="networkType !== 'host'"
          class="tab"
          title="端口"
          :dot="portError"
        >
          <PortTab />
        </van-tab>
        <van-tab
          class="tab"
          title="挂载"
          :dot="mountError"
        >
          <MountTab />
        </van-tab>
        <van-tab
          class="tab"
          title="环境变量"
          :dot="envError"
        >
          <EnvVarTab />
        </van-tab>
      </van-tabs>
      <div class="submit-btn van-safe-area-bottom">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
        >
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { showSuccessToast, showLoadingToast } from 'vant';
import { useRouter } from 'vue-router';
import set from 'lodash-es/set';
import type { CreateContainerParams } from '@common/types/container';
import BaseinfoCard from './BaseinfoCard.vue';
import CommandTab from './CommandTab.vue';
import MountTab from './MountTab.vue';
import PortTab from './PortTab.vue';
import EnvVarTab from './EnvVarTab.vue';
import { createContainer } from '@/apis';

const activeTab = ref(0);
const networkType = ref('');
const portError = ref(false);
const mountError = ref(false);
const envError = ref(false);

const router = useRouter();

const onSubmit = async (values: Record<string, string | number | boolean>) => {
  showLoadingToast({
    message: '创建中...',
    forbidClick: true,
    duration: 0,
  });
  const params: CreateContainerParams = {} as CreateContainerParams;
  Object.entries(values).forEach(([key, value]: [string, string | number | boolean]) => {
    set(params, key, value);
  });

  const res = await createContainer(params);
  if (res.success) {
    showSuccessToast({
      message: '创建成功',
      onClose() {
        router.push('/');
      },
    });
  }
};

const onFailed = (errorInfo: { values: object; errors: { message: string; name: string }[] }) => {
  mountError.value = false;
  portError.value = false;
  envError.value = false;
  errorInfo.errors.forEach(item => {
    if (item.name.startsWith('mounts')) {
      mountError.value = true;
    }
    if (item.name.startsWith('ports')) {
      portError.value = true;
    }
    if (item.name.startsWith('envs')) {
      envError.value = true;
    }
  });
};

const onClickLeft = () => history.back();
</script>
<style scoped lang="less">
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.title {
  flex: none;
}
.form {
  flex: auto;
  height: 0;
  overflow-x: auto;
}
.tabs {
  margin-top: 12px;
}
.tab {
  margin-bottom: 72px;
}
.submit-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  padding: 12px;
  box-sizing: border-box;
  background-color: #fff;
}
</style>
