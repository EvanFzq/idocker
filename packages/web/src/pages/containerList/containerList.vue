<template>
  <TitleBar
    v-if="title"
    :title="title"
  />
  <div
    v-if="!loading"
    class="list"
  >
    <ContainerCard
      v-for="item in containerList"
      :id="item.id"
      :key="item.id"
      :name="item.name"
      :image="item.image"
      :started-at="item.startedAt"
      :status="item.status"
      :created="item.created"
      :labels="item.labels"
      :icon="item.icon"
      :cpu="item.cpu"
      :memory_limit="item.memoryLimit"
      :memory_usage="item.memoryUsage"
      :is-self="item.isSelf"
      :can-update="item.canUpdate"
      @reload="onReload"
    />
    <p class="no-more">没有更多了</p>
  </div>
  <div
    v-else
    class="loading"
  >
    <van-loading />
  </div>
  <div
    v-if="type === 'network'"
    class="btn-row van-safe-area-bottom"
  >
    <van-button
      round
      class="btn"
      type="primary"
      @click="showAddContainer = true"
    >
      添加容器
    </van-button>
    <van-button
      round
      class="btn"
      type="warning"
      @click="showRemoveContainer = true"
    >
      移除容器
    </van-button>
  </div>
  <van-dialog
    :show="showAddContainer"
    title="添加容器"
    show-cancel-button
    @confirm="onAddContainerConfirm"
    @cancel="showAddContainer = false"
  >
    <van-form ref="addContainerForm">
      <van-popover
        v-model:show="showContainerPicker"
        placement="bottom"
        trigger="manual"
        :show-arrow="false"
        @select="onContainerPickerConfirm"
      >
        <template #reference>
          <van-field
            v-model="addForm.container"
            required
            is-link
            readonly
            name="container"
            label="容器"
            placeholder="点击选择容器"
            :rules="[{ required: true, message: '请选择容器' }]"
            @click="showContainerPicker = true"
          />
        </template>
        <div class="add-container-list">
          <van-button
            v-for="item in canAddContainerList"
            :key="item.id"
            class="item"
            block
            :disabled="item.disabled"
            @click="onContainerPickerConfirm(item)"
          >
            {{ item.name }}
          </van-button>
        </div>
      </van-popover>
      <van-field
        v-model="addForm.ip"
        name="ip"
        label="IP（可选）"
        placeholder="输入IP，例：172.24.56.89"
      />
      <van-field
        v-model="addForm.ipv6"
        name="ipv6"
        label="IPv6（可选）"
        placeholder="输入IP，例：2001:db8::5689"
      />
    </van-form>
  </van-dialog>
  <van-action-sheet
    v-model:show="showRemoveContainer"
    :actions="containerList.map(item => ({ ...item, disabled: undefined }))"
    @select="onRemoveSelectContainer"
  />
</template>

<script lang="ts" setup>
import { onMounted, ref, onUnmounted, computed } from 'vue';
import { showLoadingToast, showSuccessToast } from 'vant';
import { useRoute } from 'vue-router';

import type { ContainerListParams, ContainerListItem } from '@common/types/container';

import { getContainerList, addContainerToNetwork, removeContainerFormNetwork } from '@/apis';
import ContainerCard from '@/components/ContainerCard.vue';
import TitleBar from '@/components/TitleBar.vue';

import type { FormInstance } from 'vant';

const containerList = ref<ContainerListItem[]>([]);
const allContainerList = ref<ContainerListItem[]>([]);
const loading = ref(false);
const canAddContainerList = computed(() =>
  allContainerList.value.map(item => ({
    ...item,
    text: item.name,
    className: 'add-network-container-item',
    disabled: containerList.value.some(container => container.id === item.id),
  })),
);
const showAddContainer = ref(false);
const showContainerPicker = ref(false);
const showRemoveContainer = ref(false);
const addContainerForm = ref<FormInstance>();
const addForm = ref({
  container: '',
  ip: '',
  ipv6: '',
});
const route = useRoute();
const { type, name, id } = route.query;

const title = computed(() => {
  const containerListTitle: Record<string, string> = {
    image: `镜像 ${name} 的容器`,
    network: `网络 ${name} 的容器`,
    volume: `数据卷 ${name} 的容器`,
  };
  return type ? containerListTitle[type as string] : '';
});

const getList = async (hasMetrics: boolean, type?: string) => {
  // 获取列表
  const params: Record<string, ContainerListParams> = {
    ['network']: {
      networkId: id as string,
      hasMetrics,
    },
    ['image']: {
      imageId: id as string,
      hasMetrics,
    },
    ['volume']: {
      volumeName: name as string,
      hasMetrics,
    },
  };
  const res = await getContainerList(type ? params[type] : { hasMetrics });
  if (res.success) {
    containerList.value = res.data;
  } else {
    containerList.value = [];
  }

  return containerList.value;
};

const onReload = async () => {
  loading.value = true;
  await getList(false, type as string);
  loading.value = false;
};

let statsTimer: NodeJS.Timeout;
onMounted(async () => {
  loading.value = true;
  const [list, allList] = await Promise.all([getList(false, type as string), getList(false)]);
  loading.value = false;
  containerList.value = list;
  allContainerList.value = allList;
  statsTimer = setInterval(async () => {
    getList(true, type as string);
  }, 5000);
});

onUnmounted(() => {
  clearInterval(statsTimer);
});

const onContainerPickerConfirm = (value: ContainerListItem) => {
  addForm.value.container = value.name;
  showContainerPicker.value = false;
};

const onAddContainerConfirm = async () => {
  await addContainerForm.value?.validate();
  showLoadingToast({ message: '添加中...', duration: 0, forbidClick: true });
  const { ip, ipv6 } = addForm.value;
  const res = await addContainerToNetwork({
    networkId: id as string,
    containerId: allContainerList.value.find(
      container => container.name === addForm.value.container,
    )?.id as string,
    ip: ip ? ip : undefined,
    ipv6: ipv6 ? ipv6 : undefined,
  });
  if (res.success) {
    showSuccessToast('添加成功');
    showAddContainer.value = false;
    getList(false, type as string);
  }
};
const onRemoveSelectContainer = async (value: ContainerListItem) => {
  showLoadingToast({ message: '移除中...', duration: 0, forbidClick: true });
  const res = await removeContainerFormNetwork(id as string, value.id);
  if (res.success) {
    showSuccessToast('移除成功');
    showRemoveContainer.value = false;
    getList(false, type as string);
  }
};
</script>

<style scoped lang="less">
.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
}
.loading {
  flex: auto;
  height: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.no-more {
  width: 100%;
  font-size: 10px;
  margin: 12px 12px 72px;
  text-align: center;
}
.btn-row {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 12px;
  background-color: #fff;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  .btn {
    width: 40%;
  }
}
.add-container-list {
  width: 200px;

  .item {
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    border-left: 0;
    border-right: 0;
    border-radius: 0;
  }
}
</style>
