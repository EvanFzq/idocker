<template>
  <div class="volume-item">
    <div class="row name">
      <div class="title">{{ volume.Name }}</div>
      <div @click="onClick">
        <van-icon name="ellipsis" />
      </div>
    </div>
    <div class="row">
      <div @click="onClickContainers">
        <span>容器数量：</span>
        <span
          :style="
            volume.UsageData.RefCount ? 'color:green;text-decoration: underline;' : 'color:red'
          "
        >
          {{ volume.UsageData.RefCount }}
        </span>
      </div>
      <div>创建时间：{{ timeLongFormat(volume.CreatedAt) }}</div>
    </div>
    <div class="row">
      <div>
        <span>大小：</span>
        <span>{{ fileSizeFormat(volume.UsageData.Size) || '0KB' }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';

import type { Volume } from '@common/types/volume';

import { timeLongFormat, fileSizeFormat } from '@/utils/utils';

const props = defineProps<{
  volume: Volume;
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
      type: 'volume',
      name: props.volume.Name,
    },
  });
};
</script>
<style scoped lang="less">
.volume-item {
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
    .title {
      flex: auto;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 12px;
    }
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
