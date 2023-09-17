<template>
  <van-cell-group
    v-for="(port, index) in portList"
    inset
    style="margin-top: 16px"
  >
    <van-field
      v-model="port.host"
      :name="'port[' + index + '].host'"
      type="digit"
      label="主机端口"
      placeholder="请输入主机端口"
    />
    <van-field
      v-model="port.container"
      :name="'port[' + index + '].container'"
      type="digit"
      label="容器端口"
      placeholder="请输入容器端口"
    />
  </van-cell-group>
  <div class="add-port">
    <van-button
      size="small"
      class="add-port-btn"
      @click="onAddPort"
      >新增端口配置</van-button
    >
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { PortConfig } from '@common/types/network';

const portList = ref<PortConfig[]>([]);

const onAddPort = () => {
  portList.value = [
    ...portList.value,
    {
      host: undefined,
      container: undefined,
      type: 'tcp',
    },
  ];
};
</script>
<style scoped lang="less">
.add-port {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  margin-bottom: 32px;
  box-sizing: border-box;
  .add-port-btn {
    width: 80%;
  }
}
</style>
