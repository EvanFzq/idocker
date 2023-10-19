<template>
  <TitleBar
    :title="containerDetail.Name?.slice(1)"
    :right-text="isSelf(containerDetail) ? undefined : '修改'"
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
      <div class="url-list">
        <a
          :href="localUrl"
          target="_blank"
        >
          内网地址
          <van-icon name="arrow" />
        </a>
        <a
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
      <BaseInfoTab
        :id="containerDetail.Id"
        :name="containerDetail.Name?.slice(1)"
        :image="containerDetail.Config?.Image"
        :start-time="containerDetail.State?.StartedAt"
        :create-time="containerDetail.Created"
        :cmd="containerDetail.Config?.Cmd"
        :entrypoint="containerDetail.Config?.Entrypoint"
        :restart="restart"
      />
    </van-tab>
    <van-tab
      class="tab"
      title="挂载"
    >
      <MountTab :list="containerDetail.Mounts" />
    </van-tab>
    <van-tab
      class="tab"
      title="端口"
    >
      <PortTab :data="containerDetail.HostConfig?.PortBindings" />
    </van-tab>
    <van-tab
      class="tab"
      title="网络"
    >
      <NetworkTab :networks="containerDetail.NetworkSettings?.Networks" />
    </van-tab>
    <van-tab
      class="tab"
      title="变量"
    >
      <EnvVarTab :envs="containerDetail.Config?.Env" />
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
import { getContainerDetail, getContainerStats } from '@/apis/container';
import type { Container } from '@common/types/container';
import { restartPolicyList } from '@common/constants/const';
import { fileSizeFormat, webUrlTemplateFormat } from '@/utils/utils';
import { isSelf } from '@/utils/docker';
import { statusColorMap, statusLabelMap } from '@/constants/container';
import TitleBar from '@/components/TitleBar.vue';
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

const containerDetail = ref<Partial<Container>>({});
const statusLabel = computed(
  () => containerDetail.value.State?.Status && statusLabelMap[containerDetail.value.State?.Status],
);
const statusColor = computed(
  () => containerDetail.value.State?.Status && statusColorMap[containerDetail.value.State?.Status],
);
const localUrl = computed(() => {
  const template = containerDetail.value.Config?.Labels['docker.mobile.localUrl'];
  if (!template) return;
  return webUrlTemplateFormat(template, containerDetail.value);
});
const internetUrl = computed(() => {
  const template = containerDetail.value.Config?.Labels['docker.mobile.internetUrl'];
  if (!template) return;
  return webUrlTemplateFormat(template, containerDetail.value);
});

// 'docker.mobile.localUrl': params.localUrl,
//         'docker.mobile.internetUrl': params.internetUrl,

const activeTab = ref(0);

const route = useRoute();
const router = useRouter();
const id = computed(() => route.params.id as string);

const restart = computed(
  () =>
    containerDetail.value.HostConfig?.RestartPolicy?.Name &&
    restartPolicyList.find(
      item => item.value === containerDetail.value.HostConfig?.RestartPolicy.Name,
    )?.text + `【${containerDetail.value.HostConfig?.RestartPolicy?.MaximumRetryCount}次】`,
);

const getStats = async () => {
  const res = await getContainerStats([id.value]);
  if (res.success) {
    cpuRate.value = Math.floor(res.data[0].cpu);
    memoryUsage.value = res.data[0].memory_usage;
    memoryLimit.value = res.data[0].memory_limit;
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
  router.push({ path: '/container', query: { id: containerDetail.value.Id } });
};

watchEffect(cleanUp => {
  if (!id.value || containerDetail.value.State?.Status !== 'running') {
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
    padding: 4px 0;
  }
}
</style>
