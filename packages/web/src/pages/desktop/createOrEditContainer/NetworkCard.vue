<template>
  <a-card
    class="form-card"
    title="网络配置"
  >
    <template #extra>
      <a-button
        class="button"
        size="small"
        type="link"
        :disabled="['host', 'none'].includes(form.networks[0]?.name || '')"
        @click="form.networks?.push({} as NetworkConfig)"
      >
        增加网络
      </a-button>
    </template>
    <a-table
      :data-source="form.networks"
      :columns="networkColumns"
      size="middle"
      :pagination="false"
    >
      <template #emptyText> 无条目，请添加 </template>
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'name'">
          <a-form-item
            :label-col="{ style: { width: '0px' } }"
            :name="['networks', index, 'name']"
            :rules="[
              { required: true, message: '请输入' },
              {
                validator: validatorNetworkName,
                message: 'host、none网络不能与其他网络共存',
              },
            ]"
          >
            <div style="display: flex; align-items: center">
              <a-select
                v-model:value="record.name"
                style="width: 100%"
                placeholder="请选择"
                :options="networkList"
                :field-names="{ label: 'Name', value: 'Name' }"
                @change="(value: string) => onNetworkNameChange(value, index)"
              />
              <a-button
                type="primary"
                shape="circle"
                size="small"
                style="margin-left: 6px"
                :icon="h(PlusOutlined)"
                @click="showCreateNetworkModal = true"
              />
            </div>
          </a-form-item>
        </template>
        <template v-if="column.key === 'ip'">
          <a-tooltip :title="'网段：' + getNetworkInfo(record.name)?.subnet">
            <a-form-item
              :label-col="{ style: { width: '0px' } }"
              :name="['networks', index, 'ip']"
              :rules="[
                {
                  pattern: IPv4AddressRegExp,
                  message: '请输入IPv4地址',
                },
              ]"
            >
              <a-input
                v-model:value="record.ip"
                :disabled="['host', 'none', 'bridge'].includes(record.name)"
                placeholder="示例：172.20.0.7"
              />
            </a-form-item>
          </a-tooltip>
        </template>
        <template v-if="column.key === 'ipV6'">
          <a-tooltip :title="'网段：' + getNetworkInfo(record.name)?.subnetV6">
            <a-form-item
              :label-col="{ style: { width: '0px' } }"
              :name="['networks', index, 'ipV6']"
              :rules="[
                {
                  pattern: IPv6AddressRegExp,
                  message: '请输入IPv6地址',
                },
              ]"
            >
              <a-input
                v-model:value="record.ipV6"
                :disabled="['host', 'none', 'bridge'].includes(record.name)"
                placeholder="示例：a:b:c:d::1234"
              />
            </a-form-item>
          </a-tooltip>
        </template>
        <template v-if="column.key === 'mac'">
          <a-form-item
            :label-col="{ style: { width: '0px' } }"
            :name="['networks', index, 'mac']"
            :rules="[
              {
                pattern: macAddress48RegExp,
                message: '请输入MAC地址',
              },
            ]"
          >
            <a-input
              v-model:value="record.mac"
              :disabled="['host', 'none'].includes(record.name)"
              placeholder="示例：12-34-56-78-9a-bc"
            />
          </a-form-item>
        </template>
        <template v-if="column.key === 'operate'">
          <a-button
            type="link"
            danger
            @click="onRemove(index)"
          >
            移除
          </a-button>
        </template>
      </template>
    </a-table>
  </a-card>
  <CreateNetworkModal
    v-model:open="showCreateNetworkModal"
    @created="emit('reloadNetworkList')"
  />
</template>
<script setup lang="ts">
import { ref, h, watch } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';

import type { Network, NetworkConfig } from '@common/types/network';
import { IPv4AddressRegExp, IPv6AddressRegExp, macAddress48RegExp } from '@common/constants/const';

import CreateNetworkModal from '@/components/desktop/CreateNetworkModal.vue';

import type { FormData } from './type';
import type { TableColumnProps } from 'ant-design-vue';

const props = defineProps<{ formData: FormData; networkList: Network[] }>();
const emit = defineEmits(['valueChange', 'reloadNetworkList']);

const showCreateNetworkModal = ref(false);

const form = ref<Pick<FormData, 'networks'>>({
  networks: props.formData.networks,
});

watch(
  () => props.formData,
  () => {
    const { networks } = props.formData;
    form.value = {
      networks: [...networks],
    };
  },
  { deep: true },
);
watch(
  form,
  () => {
    emit('valueChange', form.value);
  },
  { deep: true },
);

const networkColumns: TableColumnProps[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '序号',
    width: 50,
    customRender: ({ index }) => index + 1,
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: '网络',
    width: 300,
  },
  {
    key: 'ip',
    dataIndex: 'ip',
    title: 'IPv4地址',
    width: 300,
  },
  {
    key: 'ipV6',
    dataIndex: 'ipV6',
    title: 'IPv6地址',
    width: 400,
  },
  {
    key: 'mac',
    dataIndex: 'mac',
    title: 'MAC地址',
    width: 400,
  },
  {
    key: 'operate',
    dataIndex: 'operate',
    title: '操作',
  },
];

const getNetworkInfo = (name?: string) => {
  if (!name || name === 'host') {
    return null;
  }
  const item = props.networkList.find(item => item.Name === name);
  return {
    subnet: item?.IPAM.Config.find(item => item.Subnet.indexOf('.') > 0)?.Subnet,
    subnetV6: item?.IPAM.Config.find(item => item.Subnet.indexOf(':') > 0)?.Subnet,
  };
};

const validatorNetworkName = () => {
  const hasHostOrNone = form.value.networks.some(item =>
    ['host', 'none'].includes(item.name || ''),
  );
  if (hasHostOrNone && form.value.networks.length > 2) {
    return Promise.reject('host、none网络不能与其他网络一起存在');
  }
  return Promise.resolve();
};
const onNetworkNameChange = (value: string, index: number) => {
  form.value.networks[index] = { name: value };
};
const onRemove = (index: number) => {
  form.value.networks.splice(index, 1);
};
</script>
