<template>
  <div class="image-list-page">
    <ImageFilter @reload="getList()" />
    <ImageTable
      :list="list"
      :loading="loading"
      @reload="getList()"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';

import type { ImageItem } from '@common/types/image';

import { getImageList } from '@/apis';

import ImageTable from './imageTable.vue';
import ImageFilter from './imageFilter.vue';

const list = ref<ImageItem[]>([]);
const loading = ref(false);

const getList = async () => {
  loading.value = true;
  const res = await getImageList();
  if (res.success) {
    list.value = res.data;
  }
  loading.value = false;
};

onMounted(async () => {
  getList();
});
</script>
<style scoped lang="less">
.image-list-page {
  padding: 24px;
}
</style>
