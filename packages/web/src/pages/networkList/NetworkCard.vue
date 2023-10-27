<template>
  <div class="network-item">
    <div class="row name">
      <div>{{ network.Name }}</div>
      <div @click="onClick">
        <van-icon name="ellipsis" />
      </div>
    </div>
    <div class="row">
      <div @click="onClickContainers">
        <span>容器数量：</span>
        <span :style="network.Containers ? 'color:green;text-decoration: underline;' : 'color:red'">
          {{ network.Containers }}
        </span>
      </div>
      <div>创建时间：{{ timeLongFormat(network.Created) }}</div>
    </div>
    <div class="row">
      <div>
        <span>网关：</span>
        <span>{{ network.IPAM.Config?.[0]?.Gateway }}</span>
      </div>
      <div>
        <span>子网掩码：</span>
        <span>{{ network.IPAM.Config?.[0]?.Subnet }}</span>
      </div>
    </div>
    <div class="row">
      <div>
        <span>IPv6：</span>
        <span>{{ network.EnableIPv6 ? '是' : '否' }}</span>
      </div>
      <div>
        <span>内部网络：</span>
        <span>{{ network.Internal ? '是' : '否' }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';

import type { Network } from '@common/types/network';

import { timeLongFormat } from '@/utils/utils';

const props = defineProps<{
  network: Network;
}>();
const emit = defineEmits(['click']);
const router = useRouter();

const onClick = () => {
  emit('click');
};
const onClickContainers = () => {
  router.push({
    path: '/container/list',
    query: {
      type: 'network',
      id: props.network.Id,
      name: props.network.Name,
    },
  });
};
</script>
<style scoped lang="less">
.network-item {
  background-color: #fff;
  margin: 12px;
  padding: 8px;
  .row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    font-size: 10px;
    color: rgba(0, 0, 0, 0.5);
  }
  .name {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.87);
  }
  .row + .row {
    margin-top: 6px;
  }
  .tag-row {
    flex: auto;
  }
  .tag {
    margin-right: 6px;
    margin-bottom: 6px;
  }
  .size {
    flex: none;
  }
}
</style>
