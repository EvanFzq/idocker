<!-- eslint-disable vue/html-quotes -->
<template>
  <PageLayout
    :breadcrumbs="[
      { path: '/d/container/list', breadcrumbName: '容器列表' },
      { breadcrumbName: `容器${isEdit ? '编辑-' : '新增'}${formData?.name || ''}` },
    ]"
  >
    <template #extra>
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
          @value-change="onFieldChange"
        />
        <NetworkCard
          :form-data="formData"
          @value-change="onFieldChange"
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

import PageLayout from '@/components/desktop/PageLayout.vue';
import { getContainerDetail, updateContainer, createContainer } from '@/apis';

import BaseinfoCard from './BaseInfoCard.vue';
import NetworkCard from './NetworkCard.vue';
import PortCard from './PortCard.vue';
import MountCard from './MountCard.vue';
import EnvCard from './EnvCard.vue';
import type { FormData } from './type';
import type { FormInstance } from 'ant-design-vue';

const formRef = ref<FormInstance>();
const submitLoading = ref(false);

const route = useRoute();
const router = useRouter();
const isEdit = !!route.query.id;

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
      command: cmd?.map(item => (item.indexOf(' ') > 0 ? `"${item}"` : item))?.join(' ') || '',
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
      icon: icon
        ? [
            {
              uid: '',
              url: icon,
              name: icon || '',
            },
          ]
        : [],
      localUrl: localUrl || '',
      internetUrl: internetUrl || '',
    };
  }
};

onMounted(async () => {
  if (route.query.id) {
    getContainerData(route.query.id as string);
  }
});

const onSubmit = async () => {
  await formRef.value?.validate();
  const {
    image,
    icon,
    tag,
    ports,
    envs,
    command,
    name,
    networks,
    mounts,
    restart,
    runAffterCreated,
    id,
    hostname,
    domainName,
    extraHosts,
  } = formData.value as FormData;
  submitLoading.value = true;
  if (formData.value.id) {
    const res = await updateContainer({
      id: id as string,
      command,
      name,
      networks,
      mounts,
      restart,
      hostname,
      domainName,
      extraHosts,
      runAffterCreated,
      image: `${image}:${tag}`,
      icon: icon[0]?.url || '',
      envs: envs.map(env => ({ key: env.envKey, value: env.envValue })),
      ports: ports.map(port => ({
        host: port.host.toString(),
        container: port.container.toString(),
        protocol: port.protocol,
      })),
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
    const res = await createContainer({
      command,
      name,
      networks,
      mounts,
      restart,
      hostname,
      domainName,
      extraHosts,
      runAffterCreated,
      image: `${image}:${tag}`,
      icon: icon[0]?.url || '',
      envs: envs.map(env => ({ key: env.envKey, value: env.envValue })),
      ports: ports.map(port => ({
        host: port.host.toString(),
        container: port.container.toString(),
        protocol: port.protocol,
      })),
    });
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
