<template>
  <div class="page">
    <TitleBar
      :title="isEdit ? '修改容器' : '创建容器'"
      class="title"
    />
    <van-form
      class="form"
      @submit="onSubmit"
      @failed="onFailed"
    >
      <BaseinfoCard
        :form-data="formData"
        @value-change="onFieldChange"
      />
      <van-tabs
        v-model:active="activeTab"
        class="tabs"
        :lazy-render="false"
      >
        <van-tab
          class="tab"
          title="命令"
        >
          <CommandTab
            :form-data="formData"
            @value-change="onFieldChange"
          />
        </van-tab>
        <van-tab
          class="tab"
          title="网络"
          :dot="networkError"
        >
          <NetworkTab
            :form-data="formData"
            @value-change="onFieldChange"
          />
        </van-tab>
        <van-tab
          v-if="!['host', 'none'].includes(formData.networks[0]?.name || '')"
          class="tab"
          title="端口"
          :dot="portError"
        >
          <PortTab
            :form-data="formData"
            @value-change="onFieldChange"
          />
        </van-tab>
        <van-tab
          class="tab"
          title="挂载"
          :dot="mountError"
        >
          <MountTab
            :form-data="formData"
            @value-change="onFieldChange"
          />
        </van-tab>
        <van-tab
          class="tab"
          title="环境变量"
          :dot="envError"
        >
          <EnvVarTab
            :form-data="formData"
            @value-change="onFieldChange"
          />
        </van-tab>
        <van-tab
          class="tab"
          title="其他"
        >
          <OtherTab
            :form-data="formData"
            @value-change="onFieldChange"
          />
        </van-tab>
      </van-tabs>
      <div class="submit-btn van-safe-area-bottom">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
        >
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { showSuccessToast, showLoadingToast } from 'vant';
import { useRoute, useRouter } from 'vue-router';
import set from 'lodash-es/set';

import type { CreateContainerParams, MountConfig, Env } from '@common/types/container';
import type { PortConfig, NetworkConfig } from '@common/types/network';

import { getContainerDetail } from '@/apis/container';
import TitleBar from '@/components/mobile/TitleBar.vue';
import { createContainer, updateContainer } from '@/apis';

import type { UploaderFileListItem } from 'vant';
import BaseinfoCard from './BaseinfoCard.vue';
import CommandTab from './CommandTab.vue';
import NetworkTab from './NetworkTab.vue';
import MountTab from './MountTab.vue';
import PortTab from './PortTab.vue';
import EnvVarTab from './EnvVarTab.vue';
import OtherTab from './OtherTab.vue';

export interface ContainerFormData {
  id?: string;
  name: string;
  icon: UploaderFileListItem[];
  image: string;
  networks: NetworkConfig[];
  runAffterCreated: boolean;
  command: string;
  envs: Env[];
  mounts: MountConfig[];
  ports: PortConfig[];
  restart: string;
  localUrl: string;
  internetUrl: string;
}

const activeTab = ref(0);
const networkError = ref(false);
const portError = ref(false);
const mountError = ref(false);
const envError = ref(false);
const formData = ref<ContainerFormData>({
  id: '',
  name: '',
  icon: [],
  image: '',
  networks: [{ name: 'bridge' }],
  runAffterCreated: false,
  command: '',
  envs: [],
  mounts: [],
  ports: [],
  restart: 'no',
  localUrl: '',
  internetUrl: '',
});

const router = useRouter();
const route = useRoute();
const isEdit = computed(() => !!route.query.id);

onMounted(async () => {
  if (!route.query.id) {
    return;
  }
  const res = await getContainerDetail(route.query.id as string);
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
    } = res.data;
    formData.value = {
      id: id,
      name: name,
      image: image,
      networks: networks,
      restart: restartPolicyName,
      runAffterCreated: true,
      command: cmd?.map(item => (item.indexOf(' ') > 0 ? `"${item}"` : item))?.join(' ') || '',
      envs,
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
      icon: [
        {
          url: icon,
        },
      ],
      localUrl: localUrl || '',
      internetUrl: internetUrl || '',
    };
  }
});

const onFieldChange = (value: ContainerFormData) => {
  if (JSON.stringify({ ...formData.value, ...value }) !== JSON.stringify(formData.value)) {
    formData.value = { ...formData.value, ...value };
  }
};

const onSubmit = async (values: Record<string, string | number | boolean>) => {
  showLoadingToast({
    message: '提交中...',
    forbidClick: true,
    duration: 0,
  });
  values.icon =
    Array.isArray(values.icon) && values.icon.length > 0 ? values.icon[0].url : undefined;
  const params: CreateContainerParams = {} as CreateContainerParams;
  Object.entries(values).forEach(([key, value]: [string, string | number | boolean]) => {
    set(params, key, value);
  });
  params.networks = params.networks.map(item => ({
    name: item.name,
    ip: item.ip || undefined,
    ipV6: item.ip || undefined,
    mac: item.ip || undefined,
  }));
  if (formData.value.id) {
    const res = await updateContainer({ id: formData.value.id, ...params });
    if (res.success) {
      showSuccessToast({
        message: '更新成功',
        onClose() {
          router.push('/m');
        },
      });
    }
  } else {
    const res = await createContainer(params);
    if (res.success) {
      showSuccessToast({
        message: '创建成功',
        onClose() {
          router.push('/m');
        },
      });
    }
  }
};

const onFailed = (errorInfo: { values: object; errors: { message: string; name: string }[] }) => {
  networkError.value = false;
  mountError.value = false;
  portError.value = false;
  envError.value = false;
  errorInfo.errors.forEach(item => {
    if (item.name.startsWith('networks')) {
      mountError.value = true;
    }
    if (item.name.startsWith('mounts')) {
      mountError.value = true;
    }
    if (item.name.startsWith('ports')) {
      portError.value = true;
    }
    if (item.name.startsWith('envs')) {
      envError.value = true;
    }
  });
};
</script>
<style scoped lang="less">
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.title {
  flex: none;
}
.form {
  flex: auto;
  height: 0;
  overflow-x: auto;
}
.tabs {
  margin-top: 12px;
}
.tab {
  margin-bottom: 72px;
}
.submit-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  padding: 12px;
  box-sizing: border-box;
  background-color: #fff;
}
</style>
