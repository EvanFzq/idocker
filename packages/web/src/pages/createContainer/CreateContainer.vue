<template>
  <div>
    <van-nav-bar
      title="创建容器"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-form @submit="onSubmit">
      <Baseinfo />
      <van-tabs v-model:active="activeTab">
        <van-tab
          class="tab"
          title="命令"
        >
          <Command />
        </van-tab>
        <van-tab
          class="port"
          title="端口"
        >
          <Port />
        </van-tab>
      </van-tabs>
      <div style="margin: 16px">
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
import Baseinfo from './Baseinfo.vue';
import Command from './Command.vue';
import Port from './Port.vue';

const activeTab = ref(0);

const onSubmit = (values: any) => {
  console.log(values);
};

const onClickLeft = () => history.back();
</script>
<style scoped lang="less">
.tab {
  padding-top: 12px;
}
</style>
