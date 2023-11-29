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
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="图标"
              name="icon"
              :wrapper-col="{ style: { width: '220px', flex: 'none' } }"
            >
              <a-tooltip title="支持jpeg、webp、png, 裁剪后不超过10MB">
                <a-upload
                  v-model:fileList="formData.icon"
                  class="icon-upload-control"
                  accept="image/*"
                  list-type="picture-card"
                  :max-count="1"
                  :before-upload="() => false"
                  @change="onIconReaded"
                  @preview="onIconPreview"
                >
                  <div>
                    <div class="upload-icon">
                      <InboxOutlined />
                    </div>
                    <div class="upload-text">拖拽上传<br />点击上传</div>
                  </div>
                </a-upload>
              </a-tooltip>
            </a-form-item>
          </a-col>
          <a-col v-bind="fieldLayout">
            <a-form-item
              label="容器名"
              name="name"
              :rules="[{ required: true, message: '请输入' }]"
            >
              <a-input
                v-model:value="formData.name"
                placeholder="请输入"
              />
            </a-form-item>
          </a-col>
          <a-col
            :xs="16"
            :md="8"
            :xl="6"
            :xxl="4"
          >
            <a-form-item
              label="镜像"
              name="image"
              :rules="[{ required: true, message: '请输入' }]"
            >
              <a-select
                v-model:value="formData.image"
                style="width: 100%"
                show-search
                placeholder="请输入选择"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                popup-class-name="image-search-list"
                option-label-prop="label"
                @search="onImageInputChange"
                @change="onImageChange"
              >
                <a-select-option
                  v-for="item in imageList"
                  :key="item.name"
                  :title="item.name"
                  :value="item.name"
                >
                  <div class="image-item">
                    <FireFilled
                      v-if="item.is_official"
                      style="margin-right: 6px; color: rgb(207, 8, 8)"
                    />
                    <div class="name">
                      <span>{{ item.name }}</span>
                    </div>
                    <div class="star">
                      {{ numberFormat(item.star_count) }}
                      <StarFilled style="color: rgb(255, 136, 0)" />
                    </div>
                  </div>
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :xs="8"
            :md="4"
            :xl="2"
            :xxl="2"
          >
            <a-form-item
              name="tag"
              :rules="[{ required: true, message: '请输入' }]"
            >
              <a-input
                v-model:value="formData.tag"
                style="width: 100%"
                placeholder="请输入"
              />
            </a-form-item>
          </a-col>
          <a-col v-bind="fieldLayout">
            <a-form-item
              label="网络"
              name="network"
              :rules="[{ required: true, message: '请输入' }]"
            >
              <div style="display: flex; align-items: center">
                <a-select
                  v-model:value="formData.network"
                  style="width: 100%"
                  placeholder="请选择"
                  :options="networkList"
                  :field-names="{ label: 'Name', value: 'Name' }"
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
          </a-col>
          <a-col v-bind="fieldLayout">
            <a-form-item
              label="重启策略"
              name="restart"
            >
              <a-select
                v-model:value="formData.restart"
                style="width: 100%"
                placeholder="请选择"
                :options="restartPolicyList"
                :field-names="{ label: 'text', value: 'value' }"
              />
            </a-form-item>
          </a-col>
          <a-col v-bind="fieldLayout">
            <a-form-item
              label="内网地址"
              name="localUrl"
            >
              <a-input
                v-model:value="formData.localUrl"
                placeholder="例：http://192.168.0.1:7880"
              />
            </a-form-item>
          </a-col>
          <a-col v-bind="fieldLayout">
            <a-form-item
              label="外网地址"
              name="internetUrl"
            >
              <a-input
                v-model:value="formData.internetUrl"
                placeholder="例：https://xxx.xxx.com"
              />
            </a-form-item>
          </a-col>
          <a-col v-bind="fieldLayout">
            <a-form-item
              label="启动命令"
              name="command"
            >
              <a-textarea
                v-model:value="formData.command"
                type="textarea"
                :rows="2"
                placeholder='请输入启动命令, 参数中间有空格使用双引号包裹,例：nginx -g "daemon off;"'
              />
            </a-form-item>
          </a-col>
          <a-col v-bind="fieldLayout">
            <a-form-item
              label="创建后启动"
              name="runAffterCreated"
            >
              <a-switch v-model:checked="formData.runAffterCreated" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-card
          v-if="formData.network !== 'host'"
          class="form-card"
          title="端口配置"
        >
          <template #extra>
            <a-button
              class="button"
              size="small"
              type="link"
              @click="formData.ports?.push({ protocol: 'tcp' } as PortConfig)"
            >
              增加端口
            </a-button>
          </template>
          <a-table
            :data-source="formData.ports"
            :columns="portColumns"
            size="middle"
            :pagination="false"
          >
            <template #emptyText> 无条目，请添加 </template>
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'host'">
                <a-form-item
                  label-width="0"
                  :name="['ports', index, 'host']"
                  :rules="[{ required: true, message: '请输入' }]"
                >
                  <a-input-number
                    v-model:value="record.host"
                    :precision="0"
                    placeholder="请输入"
                    style="width: 100%"
                  />
                </a-form-item>
              </template>
              <template v-if="column.key === 'container'">
                <a-form-item
                  label-width="0"
                  :name="['ports', index, 'container']"
                  :rules="[{ required: true, message: '请输入' }]"
                >
                  <a-input-number
                    v-model:value="record.container"
                    :precision="0"
                    placeholder="请输入"
                    style="width: 100%"
                  />
                </a-form-item>
              </template>
              <template v-if="column.key === 'protocol'">
                <a-form-item
                  label-width="0"
                  :name="['ports', index, 'protocol']"
                  :rules="[{ required: true, message: '请选择' }]"
                >
                  <a-select
                    v-model:value="record.protocol"
                    placeholder="请选择"
                    style="width: 100%"
                    :options="[
                      { label: 'TCP', value: 'tcp' },
                      { label: 'UDP', value: 'udp' },
                    ]"
                  />
                </a-form-item>
              </template>
              <template v-if="column.key === 'operate'">
                <a-button
                  type="link"
                  danger
                  @click="onRemove('ports', index)"
                >
                  移除
                </a-button>
              </template>
            </template>
          </a-table>
        </a-card>
        <a-card
          class="form-card"
          title="挂载配置"
        >
          <template #extra>
            <a-button
              class="button"
              size="small"
              type="link"
              @click="formData.mounts?.push({ type: 'bind', container: '', readonly: false })"
            >
              增加挂载
            </a-button>
          </template>
          <a-table
            :data-source="formData.mounts"
            :columns="mountColumns"
            size="middle"
            :pagination="false"
          >
            <template #emptyText> 无条目，请添加 </template>
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'type'">
                <a-form-item
                  label-width="0"
                  :name="['mounts', index, 'type']"
                  :rules="[{ required: true, message: '请选择' }]"
                >
                  <a-select
                    v-model:value="record.type"
                    placeholder="请选择"
                    style="width: 100%"
                    :options="[
                      { label: '路径', value: 'bind' },
                      { label: '卷', value: 'volume' },
                    ]"
                  />
                </a-form-item>
              </template>
              <template v-if="column.key === 'host'">
                <a-form-item
                  v-if="record.type === 'bind'"
                  label-width="0"
                  :name="['mounts', index, 'hostBind']"
                  :rules="[{ required: true, message: '请输入' }]"
                >
                  <a-input
                    v-model:value="record.hostBind"
                    placeholder="请输入"
                    style="width: 100%"
                  />
                </a-form-item>
                <a-form-item
                  v-else
                  label-width="0"
                  :name="['mounts', index, 'volume']"
                  :rules="[{ required: true, message: '请选择' }]"
                >
                  <div style="display: flex; align-items: center">
                    <a-select
                      v-model:value="record.volume"
                      style="width: 100%"
                      placeholder="请选择"
                      :options="volumeList"
                      :field-names="{ label: 'Name', value: 'Name' }"
                    />
                    <a-button
                      type="primary"
                      shape="circle"
                      size="small"
                      style="margin-left: 6px"
                      :icon="h(PlusOutlined)"
                      @click="showCreateVolumeModal = true"
                    />
                  </div>
                </a-form-item>
              </template>
              <template v-if="column.key === 'container'">
                <a-form-item
                  label-width="0"
                  :name="['mounts', index, 'container']"
                  :rules="[{ required: true, message: '请输入' }]"
                >
                  <a-input
                    v-model:value="record.container"
                    placeholder="请输入"
                    style="width: 100%"
                  />
                </a-form-item>
              </template>
              <template v-if="column.key === 'rw'">
                <a-form-item
                  label-width="0"
                  :name="['mounts', index, 'readonly']"
                >
                  <a-switch v-model:checked="record.readonly" />
                </a-form-item>
              </template>
              <template v-if="column.key === 'operate'">
                <a-button
                  type="link"
                  danger
                  @click="onRemove('mounts', index)"
                >
                  移除
                </a-button>
              </template>
            </template>
          </a-table>
        </a-card>
        <a-card
          class="form-card"
          title="环境变量配置"
        >
          <template #extra>
            <a-button
              class="button"
              size="small"
              type="link"
              @click="formData.envs?.push({ envKey: '', envValue: '' })"
            >
              增加环境变量
            </a-button>
          </template>
          <a-table
            :data-source="formData.envs"
            :columns="envColumns"
            size="middle"
            :pagination="false"
          >
            <template #emptyText> 无条目，请添加 </template>
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'envKey'">
                <a-form-item
                  label-width="0"
                  :name="['envs', index, 'envKey']"
                  :rules="[{ required: true, message: '请输入' }]"
                >
                  <a-input
                    v-model:value="record.envKey"
                    placeholder="请输入"
                    style="width: 100%"
                  />
                </a-form-item>
              </template>
              <template v-if="column.key === 'envValue'">
                <a-form-item
                  label-width="0"
                  :name="['envs', index, 'envValue']"
                  :rules="[{ required: true, message: '请输入' }]"
                >
                  <a-input
                    v-model:value="record.envValue"
                    placeholder="请输入"
                    style="width: 100%"
                  />
                </a-form-item>
              </template>
              <template v-if="column.key === 'operate'">
                <a-button
                  type="link"
                  danger
                  @click="onRemove('envs', index)"
                >
                  移除
                </a-button>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-form>
    </div>
    <a-modal
      v-model:open="showIconCropper"
      title="编辑图片"
      :width="472"
      :closable="false"
      :force-render="true"
      :keyboard="false"
      :mask-closable="false"
    >
      <div class="cropper-box">
        <img id="container-icon-cropper" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <a-button @click="onIconCropperCancel">取消</a-button>
          <a-button
            type="primary"
            @click="onIconCropperConfirm"
          >
            确认裁剪
          </a-button>
        </span>
      </template>
    </a-modal>
    <a-modal
      v-model:open="showPreviewIcon"
      title="图标预览"
      :footer="null"
    >
      <img
        alt="example"
        style="width: 100%"
        :src="previewIconUrl"
      />
    </a-modal>
    <CreateNetworkModal
      v-model:open="showCreateNetworkModal"
      @created="getNetworkData()"
    />
    <CreateVolumeModal
      v-model:open="showCreateVolumeModal"
      @created="getVolumeData()"
    />
  </PageLayout>
