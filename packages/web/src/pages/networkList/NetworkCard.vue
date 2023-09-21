<template>
  <div class="network-item">
    <div class="row name">
      <div>{{ network.Name }}</div>
      <div @click="onClick">
        <van-icon name="ellipsis" />
      </div>
    </div>
    <div class="row">
      <div>
        <span>容器数量：</span>
        <span :style="network.Containers ? 'color:green' : 'color:red'">{{
          network.Containers
        }}</span>
      </div>
      <div>创建时间：{{ timeLongFormat(network.Created) }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Network } from '@common/types/network';
import { timeLongFormat } from '@/utils/utils';

defineProps<{
  network: Network;
}>();
const emit = defineEmits(['click']);

const onClick = () => {
  emit('click');
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
