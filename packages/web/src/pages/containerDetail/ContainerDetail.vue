<template>
  <van-nav-bar
    :title="containerDetail.Name?.slice(1)"
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
  />
  <div class="dashbord">
    <van-circle
      v-model:current-rate="cpuCurrentRate"
      :rate="cpuRate"
      :speed="100"
    >
      <span class="material-icons-outlined icon"> memory </span>
      <div class="value">{{ cpuRate }}%</div>
      <div class="text">CPU使用率</div>
    </van-circle>
    <div
      ><van-tag
        size="large"
        :color="statusColor"
        >{{ statusLabel }}</van-tag
      ></div
    >
    <van-circle
      v-model:current-rate="memoryCurrentRate"
      :rate="memoryRate"
      :speed="100"
    >
      <span class="material-icons-outlined icon"> keyboard </span>
      <div class="value memory"
        >{{ fileSizeFormat(memoryUsage) || '-' }} / {{ fileSizeFormat(memoryLimit) || '-' }}
      </div>
      <div class="text">内存使用量</div>
    </van-circle>
  </div>
  <van-tabs v-model:active="activeTab">
    <van-tab
      class="tab"
      title="基本信息"
    >
      <base-info
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
      <mount :list="containerDetail.Mounts" />
    </van-tab>
    <van-tab
      class="tab"
      title="端口"
    >
      <port :data="containerDetail.HostConfig?.PortBindings" />
    </van-tab>
    <van-tab
      class="tab"
      title="网络"
    >
      <network :networks="containerDetail.NetworkSettings?.Networks" />
    </van-tab>
    <van-tab
      class="tab"
      title="变量"
    >
      <env-var :envs="containerDetail.Config?.Env" />
    </van-tab>
    <van-tab
      class="tab"
      title="日志"
    >
      <log :id="id" />
    </van-tab>
  </van-tabs>
</template>
<script lang="ts" setup>
import { ref, onMounted, watchEffect, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getContainerDetail, getContainerStats } from '@/apis/container';
import { Container } from '@common/types/container';
import { restartPolicyList } from '@common/constants/const';
import { fileSizeFormat } from '@/utils/utils';
import { statusColorMap, statusLabelMap } from '@/constants/container';
import BaseInfo from './BaseInfo.vue';
import EnvVar from './EnvVar.vue';
import Log from './Log.vue';
import Mount from './Mount.vue';
import Network from './Network.vue';
import Port from './Port.vue';

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

const activeTab = ref(0);

const route = useRoute();
const id = computed(() => route.params.id as string);
const restart = computed(
  () =>
    containerDetail.value.HostConfig?.RestartPolicy &&
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
  if (!id) {
    return;
  }
  const res = await getContainerDetail(id.value);
  if (res.success) {
    containerDetail.value = res.data;
    await getStats();
  }
});

watchEffect(cleanUp => {
  if (!id || containerDetail.value.State?.Status !== 'running') {
    return;
  }
  const timer = setInterval(getStats, 5000);
  cleanUp(() => {
    clearInterval(timer);
  });
});

const onClickLeft = () => history.back();
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
}
</style>