</template>
<script setup lang="ts">
import { ref, onMounted, h } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { InboxOutlined, FireFilled, StarFilled, PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

import type { MountConfig } from '@common/types/container';
import type { Image } from '@common/types/image';
import type { Volume } from '@common/types/volume';
import type { PortConfig, Network } from '@common/types/network';
import { restartPolicyList } from '@common/constants/const';

import PageLayout from '@/components/desktop/PageLayout.vue';
import CreateNetworkModal from '@/components/desktop/CreateNetworkModal.vue';
import CreateVolumeModal from '@/components/desktop/CreateVolumeModal.vue';
import {
  searchImage,
  getNetworkList,
  uploadImg,
  getContainerDetail,
  updateContainer,
  createContainer,
  getVolumeList,
} from '@/apis';
import { dataURLtoFile, numberFormat } from '@/utils/utils';

import type { TableColumnProps, UploadFile, FormInstance } from 'ant-design-vue';

const showIconCropper = ref(false);
const showPreviewIcon = ref(false);
const showCreateNetworkModal = ref(false);
const showCreateVolumeModal = ref(false);
const previewIconUrl = ref('');
const iconCropper = ref<Cropper | null>(null);
const iconFileName = ref<string | undefined>('');
const imageList = ref<Image[]>([]);
const networkList = ref<Network[]>([]);
const volumeList = ref<Volume[]>([]);
const formRef = ref<FormInstance>();
const submitLoading = ref(false);

const route = useRoute();
const router = useRouter();
const isEdit = !!route.query.id;
const fieldLayout = {
  xs: 24,
  md: 12,
  xl: 8,
  xxl: 6,
};

interface FormData {
  id?: string;
  name: string;
  icon: UploadFile[];
  image: string;
  tag: string;
  network: string;
  runAffterCreated: boolean;
  command: string;
  envs: { envKey: string; envValue: string }[];
  mounts: MountConfig[];
  ports: PortConfig[];
  restart: string;
  localUrl?: string;
  internetUrl?: string;
}

const formData = ref<Partial<FormData>>({
  id: '',
  name: '',
  icon: [],
  image: route.query.image as string,
  tag: route.query.tag as string,
  network: undefined,
  runAffterCreated: false,
  command: '',
  envs: [],
  mounts: [],
  ports: [],
  restart: 'no',
  localUrl: '',
  internetUrl: '',
});

const portColumns: TableColumnProps[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '序号',
    customRender: ({ index }) => index + 1,
  },
  {
    key: 'host',
    dataIndex: 'host',
    title: '主机端口',
  },
  {
    key: 'container',
    dataIndex: 'container',
    title: '容器端口',
  },
  {
    key: 'protocol',
    dataIndex: 'protocol',
    title: '协议',
  },
  {
    key: 'operate',
    dataIndex: 'operate',
    title: '操作',
  },
];

