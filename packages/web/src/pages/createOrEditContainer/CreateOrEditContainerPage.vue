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
          v-if="formData.network !== 'host'"
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

import type { CreateContainerParams, MountConfig } from '@common/types/container';
import type { PortConfig } from '@common/types/network';

import { getContainerDetail } from '@/apis/container';
import TitleBar from '@/components/TitleBar.vue';
import { createContainer, updateContainer } from '@/apis';

import type { UploaderFileListItem } from 'vant';
import BaseinfoCard from './BaseinfoCard.vue';
import CommandTab from './CommandTab.vue';
import MountTab from './MountTab.vue';
import PortTab from './PortTab.vue';
import EnvVarTab from './EnvVarTab.vue';
import OtherTab from './OtherTab.vue';

interface Env {
  key: string;
  value: string;
}
export interface ContainerFormData {
  id?: string;
  name: string;
  icon: UploaderFileListItem[];
  image: string;
  network: string;
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
const portError = ref(false);
const mountError = ref(false);
const envError = ref(false);
const formData = ref({
  id: '',
  name: '',
  icon: [] as UploaderFileListItem[],
  image: '',
  network: '',
  runAffterCreated: false,
  command: '',
  envs: [] as Env[],
  mounts: [] as MountConfig[],
  ports: [] as PortConfig[],
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
    const { Id, Name, Config, HostConfig, Mounts } = res.data;
    formData.value = {
      id: Id,
      name: Name.slice(1),
      image: Config.Image,
      network: HostConfig.NetworkMode,
      restart: HostConfig.RestartPolicy.Name,
      runAffterCreated: true,
      command: Config.Cmd.map(item => (item.indexOf(' ') > 0 ? `"${item}"` : item))?.join(' '),
      envs: Config.Env.map(item => {
        const [key, value] = item.split('=');
        return { key, value };
      }),
      mounts: Mounts.map(item => ({
        type: item.Type as 'bind' | 'volume',
        container: item.Destination,
        hostBind: item.Type === 'bind' ? item.Source : undefined,
        volume: item.Type === 'volume' ? item.Name : undefined,
        readonly: !item.RW,
      })),
      ports: Object.keys(HostConfig.PortBindings).map(key => {
        const [container, protocol] = key.split('/');
        const HostPort = HostConfig.PortBindings[key]?.[0].HostPort;
        return {
          host: HostPort ? Number(HostPort) : undefined,
          container: Number(container),
          protocol: protocol as 'tcp' | 'udp',
        };
      }),
      icon: [
        {
          url:
            Config.Labels['docker.mobile.icon'] ||
            Config.Labels['com.docker.desktop.extension.icon'] ||
            Config.Labels['net.unraid.docker.icon'],
        },
      ],
      localUrl: Config.Labels['docker.mobile.localUrl'],
      internetUrl: Config.Labels['docker.mobile.internetUrl'],
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
  if (formData.value.id) {
    const res = await updateContainer({ id: formData.value.id, ...params });
    if (res.success) {
      showSuccessToast({
        message: '更新成功',
        onClose() {
          router.push('/');
        },
      });
    }
  } else {
    const res = await createContainer(params);
    if (res.success) {
      showSuccessToast({
        message: '创建成功',
        onClose() {
          router.push('/');
        },
      });
    }
  }
};

const onFailed = (errorInfo: { values: object; errors: { message: string; name: string }[] }) => {
  mountError.value = false;
  portError.value = false;
  envError.value = false;
  errorInfo.errors.forEach(item => {
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
