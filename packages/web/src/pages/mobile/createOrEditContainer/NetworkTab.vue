<template>
  <van-cell-group
    v-for="(network, index) in networkFormList"
    :key="index"
    class="network-card"
    inset
    style="margin-top: 16px"
  >
    <van-field
      v-model="network.name"
      :name="'networks[' + index + '].name'"
      label="网络"
      required
      is-link
      readonly
      placeholder="点击选择网络"
      :rules="[{ required: true, message: '请选择网络' }]"
      @click="onSelectNetwork(index)"
    />

    <van-field
      v-if="!['host', 'none', 'bridge'].includes(network.name || '')"
      v-model="network.ip"
      :name="'networks[' + index + '].ip'"
      label="IPv4 地址"
      :placeholder="'网段：' + (getNetworkInfo(network.name)?.subnet || '无')"
    />
    <van-field
      v-if="!['host', 'none', 'bridge'].includes(network.name || '')"
      v-model="network.ipV6"
      :name="'networks[' + index + '].ipV6'"
      label="IPv6 地址"
      :placeholder="'网段：' + (getNetworkInfo(network.name)?.subnetV6 || '无')"
    />
    <van-field
      v-if="!['host', 'none'].includes(network.name || '')"
      v-model="network.mac"
      :name="'networks[' + index + '].mac'"
      label="MAC 地址"
      placeholder="请输入MAC 地址"
    />

    <van-button
      icon="delete-o"
      size="small"
      round
      type="danger"
      class="delete-icon"
      @click="() => onDeleteNetwork(index)"
    />
  </van-cell-group>
  <van-popup
    v-model:show="showNetworkPicker"
    position="bottom"
  >
    <van-picker
      :columns="networkOptions"
      @confirm="onNetworkConfirm"
      @cancel="showNetworkPicker = false"
    />
  </van-popup>
  <div class="add-network">
    <van-button
      size="small"
      class="add-network-btn"
      @click="onAddNetwork"
    >
      添加网络
    </van-button>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';

import type { NetworkConfig, Network } from '@common/types/network';

import { getNetworkList } from '@/apis/network';

import type { ContainerFormData } from './CreateOrEditContainerPage.vue';

const props = defineProps<{ formData: ContainerFormData }>();

interface PickerValue {
  selectedValues: string[];
}

const networkFormList = ref<NetworkConfig[]>(props.formData.networks || []);
const allNetworkList = ref<Network[]>([]);
const showNetworkPicker = ref(false);
const seletcNetworkIndex = ref(0);

const networkOptions = computed(() =>
  allNetworkList.value.map(item => ({ text: item.Name, value: item.Name })),
);

const emit = defineEmits(['valueChange']);

watch(
  () => props.formData.networks,
  () => {
    networkFormList.value = props.formData.networks;
  },
  { deep: true },
);
watch(
  networkFormList,
  () => {
    emit('valueChange', { networks: networkFormList.value });
  },
  { deep: true },
);

onMounted(async () => {
  const res = await getNetworkList();
  if (res.success) {
    allNetworkList.value = res.data;
  }
});

const getNetworkInfo = (name?: string) => {
  if (!name || name === 'host') {
    return null;
  }
  const item = allNetworkList.value.find(item => item.Name === name);
  return {
    subnet: item?.IPAM.Config.find(item => item.Subnet.indexOf('.') > 0)?.Subnet,
    subnetV6: item?.IPAM.Config.find(item => item.Subnet.indexOf(':') > 0)?.Subnet,
  };
};

const onAddNetwork = () => {
  networkFormList.value = [...networkFormList.value, {}];
};
const onDeleteNetwork = (index: number) => {
  networkFormList.value.splice(index, 1);
};
const onSelectNetwork = (index: number) => {
  showNetworkPicker.value = true;
  seletcNetworkIndex.value = index;
};
const onNetworkConfirm = ({ selectedValues }: PickerValue) => {
  networkFormList.value[seletcNetworkIndex.value].name = selectedValues[0];
  showNetworkPicker.value = false;
};
</script>
<style scoped lang="less">
.add-network {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  margin-bottom: 32px;
  box-sizing: border-box;
  .add-network-btn {
    width: 80%;
  }
}
.network-card {
  position: relative;
  .delete-icon {
    position: absolute;
    right: 6px;
    top: 6px;
  }
}
.readonly {
  text-align: right;
  height: 30px;
  flex: auto;
}
</style>
