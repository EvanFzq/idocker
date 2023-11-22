<template>
  <el-form
    :inline="true"
    :model="filter"
    label-width="80px"
    style="max-width: 630px"
  >
    <el-form-item label="镜像">
      <el-select
        v-model="filter.image"
        placeholder="选择镜像"
        clearable
      >
        <el-option
          v-for="item in imageList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="网络">
      <el-select
        v-model="filter.network"
        placeholder="选择网络"
        clearable
      >
        <el-option
          v-for="item in networkList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="卷">
      <el-select
        v-model="filter.volume"
        placeholder="选择卷"
        clearable
      >
        <el-option
          v-for="item in volumekList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        style="margin-left: 80px"
        :icon="Search"
        @click="onSubmit"
      >
        查询
      </el-button>
      <el-button
        style="margin-left: 12px"
        :icon="RefreshRight"
        @click="onReset"
      >
        重置
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Search, RefreshRight } from '@element-plus/icons-vue';

import { getImageList } from '@/apis/image';
import { getNetworkList } from '@/apis/network';
import { getVolumeList } from '@/apis/volume';

export interface FilterData {
  image: string;
  network: string;
  volume: string;
}

const filter = ref({
  image: '',
  network: '',
  volume: '',
});

const imageList = ref<{ name: string; id: string }[]>([]);
const networkList = ref<{ name: string; id: string }[]>([]);
const volumekList = ref<string[]>([]);

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
    networkList.value = networkRes.data.map(item => ({ name: item.Name, id: item.Id }));
  }
  if (volumeRes.success) {
    volumekList.value = volumeRes.data.map(item => item.Name);
  }
});

const onSubmit = () => {
  emits('search', filter.value);
};
const onReset = () => {
  filter.value = {
    image: '',
    network: '',
    volume: '',
  };
  emits('search', filter.value);
};
</script>
