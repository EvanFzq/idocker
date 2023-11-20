<template>
  <div class="network">
    <van-cell-group
      v-for="network in networks"
      :key="network.id"
      inset
      class="network-item"
    >
      <van-cell
        title="类型"
        :value="network.type"
      />
      <div v-if="network.type !== 'host'">
        <van-cell
          title="NetworkID"
          :value="network.id.slice(0, 8)"
        />
        <van-cell
          title="IP"
          :value="network.ip ? network.ip + ' / ' + network.prefixLen : '-'"
        />
        <van-cell
          title="IPv6"
          :value="network.ipV6 ? network.ipV6 + ' / ' + network.prefixLenV6 : '-'"
        />
        <van-cell
          title="网关"
          :value="network.gateway ? network.gateway + ' / ' + network.prefixLen : '-'"
        />
        <van-cell
          title="IPv6网关"
          :value="network.gatewayV6 ? network.gatewayV6 + ' / ' + network.prefixLenV6 : '-'"
        />
        <van-cell
          title="MAC"
          :value="network.mac"
        />
      </div>
      <div v-if="network.type === 'host'">
        <van-cell
          title="NetworkID"
          :value="network.id"
        />
      </div>
    </van-cell-group>
  </div>
</template>
<script lang="ts" setup>
import type { Network } from '@common/types/container';
defineProps<{ networks?: Network[] }>();
</script>
<style scoped lang="less">
.network {
  .network-item {
    margin-bottom: 12px;
  }
}
</style>
