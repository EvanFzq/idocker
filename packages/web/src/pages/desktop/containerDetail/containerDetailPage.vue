<template>
  <PageLayout
    :breadcrumbs="[
      { to: '/d/container', lable: '容器列表' },
      { lable: '容器详情-' + detail?.name },
    ]"
  >
    <template #right>
      <el-button
        type="primary"
        :icon="Edit"
        @click="onEdit"
      >
        编辑
      </el-button>
    </template>
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
          <ContainerLogs :id="id" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </PageLayout>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Edit } from '@element-plus/icons-vue';

import type { ContainerDetail } from '@common/types/container';

import { getContainerDetail } from '@/apis/container';
import PageLayout from '@/components/desktop/PageLayout.vue';

import ContainerInfo from './containerInfo.vue';
import ContainerLogs from './containerLogs.vue';

const route = useRoute();
const router = useRouter();
const activeTab = ref('info');
const detail = ref<ContainerDetail | null>(null);
const id = computed(() => route.params.id as string);

onMounted(async () => {
  if (!route.params.id) {
    return;
  }
  const res = await getContainerDetail(route.params.id as string);
  if (res.success) {
    detail.value = res.data;
  }
});

const onEdit = () => {
  router.push('/d/container/newOrEdit?id=' + detail.value?.id);
};
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
