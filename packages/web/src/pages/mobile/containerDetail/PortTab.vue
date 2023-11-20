<template>
  <div class="port">
    <van-cell-group inset>
      <van-cell
        title-class="port-title"
        value-class="port-title"
        title="主机端口"
        value="容器端口"
      />
      <van-cell
        v-for="(item, index) in data"
        :key="index"
        :title="item.hostPort || '未绑定'"
        :value="item.containerPort + '/' + item.protocol"
      />
    </van-cell-group>
  </div>
</template>
<script lang="ts" setup>
import type { Port } from '@common/types/container';
defineProps<{ data?: Port[] }>();
</script>
<style lang="less">
.port {
  .port-title {
    font-weight: 700;
    font-size: 16px;
    color: #1989fa;
  }
}
</style>
