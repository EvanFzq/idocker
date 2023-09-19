<template>
  <van-cell-group
    class="port-card"
    v-for="(port, index) in portList"
    inset
    style="margin-top: 16px"
  >
    <van-field
      v-model="port.host"
      :name="'ports[' + index + '].host'"
      type="digit"
      label="主机端口"
      placeholder="请输入主机端口"
      required
      :rules="[{ required: true, message: '请填写主机端口' }]"
    />
    <van-field
      v-model="port.container"
      :name="'ports[' + index + '].container'"
      type="digit"
      label="容器端口"
      placeholder="请输入容器端口"
      required
      :rules="[{ required: true, message: '请填写容器端口' }]"
    />
    <van-field
      :name="'ports[' + index + '].protocol'"
      label="协议"
    >
      <template #input>
        <van-radio-group
          v-model="port.protocol"
          direction="horizontal"
        >
          <van-radio name="tcp">TCP</van-radio>
          <van-radio name="udp">UDP</van-radio>
        </van-radio-group>
      </template>
    </van-field>
    <van-button
      icon="delete-o"
      size="small"
      round
      type="danger"
      class="delete-icon"
      @click="() => onDeletePort(index)"
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
      protocol: 'tcp',
    },
  ];
};
const onDeletePort = (index: number) => {
  portList.value.splice(index, 1);
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
.port-card {
  position: relative;
  .delete-icon {
    position: absolute;
    right: 6px;
    top: 6px;
  }
}
</style>
