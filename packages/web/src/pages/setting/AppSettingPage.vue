<template>
  <TitleBar
    title="导航页设置"
    style="margin-bottom: 12px"
  />
  <van-cell-group inset>
    <van-cell title="是否公开（无需登录）">
      <template #value>
        <van-switch
          v-model="isPublic"
          @change="onSwitchPublic"
        />
      </template>
    </van-cell>
  </van-cell-group>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { showLoadingToast, showSuccessToast } from 'vant';

import TitleBar from '@/components/TitleBar.vue';
import { getAppsPublic, setAppsPublic } from '@/apis/setting';

const isPublic = ref(false);

onMounted(async () => {
  const res = await getAppsPublic();
  if (res.success) {
    isPublic.value = res.data;
  }
});

const onSwitchPublic = async () => {
  showLoadingToast({ message: '执行中...', duration: 0, forbidClick: true });
  const res = await setAppsPublic(isPublic.value);
  if (res.success) {
    showSuccessToast({ message: '切换成功' });
  } else {
    isPublic.value = !isPublic.value;
  }
};
</script>
