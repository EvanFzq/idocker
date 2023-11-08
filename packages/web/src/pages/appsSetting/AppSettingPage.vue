<template>
  <TitleBar
    title="导航页设置"
    style="margin-bottom: 12px"
  />
  <van-cell-group inset>
    <van-cell title="是否需要登录">
      <template #value>
        <van-switch
          v-model="needLogin"
          @change="onSwitchNeedLogin"
        />
      </template>
    </van-cell>
  </van-cell-group>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { showLoadingToast, showSuccessToast } from 'vant';

import TitleBar from '@/components/TitleBar.vue';
import { getAppsNeedLogin, setAppsNeedLogin } from '@/apis/setting';

const needLogin = ref(false);

onMounted(async () => {
  const res = await getAppsNeedLogin();
  if (res.success) {
    needLogin.value = res.data;
  }
});

const onSwitchNeedLogin = async () => {
  showLoadingToast({ message: '执行中...', duration: 0, forbidClick: true });
  const res = await setAppsNeedLogin(needLogin.value);
  if (res.success) {
    showSuccessToast({ message: '切换成功' });
  } else {
    needLogin.value = !needLogin.value;
  }
};
</script>
