<template>
  <PageLayout title="通知设置">
    <div style="padding-right: 16px">
      <SendEmailCard
        :data="{ ...(noticeInfo?.email as NoticeEmail) }"
        @change="onChange"
      />
      <NoticeEventsCard
        :data="{ ...noticeInfo?.events }"
        @change="onChange"
      />
    </div>
  </PageLayout>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';

import type { NoticeInfo, NoticeEmail } from '@common/types/setting';

import PageLayout from '@/components/desktop/PageLayout.vue';
import { getNoticeInfo } from '@/apis/setting';

import SendEmailCard from './SendEmailCard.vue';
import NoticeEventsCard from './NoticeEventsCard.vue';

const noticeInfo = ref<Partial<NoticeInfo>>();

onMounted(async () => {
  const res = await getNoticeInfo();
  if (res.success) {
    noticeInfo.value = res.data;
  }
});

const onChange = (value: Partial<NoticeInfo>) => {
  noticeInfo.value = {
    ...noticeInfo.value,
    ...value,
  };
};
</script>
