<!-- eslint-disable vue/html-quotes -->
<template>
  <PageLayout
    :breadcrumbs="[
      { path: '/d/container/list', breadcrumbName: '容器列表' },
      { breadcrumbName: `容器${isEdit ? '编辑-' : '新增'}${formData?.name || ''}` },
    ]"
  >
    <template #extra>
      <a-radio-group
        v-if="!isEdit"
        v-model:value="mode"
        size="small"
        button-style="solid"
        style="margin-right: 16px"
      >
        <a-radio-button value="base">基础模式</a-radio-button>
        <a-radio-button value="advanced">高级模式</a-radio-button>
      </a-radio-group>
      <a-button
        type="primary"
        :loading="submitLoading"
        @click="onSubmit"
      >
        {{ isEdit ? '保存' : '创建' }}
      </a-button>
    </template>
    <div class="new-or-edit-container-page">
      <a-form
        ref="formRef"
        :model="formData"
        :label-col="{ style: { width: '120px' } }"
      >
        <BaseinfoCard
          :form-data="formData"
          :network-list="networkList"
          :mode="mode"
          @value-change="onFieldChange"
          @reload-network-list="getNetworkData()"
        />
        <NetworkCard
          v-if="mode === 'advanced'"
          :form-data="formData"
          :network-list="networkList"
          @value-change="onFieldChange"
          @reload-network-list="getNetworkData()"
        />
        <PortCard
          v-if="!['host', 'none'].includes(formData.networks[0]?.name || '')"
          :form-data="formData"
          @value-change="onFieldChange"
        />
        <MountCard
          :form-data="formData"
          @value-change="onFieldChange"
        />
        <EnvCard
          :form-data="formData"
          @value-change="onFieldChange"
        />
      </a-form>
    </div>
  </PageLayout>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';

import type { Network } from '@common/types/network';

import PageLayout from '@/components/desktop/PageLayout.vue';
import { getContainerDetail, updateContainer, createContainer, getNetworkList } from '@/apis';

import BaseinfoCard from './BaseInfoCard.vue';
import NetworkCard from './NetworkCard.vue';
import PortCard from './PortCard.vue';
import MountCard from './MountCard.vue';
import EnvCard from './EnvCard.vue';
import type { FormData } from './type';
import type { FormInstance } from 'ant-design-vue';

const formRef = ref<FormInstance>();
const submitLoading = ref(false);
const networkList = ref<Network[]>([]);

const route = useRoute();
const router = useRouter();
const isEdit = !!route.query.id;
const mode = ref<'base' | 'advanced'>(isEdit ? 'advanced' : 'base');
const formData = ref<FormData>({
  id: '',
  name: '',
  icon: [],
  image: route.query.image as string,
  tag: route.query.tag as string,
  networks: [{ name: 'bridge' }],
  runAffterCreated: false,
  command: undefined,
  hostname: undefined,
  domainName: undefined,
  extraHosts: undefined,
  envs: [],
  mounts: [],
  ports: [],
  restart: 'no',
  localUrl: '',
  internetUrl: '',
});

const onFieldChange = (value: FormData) => {
  if (JSON.stringify({ ...formData.value, ...value }) !== JSON.stringify(formData.value)) {
    formData.value = { ...formData.value, ...value };
  }
};

const getContainerData = async (id: string) => {
  const res = await getContainerDetail(id);
  if (res.success) {
    const {
      id,
      name,
      image,
      networks,
      envs,
      cmd,
      mounts,
      restartPolicyName,
      ports,
      icon,
      localUrl,
      internetUrl,
      hostname,
      domainName,
      extraHosts,
    } = res.data;
    // 处理icon
    const iconList = [];
    if (icon) {
      const index = icon.indexOf('|');
      // 在前10个字符中寻找｜，存在则判断类型，否则默认为URL（兼容之前版本）
      if (index > 0 && index < 10) {
        const iconType = icon.slice(0, index);
        const iconContent = icon.slice(index + 1);
        if (iconType === 'svg') {
          iconList.push({
            uid: '',
            svg: iconContent,
            name: '',
          });
        } else {
          iconList.push({
            uid: '',
            url: iconContent,
            name: iconContent,
          });
        }
      } else {
        iconList.push({
          uid: '',
          url: icon,
          name: icon,
        });
      }
    }

    formData.value = {
      id: id,
      name: name,
      image: image.split(':')[0],
      tag: image.split(':')[1],
      hostname,
      domainName,
      extraHosts,
      networks: networks.map(network => ({
        name: network.name,
        ip: network.ip || undefined,
        ipV6: network.ipV6 || undefined,
        mac: network.mac || undefined,
      })),
      restart: restartPolicyName,
      runAffterCreated: true,
      command: cmd,
      envs: envs.map(env => ({ envKey: env.key, envValue: env.value })),
      mounts:
        mounts?.map(item => ({
          type: item.type as 'bind' | 'volume',
          container: item.target,
          hostBind: item.type === 'bind' ? item.source : undefined,
          volume: item.type === 'volume' ? item.source : undefined,
          readonly: !item.rw,
        })) || [],
      ports:
        ports?.map(port => ({
          host: Number(port.hostPort),
          container: Number(port.containerPort),
          protocol: port.protocol as 'tcp' | 'udp',
        })) || [],
      icon: iconList,
      localUrl: localUrl || '',
      internetUrl: internetUrl || '',
    };
  }
};
const getNetworkData = async () => {
  const res = await getNetworkList();
  if (res.success) {
    networkList.value = res.data;
  }
};

onMounted(async () => {
  getNetworkData();
  if (route.query.id) {
    getContainerData(route.query.id as string);
  }
});

const onSubmit = async () => {
  await formRef.value?.validate();
  const { image, icon, tag, ports, envs, id, ...args } = formData.value as FormData;
  submitLoading.value = true;
  const { url, svg } = icon[0] || {};
  const params = {
    ...args,
    image: `${image}:${tag}`,
    icon: `${svg ? 'svg' : 'url'}|${svg ? svg : url}`,
    envs: envs.map(env => ({ key: env.envKey, value: env.envValue })),
    ports: ports.map(port => ({
      host: port.host.toString(),
      container: port.container.toString(),
      protocol: port.protocol,
    })),
  };
  if (formData.value.id) {
    const res = await updateContainer({
      id: id as string,
      ...params,
    });
    if (res.success) {
      message.success({
        content: '更新成功! ' + res.msg,
        onClose() {
          router.push('/d/container/list');
        },
      });
    }
  } else {
    const res = await createContainer(params);
    if (res.success) {
      message.success({
        content: '创建成功！' + res.msg,
        onClose() {
          router.push('/d/container/list');
        },
      });
    }
  }
  submitLoading.value = false;
};
</script>
<style scoped lang="less">
.new-or-edit-container-page {
  padding-top: 16px;
  padding-right: 16px;
  padding-bottom: 32px;
}
</style>
<style lang="less">
.new-or-edit-container-page {
  .form-card {
    & + .form-card {
      margin-top: 16px;
    }
  }
}
</style>
