<template>
  <PageLayout title="Docker设置">
    <div style="padding-right: 16px">
      <RegistryCard
        :data="dockerSetting.registrys"
        @change="onChange"
      />
    </div>
  </PageLayout>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';

import type { DockerRegistry } from '@common/types/setting';

import PageLayout from '@/components/desktop/PageLayout.vue';
import { getRegistryList } from '@/apis/setting';

import RegistryCard from './RegistryCard.vue';

interface DockerSetting {
  registrys: DockerRegistry[];
}

const dockerSetting = ref<DockerSetting>({
  registrys: [],
});

onMounted(async () => {
  const res = await getRegistryList();
  if (res.success) {
    dockerSetting.value.registrys = res.data;
  }
});

const onChange = (value: Partial<DockerSetting>) => {
  dockerSetting.value = {
    ...dockerSetting.value,
    ...value,
  };
};
</script>
