<template>
  <div class="network">
    <van-cell-group
      v-for="(network, key) in networks"
      :key="network.NetworkID"
      inset
      class="network-item"
    >
      <van-cell
        title="类型"
        :value="key"
      />
      <div v-if="key !== 'host'">
        <van-cell
          title="IP"
          :value="network.IPAddress"
        />
        <van-cell
          title="IPv6"
          :value="network.GlobalIPv6Address"
        />
        <van-cell
          title="网关"
          :value="network.Gateway"
        />
        <van-cell
          title="IPv6网关"
          :value="network.IPv6Gateway"
        />
        <van-cell
          title="MAC"
          :value="network.MacAddress"
        />
        <van-cell
          title="NetworkID"
          :value="network.NetworkID"
        />
      </div>
      <div v-if="key === 'host'">
        <van-cell
          title="NetworkID"
          :value="network.NetworkID"
        />
      </div>
    </van-cell-group>
  </div>
</template>
<script lang="ts" setup>
import type { Networks } from '@common/types/container';
defineProps<{ networks?: Networks }>();
</script>
<style scoped lang="less">
.network {
  .network-item {
    margin-bottom: 12px;
  }
}
</style>