const mountColumns: TableColumnProps[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '序号',
    customRender: ({ index }) => index + 1,
  },
  {
    key: 'type',
    dataIndex: 'type',
    title: '类型',
  },
  {
    key: 'host',
    dataIndex: 'host',
    title: '主机路径/卷',
  },
  {
    key: 'container',
    dataIndex: 'container',
    title: '容器路径',
  },
  {
    key: 'rw',
    dataIndex: 'rw',
    title: '只读',
  },
  {
    key: 'operate',
    dataIndex: 'operate',
    title: '操作',
  },
];
const envColumns: TableColumnProps[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '序号',
    customRender: ({ index }) => index + 1,
  },
  {
    key: 'envKey',
    dataIndex: 'envKey',
    title: '键',
  },
  {
    key: 'envValue',
    dataIndex: 'envValue',
    title: '值',
  },
  {
    key: 'operate',
    dataIndex: 'operate',
    title: '操作',
  },
];

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
    } = res.data;
    formData.value = {
      id: id,
      name: name,
      image: image.split(':')[0],
      tag: image.split(':')[1],
      network: networks[0]?.type,
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
      icon: [
        {
          uid: '',
          url: icon,
          name: icon || '',
        },
      ],
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
const getVolumeData = async () => {
  const res = await getVolumeList();
  if (res.success) {
    volumeList.value = res.data;
  }
};

onMounted(async () => {
  getNetworkData();
  getVolumeData();
  if (route.query.id) {
    getContainerData(route.query.id as string);
  }
});

const onIconReaded = ({ file }: { file: File }) => {
  if (!(file instanceof File)) return;
  iconFileName.value = file.name;
  showIconCropper.value = true;
  const image = document.getElementById('container-icon-cropper');
  if (!image) {
    return;
  }
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = e => {
    const src = e.target?.result || '';
    image.setAttribute('src', src as string);
    image.onload = () => {
      iconCropper.value?.destroy();
      iconCropper.value = new Cropper(image as HTMLImageElement, {
        aspectRatio: 1,
        autoCrop: true,
        modal: true,
      });
    };
  };
};

const onIconCropperCancel = () => {
  showIconCropper.value = false;
  formData.value.icon = [];
};

const onIconCropperConfirm = async () => {
  const croppedData = iconCropper.value
    ?.getCroppedCanvas({ fillColor: '#fff' })
    .toDataURL('image/jpeg');
  if (croppedData) {
    const file = dataURLtoFile(croppedData, iconFileName.value as string);
    const res = await uploadImg(file, { name: iconFileName.value, height: 240 });
    if (res.success) {
      message.success({
        content: '上传成功',
      });
      formData.value.icon = [
        {
          uid: '',
          url: res.data,
          name: iconFileName.value || '',
        },
      ];
      showIconCropper.value = false;
    }
  }
};

const onIconPreview = (uploadFile: UploadFile) => {
  previewIconUrl.value = uploadFile.url!;
  showPreviewIcon.value = true;
};

let searchTimer: NodeJS.Timeout;
const onImageInputChange = async (text: string) => {
  if (!text.trim()) return;
  clearTimeout(searchTimer);
  searchTimer = setTimeout(async () => {
    const res = await searchImage(text.trim());
    if (res.success) {
      imageList.value = res.data;
    }
  }, 500);
};

const onImageChange = () => {
  formData.value.tag = 'latest';
};

const onRemove = (key: 'ports' | 'mounts' | 'envs', index: number) => {
  formData.value[key]?.splice(index, 1);
};

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
    network,
    mounts,
    restart,
    runAffterCreated,
    id,
  } = formData.value as FormData;
  submitLoading.value = true;
  if (formData.value.id) {
    const res = await updateContainer({
      id: id as string,
      command,
      name,
      network,
      mounts,
      restart,
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
        content: '更新成功',
        onClose() {
          router.push('/d/container/list');
        },
      });
    }
  } else {
    const res = await createContainer({
      command,
      name,
      network,
      mounts,
      restart,
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
        content: '创建成功',
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
  .upload-icon {
    font-size: 24px;
    color: #409eff;
  }
  .upload-text {
    font-size: 12px;
    line-height: 18px !important;
    line-height: 24px;
    color: #777;
  }
}
.cropper-box {
  text-align: center;
  margin: 12px;
  width: 400px;
  height: 400px;
}
#container-icon-cropper {
  max-width: 100%;
  max-height: 100%;
}
.image-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .name {
    flex: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 16px;
  }
  .star {
    flex: none;
  }
  .icon {
    margin-left: 6px;
    color: #409eff;
  }
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
<style lang="less">
.new-or-edit-container-page {
  .icon-upload-control {
    .ant-upload-select {
      background-color: #fff !important;
    }
  }

  .form-card {
    & + .form-card {
      margin-top: 16px;
    }
  }
}
.image-search-list {
  width: 300px !important;
}
</style>
