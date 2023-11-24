<template>
  <div class="volume-list-page">
    <VolumeFilter @reload="getList()" />
    <VolumeTable
      :list="list"
      :loading="loading"
      @reload="getList()"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';

import type { Volume } from '@common/types/volume';

import { getVolumeList } from '@/apis';

import VolumeTable from './volumeTable.vue';
import VolumeFilter from './volumeFilter.vue';

const list = ref<Volume[]>([]);
const loading = ref(false);

const getList = async () => {
  loading.value = true;
  const res = await getVolumeList();
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
.volume-list-page {
  padding: 24px;
}
</style>
