<template>
  <TitleBar title="网络列表" />
  <div class="network-list">
    <NetworkCard
      v-for="network in networkList"
      :key="network.Id"
      :network="network"
      @click="onNetworkClick(network)"
    />
  </div>

  <div class="add-network-btn-row van-safe-area-bottom">
    <van-button
      block
      round
      class="btn"
      type="primary"
      @click="showAddModal = true"
    >
      新增网络
    </van-button>
  </div>
  <van-dialog
    :show="showAddModal"
    title="新增网络"
    show-cancel-button
    @cancel="showAddModal = false"
    @confirm="onAddNetworkConfirm"
  >
    <van-form
      ref="addModalForm"
      class="add-modal-form"
    >
      <van-field
        v-model="networkForm.name"
        name="name"
        label="网络名"
        required
        autocomplete="off"
        placeholder="请输入网络名"
        class="add-network-field"
        :rules="[{ required: true, message: '请输入网络名' }]"
      />
      <van-field
        v-model="networkForm.gateway"
        name="gateway"
        label="网关"
        autocomplete="off"
        placeholder="示例：172.20.0.1"
        class="add-network-field"
      />
      <van-field
        v-model="networkForm.subnet"
        name="subnet"
        label="子网"
        autocomplete="off"
        placeholder="示例：172.20.0.0/16"
        class="add-network-field"
      />
      <van-field
        label="启用IPv6"
        name="enableIPv6"
      >
        <template #input>
          <van-switch v-model="networkForm.enableIPv6" />
        </template>
      </van-field>
      <van-field
        v-if="networkForm.enableIPv6"
        v-model="networkForm.IPv6gateway"
        name="IPv6gateway"
        label="IPv6网关"
        autocomplete="off"
        placeholder="示例：2001:db8:abcd::1011"
        class="add-network-field"
      />
      <van-field
        v-if="networkForm.enableIPv6"
        v-model="networkForm.IPv6subnet"
        name="IPv6subnet"
        label="IPv6子网"
        autocomplete="off"
        placeholder="示例：2001:db8:abcd::/64"
        class="add-network-field"
      />
      <van-field name="internal">
        <template #label>
          <span>内部网络</span>
          <van-popover
            placement="bottom-start"
            :offset="[-50, 10]"
          >
            <p style="padding: 0 12px">
              默认创建可与外部链接的网络。<br />
              开启时，将创建外部隔离的网络
            </p>
            <template #reference>
              <van-icon name="question-o" />
            </template>
          </van-popover>
        </template>
        <template #input>
          <van-switch v-model="networkForm.internal" />
        </template>
      </van-field>
    </van-form>
  </van-dialog>
  <van-action-sheet
    v-model:show="showAction"
    :actions="actions"
    cancel-text="取消"
  >
    <template #description>
      <div style="font-size: 20px; margin-bottom: 12px; color: #333">{{ actionNetwork?.Name }}</div>
      <van-text-ellipsis
        rows="2"
        :content="actionNetwork?.Id"
        expand-text="展开"
        collapse-text="收起"
      />
    </template>
  </van-action-sheet>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { showLoadingToast, showSuccessToast } from 'vant';
import type { FormInstance } from 'vant';
import TitleBar from '@/components/TitleBar.vue';
import { getNetworkList, addNetwork, removeNetwork } from '@/apis/network';
import type { Network, AddNetworkParams } from '@common/types/network';
import NetworkCard from './NetworkCard.vue';

const networkList = ref<Network[]>([]);
const showAddModal = ref(false);
const showAction = ref(false);
const actionNetwork = ref<Network | null>(null);
const addModalForm = ref<FormInstance>();
const networkForm = ref<AddNetworkParams>({
  name: '',
  gateway: '',
  subnet: '',
  enableIPv6: false,
  IPv6gateway: '',
  IPv6subnet: '',
  internal: false,
});

const actions = computed(() => {
  const disabledRemove =
    !!actionNetwork.value?.Containers ||
    ['host', 'none', 'bridge'].includes(actionNetwork.value?.Name || '');
  return [
    {
      name: '删除',
      color: disabledRemove ? undefined : '#ee0a24',
      subname: disabledRemove ? '存在容器、内置的网络无法删除' : undefined,
      disabled: disabledRemove,
      callback: onRemoveNetwork,
    },
  ];
});
const getDataList = async () => {
  const res = await getNetworkList();
  if (res.success) {
    networkList.value = res.data;
  }
};

onMounted(async () => {
  getDataList();
});
const onNetworkClick = (network: Network) => {
  actionNetwork.value = network;
  showAction.value = true;
};
const onAddNetworkConfirm = async () => {
  await addModalForm.value?.validate();
  showLoadingToast({ message: '创建中...', duration: 0, forbidClick: true });
  const res = await addNetwork(networkForm.value);
  if (res.success) {
    showSuccessToast('创建成功');
    showAddModal.value = false;
    getDataList();
  }
};
const onRemoveNetwork = async () => {
  if (!actionNetwork.value) {
    return;
  }
  showLoadingToast({ message: '删除中...', duration: 0, forbidClick: true });
  const res = await removeNetwork(actionNetwork.value.Id);
  if (res.success) {
    showSuccessToast('删除成功');
    showAction.value = false;
    actionNetwork.value = null;
    getDataList();
  }
};
</script>
<style scoped lang="less">
.network-list {
  flex: auto;
  height: 0;
  overflow-x: auto;
  margin-bottom: 72px;
}
.add-network-btn-row {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 12px;
  background-color: #fff;
  box-sizing: border-box;
}
.add-modal-form {
  padding: 12px 6px;
}
</style>
