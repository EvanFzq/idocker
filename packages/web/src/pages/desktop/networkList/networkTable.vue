<template>
  <a-table
    :data-source="list"
    :columns="columns"
    :loading="loading"
    size="middle"
    :pagination="{ showSizeChanger: true }"
  >
    <template
      #bodyCell="{ column, record }: { record: Network; column: TableColumnProps<Network> }"
    >
      <template v-if="column.key === 'Containers'">
        <RouterLink
          v-if="record.Containers"
          :to="'/d/container/list?networkName=' + record.Name"
          class="image-containers"
        >
          {{ record.Containers }}
        </RouterLink>
        <span v-else>{{ record.Containers }}</span>
      </template>
      <template v-if="column.key === 'Created'">
        <a-tooltip :title="dayjs(record.Created).format('YYYY-MM-DD HH:mm:ss')">
          {{ timeLongFormat(record.Created) }}
        </a-tooltip>
      </template>
      <template v-if="column.key === 'operate'">
        <a-space>
          <a-button
            v-if="record.Name !== 'host'"
            danger
            :disabled="!!record.Containers || ['host', 'none', 'bridge'].includes(record.Name)"
            type="primary"
            size="small"
            :icon="h(DeleteOutlined)"
            :loading="operateLoadingId === record.Id"
            @click="onRemove(record.Id)"
          >
            删除
          </a-button>
          <a-button
            v-if="record.Name !== 'host'"
            type="primary"
            size="small"
            :icon="h(ApiOutlined)"
            @click="onConnect(record)"
          >
            链接容器
          </a-button>
          <a-button
            v-if="record.Name !== 'host' && !!record.Containers"
            :disabled="!record.Containers"
            type="primary"
            size="small"
            :icon="h(ExpandAltOutlined)"
            @click="onUnconnect(record)"
          >
            断开容器
          </a-button>
        </a-space>
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="showConnectNetwork"
    title="链接容器"
    width="400px"
    destroy-on-close
    :confirm-loading="confimLoading"
    @ok="onConnectConfim"
  >
    <a-form
      ref="connectNetworkForm"
      autocomplete="off"
      :model="connectNetworkFormData"
      :label-col="{ style: { width: '80px' } }"
    >
      <a-form-item
        name="id"
        :rules="[{ required: true, message: '请选择容器！' }]"
      >
        <template #label>
          <span>容器</span>
          <a-tooltip
            title="host网络不允许链接，none网络只允许链接无网络配置容器，其他网络不允许链接host、none网络容器"
          >
            <QuestionCircleOutlined style="margin-left: 4px" />
          </a-tooltip>
        </template>
        <a-select
          v-model:value="connectNetworkFormData.id"
          placeholder="请选择容器"
        >
          <a-select-option
            v-for="container in connectContainerList"
            :key="container.id"
            :value="container.id"
            option-label-prop="label"
            :disabled="container.networks.some(network => network.id === connectNetwork?.Id)"
          >
            <a-tooltip
              v-if="container.networks.some(network => network.id === connectNetwork?.Id)"
              title="已链接此网络"
            >
              <span>{{ container.name }}</span>
            </a-tooltip>
            <span v-else>{{ container.name }}</span>
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        v-if="connectNetwork?.Name !== 'none'"
        label="IP："
        name="ip"
        :extra="
          '子网：' + connectNetwork?.IPAM.Config.find(item => item.Gateway.indexOf('.') > 0)?.Subnet
        "
      >
        <a-input
          v-model:value="connectNetworkFormData.ip"
          placeholder="请输入IP"
        />
      </a-form-item>
      <a-form-item
        v-if="connectNetwork?.EnableIPv6"
        label="IPv6："
        name="ipv6"
        :extra="
          '子网：' + connectNetwork?.IPAM.Config.find(item => item.Gateway.indexOf(':') > 0)?.Subnet
        "
      >
        <a-input
          v-model:value="connectNetworkFormData.ipv6"
          placeholder="请输入IPv6"
        />
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal
    v-model:open="showUnconnectNetwork"
    title="断开容器"
    width="400px"
    destroy-on-close
    :confirm-loading="confimLoading"
    @ok="onUnconnectConfim"
  >
    <a-form
      ref="unconnectNetworkForm"
      autocomplete="off"
      :model="unconnectNetworkFormData"
      :label-col="{ style: { width: '80px' } }"
    >
      <a-form-item
        label="容器："
        name="id"
        :rules="[{ required: true, message: '请选择容器！' }]"
      >
        <a-select
          v-model:value="unconnectNetworkFormData.id"
          placeholder="请选择容器"
        >
          <a-select-option
            v-for="container in unconnectContainerList"
            :key="container.id"
            :value="container.id"
            option-label-prop="label"
          >
            {{ container.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="ts">
import { ref, h, computed } from 'vue';
import { RouterLink } from 'vue-router';
import dayjs from 'dayjs';
import {
  DeleteOutlined,
  ApiOutlined,
  ExpandAltOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import type { Network } from '@common/types/network';
import type { ContainerDetail } from '@common/types/container';

import { removeNetwork, addContainerToNetwork, removeContainerFormNetwork } from '@/apis';
import { timeLongFormat } from '@/utils/utils';

import type { FormInstance, TableColumnProps } from 'ant-design-vue';

const props = defineProps<{
  list: Network[];
  containerList: ContainerDetail[];
  loading: boolean;
}>();
const emits = defineEmits(['reload']);

const operateLoadingId = ref('');
const showConnectNetwork = ref(false);
const connectNetwork = ref<Network | null>(null);
const showUnconnectNetwork = ref(false);
const unconnectNetwork = ref<Network | null>(null);
const confimLoading = ref(false);
const connectContainerList = computed(() => {
  if (!connectNetwork.value) return [];
  if (connectNetwork.value.Name === 'none') {
    // none网络只能添加无配置网络的容器
    return props.containerList.filter(item => item.networks.length === 0);
  }
  // host网络不允许被链接
  // 其他网络不允许链接none和host容器

  return props.containerList.filter(
    item => !item.networks.some(network => network.name === 'none' || network.name === 'host'),
  );
});
const unconnectContainerList = computed(() =>
  unconnectNetwork.value
    ? props.containerList.filter(container =>
        container.networks.some(network => network.name === unconnectNetwork.value?.Name),
      )
    : [],
);
const connectNetworkForm = ref<FormInstance>();
const unconnectNetworkForm = ref<FormInstance>();
const connectNetworkFormData = ref<{ id: string | null; ip?: string; ipv6?: string }>({
  id: null,
  ip: undefined,
  ipv6: undefined,
});
const unconnectNetworkFormData = ref<{ id: string | null }>({
  id: null,
});

const columns: TableColumnProps<Network>[] = [
  {
    key: 'Name',
    dataIndex: 'Name',
    title: '名称',
  },
  {
    key: 'Containers',
    dataIndex: 'Containers',
    title: '容器数量',
  },
  {
    key: 'Created',
    dataIndex: 'Created',
    title: '创建时间',
    customRender: ({ value }) => timeLongFormat(dayjs.unix(value)),
  },
  {
    key: 'Gateway',
    dataIndex: 'IPAM',
    title: '网关',
    customRender: ({ value }) => value.Config?.[0]?.Gateway || '-',
  },
  {
    key: 'Subnet',
    dataIndex: 'IPAM',
    title: '子网',
    customRender: ({ value }) => {
      if (!value.Config?.[0]?.Subnet) return '-';
      return value.Config?.[0]?.Subnet;
    },
  },
  {
    key: 'EnableIPv6',
    dataIndex: 'EnableIPv6',
    title: 'IPv6',
    customRender: ({ value }) => (value ? '是' : '否'),
  },
  {
    key: 'Internal',
    dataIndex: 'Internal',
    title: '内部网络',
    customRender: ({ value }) => (value ? '是' : '否'),
  },
  {
    key: 'operate',
    dataIndex: 'Id',
    title: '操作',
  },
];

const onRemove = async (id: string) => {
  operateLoadingId.value = id;
  const res = await removeNetwork(id);
  if (res.success) {
    message.success('删除成功！');
  } else {
    message.error('删除失败！' + res.msg);
  }
  emits('reload');
  operateLoadingId.value = '';
};

const onConnect = (network: Network) => {
  showConnectNetwork.value = true;
  connectNetwork.value = network;
  connectNetworkFormData.value = {
    id: null,
    ip: undefined,
    ipv6: undefined,
  };
};

const onUnconnect = (network: Network) => {
  showUnconnectNetwork.value = true;
  unconnectNetwork.value = network;
  unconnectNetworkFormData.value = { id: null };
};

const onConnectConfim = async () => {
  await connectNetworkForm.value?.validate();
  const { id, ip, ipv6 } = connectNetworkFormData.value;
  if (!connectNetwork.value || !id) return;
  confimLoading.value = true;
  const res = await addContainerToNetwork({
    networkId: connectNetwork.value.Id,
    containerId: id,
    ip,
    ipv6,
  });
  if (res.success) {
    message.success('链接成功！');
    showConnectNetwork.value = false;
    emits('reload');
  }
  confimLoading.value = false;
};

const onUnconnectConfim = async () => {
  await unconnectNetworkForm.value?.validate();
  const { id } = unconnectNetworkFormData.value;
  if (!unconnectNetwork.value || !id) return;
  confimLoading.value = true;
  const res = await removeContainerFormNetwork(unconnectNetwork.value.Id, id);
  if (res.success) {
    message.success('断开成功！');
    showUnconnectNetwork.value = false;
    emits('reload');
  }
  confimLoading.value = false;
};
</script>
<style scoped lang="less">
.image-containers {
  text-decoration: underline;
}
</style>
