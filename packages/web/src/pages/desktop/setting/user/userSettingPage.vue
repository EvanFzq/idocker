<template>
  <PageLayout title="用户设置">
    <div style="padding-right: 16px">
      <UserInfoCard
        :data="{ userName: userInfo?.userName }"
        @change="onChange"
      />
      <UserSafeCard
        :data="{ passwordMaxRetryNum: userInfo?.passwordMaxRetryNum }"
        @change="onChange"
      />
    </div>
  </PageLayout>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';

import type { UserInfo } from '@common/types/setting';

import PageLayout from '@/components/desktop/PageLayout.vue';
import { getUserInfo } from '@/apis/setting';

import UserSafeCard from './UserSafeCard.vue';
import UserInfoCard from './UserInfoCard.vue';

const userInfo = ref<UserInfo>();

onMounted(async () => {
  const res = await getUserInfo();
  if (res.success) {
    userInfo.value = res.data;
  }
});

const onChange = (value: Partial<UserInfo>) => {
  userInfo.value = {
    ...userInfo.value,
    ...value,
  };
};
</script>
