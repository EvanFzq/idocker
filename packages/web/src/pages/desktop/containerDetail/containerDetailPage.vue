<template>
  <div
    v-if="!detail"
    class="loading"
  >
    <van-loading />
  </div>
  <div
    v-if="detail"
    class="container-detail-page"
  >
    <div class="name">{{ detail.name }}</div>
    <el-tabs
      v-model="activeTab"
      class="tabs"
    >
      <el-tab-pane
        label="信息"
        name="info"
      >
        <ContainerInfo :detail="detail" />
      </el-tab-pane>
      <el-tab-pane
        label="日志"
        name="logs"
      >
        <ContainerLogs :id="route.params.id as string" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import type { ContainerDetail } from '@common/types/container';

import { getContainerDetail } from '@/apis/container';

import ContainerInfo from './containerInfo.vue';
import ContainerLogs from './containerLogs.vue';

const route = useRoute();
const activeTab = ref('info');
const detail = ref<ContainerDetail | null>(null);
onMounted(async () => {
  if (!route.params.id) {
    return;
  }
  const res = await getContainerDetail(route.params.id as string);
  if (res.success) {
    detail.value = res.data;
  }
});
</script>
<style scoped lang="less">
.container-detail-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  .tabs {
    flex: auto;
    display: flex;
    flex-direction: column;
  }
}
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.name {
  font-size: 24px;
  font-weight: 700;
  color: #409eff;
  margin-bottom: 16px;
}
</style>
<style>
.container-detail-page {
  .el-tabs__content {
    flex: auto;
    height: 0;
    .el-tab-pane {
      height: 100%;
      overflow: auto;
    }
  }
}
</style>
