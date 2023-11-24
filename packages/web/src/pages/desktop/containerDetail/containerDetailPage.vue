<template>
  <PageLayout
    :breadcrumbs="[
      { path: '/d/container/list', breadcrumbName: '容器列表' },
      { breadcrumbName: '容器详情' },
    ]"
    :title="detail?.name"
  >
    <template #extra>
      <a-button
        type="primary"
        :icon="h(EditOutlined)"
        @click="onEdit"
      >
        编辑
      </a-button>
    </template>
    <div
      v-if="!detail"
      class="loading"
    >
      <Spin />
    </div>
    <div
      v-if="detail"
      class="container-detail-page"
    >
      <a-tabs
        v-model:activeKey="activeTab"
        class="tabs"
      >
        <a-tab-pane
          key="info"
          tab="信息"
        >
          <ContainerInfo :detail="detail" />
        </a-tab-pane>
        <a-tab-pane
          key="logs"
          tab="日志"
        >
          <ContainerLogs :id="id" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </PageLayout>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, h } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { EditOutlined } from '@ant-design/icons-vue';
import { Spin } from 'ant-design-vue';

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
