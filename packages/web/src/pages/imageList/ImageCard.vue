<template>
  <div class="image-item">
    <div class="row name">
      <div>{{ image.Name }}</div>
      <div @click="onClick">
        <van-icon name="ellipsis" />
      </div>
    </div>
    <div class="row">
      <div>
        <span>容器数量：</span>
        <span :style="image.Containers ? 'color:green' : 'color:red'">{{ image.Containers }}</span>
      </div>
      <div>创建时间：{{ timeLongFormat(dayjs.unix(image.Created)) }}</div>
    </div>
    <div class="row">
      <div class="tag-row">
        <van-tag
          v-for="tag in image.Tags"
          :key="tag"
          class="tag"
          type="primary"
        >
          {{ tag }}
        </van-tag>
      </div>
      <div class="size"> 大小：{{ fileSizeFormat(image.Size) }} </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs';
import type { ImageItem } from '@common/types/image';
import { fileSizeFormat, timeLongFormat } from '@/utils/utils';

defineProps<{
  image: ImageItem;
}>();
const emit = defineEmits(['click']);

const onClick = () => {
  emit('click');
};
</script>
<style scoped lang="less">
.image-item {
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
