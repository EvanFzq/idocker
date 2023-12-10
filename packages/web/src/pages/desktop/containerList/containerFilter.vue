<template>
  <a-form
    layout="inline"
    :model="filter"
    autocomplete="off"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-item
      label="镜像"
      style="margin-bottom: 12px"
    >
      <a-select
        v-model:value="filter.image"
        placeholder="选择镜像"
        allow-clear
        :options="imageList"
        :field-names="{ label: 'name', value: 'id' }"
      />
    </a-form-item>
    <a-form-item
      label="网络"
      style="margin-bottom: 12px"
    >
      <a-select
        v-model:value="filter.network"
        placeholder="选择网络"
        allow-clear
        :options="networkList"
        :field-names="{ label: 'name', value: 'name' }"
      />
    </a-form-item>
    <a-form-item
      label="卷"
      style="margin-bottom: 12px"
    >
      <a-select
        v-model:value="filter.volume"
        placeholder="选择卷"
        allow-clear
        :options="volumekList"
        :field-names="{ label: 'name', value: 'name' }"
      />
    </a-form-item>
    <a-space
      wrap
      style="min-width: 290px; margin-bottom: 12px"
    >
      <a-button
        type="primary"
        style="margin-left: 80px"
        :icon="h(SearchOutlined)"
        @click="onSubmit"
      >
        查询
      </a-button>
      <a-button
        :icon="h(RollbackOutlined)"
        @click="onReset"
      >
        重置
      </a-button>
    </a-space>
  </a-form>
</template>
<script setup lang="ts">
import { ref, onMounted, h } from 'vue';
import { SearchOutlined, RollbackOutlined } from '@ant-design/icons-vue';

import { getImageList } from '@/apis/image';
import { getNetworkList } from '@/apis/network';
import { getVolumeList } from '@/apis/volume';

export interface FilterData {
  image: string | null;
  network: string | null;
  volume: string | null;
}

const labelCol = { style: { width: '80px' } };
const wrapperCol = { style: { width: '210px' } };

const props = defineProps<{ defaultValue: FilterData }>();

const filter = ref(props.defaultValue);

const imageList = ref<{ name: string; id: string }[]>([]);
const networkList = ref<{ name: string }[]>([]);
const volumekList = ref<{ name: string }[]>([]);

const emits = defineEmits(['search']);

onMounted(async () => {
  const [imageRes, networkRes, volumeRes] = await Promise.all([
    getImageList(),
    getNetworkList(),
    getVolumeList(),
  ]);
  if (imageRes.success) {
    imageList.value = imageRes.data.map(item => ({ name: item.Name, id: item.Id }));
  }
  if (networkRes.success) {
    networkList.value = networkRes.data.map(item => ({ name: item.Name }));
  }
  if (volumeRes.success) {
    volumekList.value = volumeRes.data.map(item => ({ name: item.Name }));
  }
});

const onSubmit = () => {
  emits('search', filter.value);
};
const onReset = () => {
  filter.value = {
    image: null,
    network: null,
    volume: null,
  };
  emits('search', filter.value);
};
</script>
