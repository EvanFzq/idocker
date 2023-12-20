<template>
  <PageLayout
    title="导航"
    :content-style="{ display: 'flex', paddingLeft: 0 }"
  >
    <template #extra>
      <a-space>
        <a-button
          size="small"
          type="primary"
          :style="isLocal ? '' : 'background:#07c160'"
          @click="isLocal = !isLocal"
        >
          {{ isLocal ? '局域网' : '公网' }}
          <SwapOutlined
            :style="`transition: all 0.5s linear; transform: rotate(${isLocal ? 180 : 0}deg)`"
          />
        </a-button>
        <a-button
          size="small"
          type="link"
          @click="onOpenAlonePage"
        >
          独立页
          <RightOutlined />
        </a-button>
      </a-space>
    </template>
    <AppsPage :is-local="isLocal" />
  </PageLayout>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { RightOutlined, SwapOutlined } from '@ant-design/icons-vue';

import PageLayout from '@/components/desktop/PageLayout.vue';
import AppsPage from '@/pages/common/apps/AppsPage.vue';

const isLocal = ref(true);

const onOpenAlonePage = () => {
  window.open(isLocal.value ? '/apps/local' : '/apps/internet');
};
</script>
