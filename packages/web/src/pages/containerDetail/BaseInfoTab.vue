<template>
  <div class="baseinfo">
    <van-cell-group inset>
      <van-cell
        title="Id"
        :value="data.id?.slice(0, 8)"
      />
      <van-cell
        title="名称"
        :value="data.name"
      />
      <van-cell
        title-class="image-title"
        value-class="image-value"
        title="镜像"
        :value="data.image"
      />
      <van-cell
        title-class="image-title"
        value-class="image-value"
        title="重启策略"
        :value="restart || '-'"
      />
      <van-cell
        title="启动时间"
        :value="data.startedAt ? dayjs(data.startedAt).format('YYYY-MM-DD HH:mm:ss') : '-'"
      />
      <van-cell
        title="创建时间"
        :value="data.created ? dayjs(data.created).format('YYYY-MM-DD HH:mm:ss') : '-'"
      />
      <van-cell
        title="CMD"
        :value="data.cmd?.join(' ') || '-'"
      />
      <van-cell
        title="Entrypoint"
        :value="Array.isArray(data.entrypoint) ? data.entrypoint?.join(' ') : data.entrypoint"
      />
      <van-cell
        title="内网地址"
        :value="data.localUrl"
        is-link
        @click="goTo(localUrl)"
      />
      <van-cell
        title="外网地址"
        :value="data.internetUrl"
        is-link
        @click="goTo(internetUrl)"
      />
    </van-cell-group>
  </div>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs';
import { computed } from 'vue';

import type { ContainerDetail } from '@common/types/container';
import { restartPolicyList } from '@common/constants/const';
import { webUrlTemplateFormat } from '@common/utils/utils';

interface BaseInfoProps {
  data: Partial<ContainerDetail>;
}
const props = defineProps<BaseInfoProps>();

const restart = computed(
  () =>
    props.data.restartPolicyName &&
    restartPolicyList.find(item => item.value === props.data.restartPolicyName)?.text +
      `【${props.data.restartPolicyMaximumRetryCount}次】`,
);

const localUrl = computed(() => {
  const template = props.data.localUrl;
  if (!template) return;
  return webUrlTemplateFormat(template, location.host, location.protocol, props.data);
});

const internetUrl = computed(() => {
  const template = props.data.internetUrl;
  if (!template) return;
  return webUrlTemplateFormat(template, location.host, location.protocol, props.data);
});

const goTo = (url?: string) => {
  if (!url) return;
  window.open(url, '_blank', 'noreferrer');
};
</script>
<style lang="less">
.baseinfo {
  .image-title,
  .image-value {
    flex: auto;
  }
}
</style>
