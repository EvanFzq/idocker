<template>
  <TitleBar
    :title="containerDetail.name"
    right-text="修改"
    @click-right="onClickEdit"
  />
  <div class="dashbord">
    <van-circle
      v-model:current-rate="cpuCurrentRate"
      :rate="cpuRate"
      :speed="100"
    >
      <span class="material-icons-outlined icon"> memory </span>
      <div class="value"> {{ cpuRate }}% </div>
      <div class="text"> CPU使用率 </div>
    </van-circle>
    <div>
      <van-tag
        size="large"
        :color="statusColor"
      >
        {{ statusLabel }}
      </van-tag>
      <div
        v-if="localUrl || internetUrl"
        class="url-list"
      >
        <a
          v-if="localUrl"
          :href="localUrl"
          target="_blank"
        >
          内网地址
          <van-icon name="arrow" />
        </a>
        <a
          v-if="internetUrl"
          :href="internetUrl"
          target="_blank"
        >
          外网地址
          <van-icon name="arrow" />
        </a>
      </div>
    </div>
    <van-circle
      v-model:current-rate="memoryCurrentRate"
      :rate="memoryRate"
      :speed="100"
    >
      <span class="material-icons-outlined icon"> keyboard </span>
      <div class="value memory">
        {{ fileSizeFormat(memoryUsage) || '-' }} / {{ fileSizeFormat(memoryLimit) || '-' }}
      </div>
      <div class="text"> 内存使用量 </div>
    </van-circle>
  </div>
  <van-tabs v-model:active="activeTab">
    <van-tab
      class="tab"
      title="基本信息"
    >
      <BaseInfoTab :data="containerDetail" />
    </van-tab>
    <van-tab
      class="tab"
      title="挂载"
    >
      <MountTab :list="containerDetail.mounts" />
    </van-tab>
    <van-tab
      class="tab"
      title="端口"
    >
      <PortTab :data="containerDetail.ports" />
    </van-tab>
    <van-tab
      class="tab"
      title="网络"
    >
      <NetworkTab :networks="containerDetail.networks" />
    </van-tab>
    <van-tab
      class="tab"
      title="变量"
    >
      <EnvVarTab :envs="containerDetail.envs" />
    </van-tab>
    <van-tab
      class="tab"
      title="日志"
    >
      <LogTab :id="id" />
    </van-tab>
  </van-tabs>
</template>
<script lang="ts" setup>
import { ref, onMounted, watchEffect, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import type { ContainerDetail } from '@common/types/container';
import { webUrlTemplateFormat } from '@common/utils/utils';

import { getContainerDetail, getContainerStats } from '@/apis/container';
import TitleBar from '@/components/TitleBar.vue';
import { statusColorMap, statusLabelMap } from '@/constants/container';
import { fileSizeFormat } from '@/utils/utils';

import BaseInfoTab from './BaseInfoTab.vue';
import EnvVarTab from './EnvVarTab.vue';
import LogTab from './LogTab.vue';
import MountTab from './MountTab.vue';
import NetworkTab from './NetworkTab.vue';
import PortTab from './PortTab.vue';

const cpuCurrentRate = ref(0);
const memoryCurrentRate = ref(0);

const cpuRate = ref(0);
const memoryUsage = ref(0);
const memoryLimit = ref(0);
const memoryRate = computed(() =>
  Number(((memoryUsage.value * 100) / memoryLimit.value).toFixed(0)),
);

const containerDetail = ref<Partial<ContainerDetail>>({});
const statusLabel = computed(
  () => containerDetail.value.status && statusLabelMap[containerDetail.value.status],
);
const statusColor = computed(
  () => containerDetail.value.status && statusColorMap[containerDetail.value.status],
);
const localUrl = computed(() => {
  const template = containerDetail.value.localUrl;
  if (!template) return;
  return webUrlTemplateFormat(template, location.host, location.protocol, containerDetail.value);
});
const internetUrl = computed(() => {
  const template = containerDetail.value.internetUrl;
  if (!template) return;
  return webUrlTemplateFormat(template, location.host, location.protocol, containerDetail.value);
});

const activeTab = ref(0);

const route = useRoute();
const router = useRouter();
const id = computed(() => route.params.id as string);

const getStats = async () => {
  const res = await getContainerStats([id.value]);
  if (res.success) {
    cpuRate.value = Math.floor(res.data[0].cpu);
    memoryUsage.value = res.data[0].memoryUsage;
    memoryLimit.value = res.data[0].memoryLimit;
  }
};

onMounted(async () => {
  if (!id.value) {
    return;
  }
  const res = await getContainerDetail(id.value);
  if (res.success) {
    containerDetail.value = res.data;
    await getStats();
  }
});

const onClickEdit = () => {
  router.push({ path: '/container', query: { id: containerDetail.value.id } });
};

watchEffect(cleanUp => {
  if (!id.value || containerDetail.value.status !== 'running') {
    return;
  }
  const timer = setInterval(getStats, 5000);
  cleanUp(() => {
    clearInterval(timer);
  });
});
</script>
<style scoped lang="less">
.dashbord {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 12px;

  .van-circle {
    padding: 12px;
  }

  .icon {
    font-size: 32px;
    color: #1989fa;
    margin-top: 8px;
  }

  .value {
    font-size: 16px;
    margin: 6px;

    &.memory {
      font-size: 12px;
    }
  }

  .text {
    font-size: 10px;
    color: rgba(0, 0, 0, 0.4);
  }
}

.tab {
  padding-top: 12px;
  margin-bottom: 12px;
}
.url-list {
  font-size: 12px;
  margin-top: 24px;
  a {
    display: block;
    text-align: center;
    padding: 4px;
    border-radius: 4px;
    color: #333;
    margin-bottom: 4px;
    background: #fed;
  }
}
</style>
