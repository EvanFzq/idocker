<template>
  <ul
    class="infinite-list"
    style="overflow: auto"
  >
    <li
      v-for="(line, index) in lines"
      :key="index"
      class="infinite-list-item"
    >
      <span class="date">{{ dayjs(line.date).format('YYYY-MM-DD HH:mm:ss.SSS') }}</span>
      <span> {{ line.text }}</span>
    </li>
    <li
      v-if="hasMore"
      id="logHasMore"
    >
      加载更多...
    </li>
  </ul>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { getContainerLogs } from '@/apis/container';

dayjs.extend(utc);

const props = defineProps<{ id: string }>();
const lines = ref<{ date: string; text: string }[]>([]);
const hasMore = ref(true);
const isLoading = ref(false);

const num = 100; //200条
let endTime = dayjs().utc().format('YYYY-MM-DDTHH:mm:ss') + '.000000000Z';

const load = async () => {
  if (isLoading.value) {
    return;
  }
  isLoading.value = true;
  const res = await getContainerLogs(props.id, endTime, num);
  if (res.success) {
    if (res.data.length === 0) {
      hasMore.value = false;
      return;
    }
    lines.value = lines.value.concat(res.data);
    endTime = lines.value[lines.value.length - 1].date;
  }
  isLoading.value = false;
};

const addMoreListen = () => {
  const observer = new IntersectionObserver(
    function () {
      if (hasMore.value) {
        load();
      }
    },
    {
      threshold: [0.5],
    },
  );
  const ele = document.querySelector('#logHasMore');
  if (ele) {
    observer.observe(ele);
  }
};
onMounted(() => {
  load();
  addMoreListen();
});
</script>
<style scoped lang="less">
.infinite-list {
  height: 100%;
  padding: 0;
  margin: 0;
  list-style: none;
  li {
    color: #777;
  }
}

.date {
  margin-right: 12px;
  color: #409eff;
}
</style>
