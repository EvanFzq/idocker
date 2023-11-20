<template>
  <div>
    <div
      v-for="(line, index) in lines"
      :key="index"
      class="line"
    >
      <div class="date">
        {{ dayjs(line.date).format('YY-MM-DD HH:mm:ss') }}
      </div>
      <div class="text">
        {{ line.text }}
      </div>
    </div>
    <p class="tips"> 展示最近200条日志 </p>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import dayjs from 'dayjs';

import { getContainerLogs } from '@/apis/container';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const lines = ref<{ date: string; text: string }[]>([]);

onMounted(async () => {
  const res = await getContainerLogs(props.id);
  if (res.success) {
    lines.value = res.data;
  }
});
</script>
<style lang="less" scoped>
.line {
  display: flex;
  font-size: 10px;
  margin: 6px;
  padding: 6px 12px;
  background-color: #fff;

  .date {
    width: 64px;
    flex: none;
    color: #1989fa;
    line-height: 20px;
  }

  .text {
    color: rgba(0, 0, 0, 0.6);
    word-break: break-all;
    line-height: 16px;
  }
}

.tips {
  color: rgba(0, 0, 0, 0.6);
  margin-top: 16px;
  text-align: center;
  font-size: 10px;
}
</style>
