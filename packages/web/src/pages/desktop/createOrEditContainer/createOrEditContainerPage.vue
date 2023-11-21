<!-- eslint-disable vue/html-quotes -->
<template>
  <PageLayout
    :breadcrumbs="[
      { to: '/d/container', lable: '容器列表' },
      { lable: `容器${isEdit ? '编辑-' : '新增'}${formData?.name || ''}` },
    ]"
  >
    <template #right>
      <el-button
        type="success"
        @click="onSubmit"
      >
        保存
      </el-button>
    </template>
    <div class="new-or-edit-container-page">
      <el-form
        ref="formRef"
        :model="formData"
        label-width="120px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="图标"
              prop="icon"
            >
              <el-upload
                ref="uploadIconRef"
                v-model:file-list="formData.icon"
                class="upload-icon"
                list-type="picture-card"
                drag
                :auto-upload="false"
                :on-change="onIconReaded"
                :on-exceed="onIconOversize"
                :on-preview="onIconPreview"
                :limit="1"
              >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                  拖拽上传 <br />
                  <em>点击上传</em>
                </div>
                <template #tip>
                  <div class="el-upload__tip"> 支持jpeg、webp、png <br />裁剪后大小不超过10MB </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col v-bind="fieldLayout">
            <el-form-item
              label="容器名"
              prop="name"
              :rules="[{ required: true, message: '请输入' }]"
            >
              <el-input
                v-model="formData.name"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col v-bind="fieldLayout">
            <el-form-item
              label="镜像"
              prop="image"
              :rules="[{ required: true, message: '请输入' }]"
            >
              <el-select
                v-model="formData.image"
                style="width: 60%"
                filterable
                remote
                default-first-option
                placeholder="请选择"
                :remote-method="onImageInputChange"
                @change="onImageChange"
              >
                <el-option
                  v-for="item in imageList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                >
                  <div class="image-item">
                    <div class="name">
                      <span>{{ item.name }}</span>
                      <el-icon
                        v-if="item.is_official"
                        class="icon"
                      >
                        <Medal />
                      </el-icon>
                    </div>
                    <div class="star">
                      {{ numberFormat(item.star_count) }}
                      <el-icon style="margin-left: 4px"><StarFilled /></el-icon>
                    </div>
                  </div>
                </el-option>
              </el-select>
              <el-input
                v-model="formData.tag"
                style="width: 40%"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col v-bind="fieldLayout">
            <el-form-item
              label="网络"
              prop="network"
              :rules="[{ required: true, message: '请输入' }]"
            >
              <el-select
                v-model="formData.network"
                style="width: 100%"
                placeholder="请选择"
              >
                <el-option
                  v-for="network in networkList"
                  :key="network.Name"
                  :label="network.Name"
                  :value="network.Name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-bind="fieldLayout">
            <el-form-item
              label="重启策略"
              prop="restart"
            >
              <el-select
                v-model="formData.restart"
                style="width: 100%"
                placeholder="请选择"
              >
                <el-option
                  v-for="network in restartPolicyList"
                  :key="network.value"
                  :label="network.text"
                  :value="network.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-bind="fieldLayout">
            <el-form-item
              label="内网地址"
              prop="localUrl"
            >
              <el-input
                v-model="formData.localUrl"
                placeholder="例：http://192.168.0.1:7880"
              />
            </el-form-item>
          </el-col>
          <el-col v-bind="fieldLayout">
            <el-form-item
              label="外网地址"
              prop="internetUrl"
            >
              <el-input
                v-model="formData.internetUrl"
                placeholder="例：https://xxx.xxx.com"
              />
            </el-form-item>
          </el-col>
          <el-col v-bind="fieldLayout">
            <el-form-item
              label="启动命令"
              prop="command"
            >
              <el-input
                v-model="formData.command"
                type="textarea"
                :rows="2"
                placeholder='请输入启动命令, 参数中间有空格使用双引号包裹,例：nginx -g "daemon off;"'
              />
            </el-form-item>
          </el-col>
          <el-col v-bind="fieldLayout">
            <el-form-item
              label="创建后启动"
              prop="runAffterCreated"
            >
              <el-switch v-model="formData.runAffterCreated" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-card
          v-if="formData.network !== 'host'"
          class="form-card"
        >
          <template #header>
            <div class="card-header">
              <span>端口配置</span>
              <el-button
                class="button"
                text
                size="small"
                type="primary"
                @click="formData.ports.push({ protocol: 'tcp' } as PortConfig)"
              >
                增加端口
              </el-button>
            </div>
          </template>
          <el-table
            :data="formData.ports"
            empty-text="无条目，请添加"
          >
            <el-table-column
              prop="date"
              label="序号"
              width="80"
            >
              <template #default="{ $index }: { $index: number }">
                {{ $index + 1 }}
              </template>
            </el-table-column>
            <el-table-column
              prop="host"
              label="主机端口"
            >
              <template #default="{ row, $index }: { row: PortConfig; $index: number }">
                <el-form-item
                  label-width="0"
                  :prop="`ports[${$index}].host`"
                  :rules="[{ required: true, message: '请输入' }]"
                >
                  <el-input-number
                    v-model="row.host"
                    :precision="0"
                    :controls="false"
                    placeholder="请输入"
                    style="width: 100%"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="container"
              label="容器端口"
            >
              <template #default="{ row, $index }: { row: PortConfig; $index: number }">
                <el-form-item
                  label-width="0"
                  :prop="`ports[${$index}].container`"
                  :rules="[{ required: true, message: '请输入' }]"
                >
                  <el-input-number
                    v-model="row.container"
                    :precision="0"
                    :controls="false"
                    placeholder="请输入"
                    style="width: 100%"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="protocol"
              label="协议"
            >
              <template #default="{ row, $index }: { row: PortConfig; $index: number }">
                <el-form-item
                  label-width="0"
                  :prop="`ports[${$index}].protocol`"
                  :rules="[{ required: true, message: '请选择' }]"
                >
                  <el-select
                    v-model="row.protocol"
                    placeholder="请选择"
                    style="width: 100%"
                  >
                    <el-option
                      value="tcp"
                      label="TCP"
                    />
                    <el-option
                      value="udp"
                      label="UDP"
                    />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="container"
              label="操作"
            >
              <template #default="{ $index }: { $index: number }">
                <el-button
                  type="danger"
                  link
                  @click="onRemove('ports', $index)"
                >
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card class="form-card">
          <template #header>
            <div class="card-header">
              <span>挂载配置</span>
              <el-button
                class="button"
                text
                size="small"
                type="primary"
                @click="formData.mounts.push({ type: 'bind', container: '', readonly: false })"
              >
                增加挂载
              </el-button>
            </div>
          </template>
          <el-table
            :data="formData.mounts"
            empty-text="无条目，请添加"
          >
            <el-table-column
              prop="date"
              label="序号"
              width="80"
            >
              <template #default="{ $index }: { $index: number }">
                {{ $index + 1 }}
              </template>
            </el-table-column>
            <el-table-column
              prop="type"
              label="类型"
              width="120"
            >
              <template #default="{ row, $index }: { row: MountConfig; $index: number }">
                <el-form-item
                  label-width="0"
                  :prop="`mounts[${$index}].type`"
                  :rules="[{ required: true, message: '请选择' }]"
                >
                  <el-select
                    v-model="row.type"
                    placeholder="请选择"
                    style="width: 100%"
                  >
                    <el-option
                      value="bind"
                      label="路径"
                    />
                    <el-option
                      value="volume"
                      label="卷"
                    />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="host"
              label="主机路径/卷"
            >
              <template #default="{ row, $index }: { row: MountConfig; $index: number }">
                <el-form-item
                  v-if="row.type === 'bind'"
                  label-width="0"
                  :prop="`mounts[${$index}].hostBind`"
                  :rules="[{ required: true, message: '请输入' }]"
                >
                  <el-input
                    v-model="row.hostBind"
                    placeholder="请输入"
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item
                  v-else
                  label-width="0"
                  :prop="`mounts[${$index}].volume`"
                  :rules="[{ required: true, message: '请选择' }]"
                >
                  <el-select
                    v-model="row.volume"
                    style="width: 100%"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="volume in volumeList"
                      :key="volume.Name"
                      :value="volume.Name"
                      :label="volume.Name"
                    />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="container"
              label="容器路径"
            >
              <template #default="{ row, $index }: { row: MountConfig; $index: number }">
                <el-form-item
                  label-width="0"
                  :prop="`mounts[${$index}].container`"
                  :rules="[{ required: true, message: '请输入' }]"
                >
                  <el-input
                    v-model="row.container"
                    placeholder="请输入"
                    style="width: 100%"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="container"
              label="只读"
              width="120"
            >
              <template #default="{ row, $index }: { row: MountConfig; $index: number }">
                <el-form-item
                  label-width="0"
                  :prop="`mounts[${$index}].readonly`"
                >
                  <el-switch v-model="row.readonly" />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              prop="container"
              label="操作"
              width="120"
            >
              <template #default="{ $index }: { $index: number }">
                <el-button
                  type="danger"
                  link
                  @click="onRemove('mounts', $index)"
                >
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card class="form-card">
          <template #header>
            <div class="card-header">
              <span>环境变量配置</span>
              <el-button
                class="button"
                text
                size="small"
                type="primary"
                @click="formData.envs.push({ key: '', value: '' })"
              >
                增加环境变量
              </el-button>
            </div>
          </template>
          <el-table
            :data="formData.envs"
            empty-text="无条目，请添加"
          >
            <el-table-column
              prop="index"
              label="序号"
              width="80"
            >
              <template #default="{ $index }: { $index: number }">
                {{ $index + 1 }}
              </template>
            </el-table-column>
            <el-table-column
              prop="key"
              label="键"
            >
              <template #default="{ row, $index }: { row: Env; $index: number }">
                <el-form-item
                  label-width="0"
                  :prop="`envs[${$index}].key`"
                  :rules="[{ required: true, message: '请输入' }]"
                >
                  <el-input
                    v-model="row.key"
                    placeholder="请输入"
                    style="width: 100%"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="value"
              label="值"
            >
              <template #default="{ row, $index }: { row: Env; $index: number }">
                <el-form-item
                  label-width="0"
                  :prop="`envs[${$index}].value`"
                  :rules="[{ required: true, message: '请输入' }]"
                >
                  <el-input
                    v-model="row.value"
                    placeholder="请输入"
                    style="width: 100%"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="container"
              label="操作"
              width="120"
            >
              <template #default="{ $index }: { $index: number }">
                <el-button
                  type="danger"
                  link
                  @click="onRemove('envs', $index)"
                >
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-form>
    </div>
    <el-dialog
      v-model="showIconCropper"
      title="编辑图片"
      width="464"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @opened="onCropperOpen"
    >
      <div class="cropper-box">
        <img id="container-icon-cropper" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onIconCropperCancel">取消</el-button>
          <el-button
            type="primary"
            @click="onIconCropperConfirm"
          >
            确认裁剪
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="showPreviewIcon"
      title="图标预览"
      width="440"
    >
      <img
        width="400"
        w-full
        :src="previewIconUrl"
        alt="Preview Image"
      />
    </el-dialog>
  </PageLayout>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { UploadFilled, Medal, StarFilled } from '@element-plus/icons-vue';
import { ElLoading, ElMessage } from 'element-plus';
import Cropper from 'cropperjs';

import type { MountConfig, Env } from '@common/types/container';
import type { Image } from '@common/types/image';
import type { Volume } from '@common/types/volume';
import type { PortConfig, Network } from '@common/types/network';
import { restartPolicyList } from '@common/constants/const';

import PageLayout from '@/components/desktop/PageLayout.vue';
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

import type { UploadUserFile, UploadProps, FormInstance } from 'element-plus';
const showIconCropper = ref(false);
const showPreviewIcon = ref(false);
const previewIconUrl = ref('');
const iconCropper = ref<Cropper | null>(null);
const iconFileName = ref<string | undefined>('');
const imageList = ref<Image[]>([]);
const networkList = ref<Network[]>([]);
const volumeList = ref<Volume[]>([]);
const formRef = ref<FormInstance>();

const route = useRoute();
const router = useRouter();
const isEdit = !!route.query.id;
const fieldLayout = {
  xs: 24,
  sm: 12,
  lg: 8,
  xl: 6,
};

const formData = ref({
  id: '',
  name: '',
  icon: [] as UploadUserFile[],
  image: '',
  tag: '',
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

const onIconOversize = () => {
  ElMessage('最多一张图片，请移除后再添加');
};

const onIconReaded = (file: UploadUserFile) => {
  iconFileName.value = file.name;
  showIconCropper.value = true;
};

const onCropperOpen = () => {
  const image = document.getElementById('container-icon-cropper');
  if (!image) {
    return;
  }
  const src = formData.value.icon[0].url;
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

const onIconCropperCancel = () => {
  showIconCropper.value = false;
  formData.value.icon = [];
};

const onIconCropperConfirm = async () => {
  const croppedData = iconCropper.value?.getCroppedCanvas().toDataURL('image/jpeg');
  if (croppedData) {
    const file = dataURLtoFile(croppedData, iconFileName.value as string);
    const res = await uploadImg(file, { name: iconFileName.value, height: 240 });
    if (res.success) {
      ElMessage({
        type: 'success',
        message: '上传成功',
      });
      formData.value.icon = [
        {
          url: res.data,
          name: iconFileName.value || '',
        },
      ];
      showIconCropper.value = false;
    }
  }
};

const onIconPreview: UploadProps['onPreview'] = (uploadFile: UploadUserFile) => {
  previewIconUrl.value = uploadFile.url!;
  showPreviewIcon.value = true;
};

const onImageInputChange = async (text: string) => {
  if (!text.trim()) return;
  const res = await searchImage(text.trim());
  if (res.success) {
    imageList.value = res.data;
  }
};
const onImageChange = () => {
  formData.value.tag = 'latest';
};
const onRemove = (key: 'ports' | 'mounts' | 'envs', index: number) => {
  formData.value[key]?.splice(index, 1);
};
const onSubmit = async () => {
  await formRef.value?.validate();
  const { image, icon, tag, ports } = formData.value;
  const loading = ElLoading.service();
  if (formData.value.id) {
    const res = await updateContainer({
      ...formData.value,
      image: `${image}:${tag}`,
      icon: icon[0]?.url || '',
      ports: ports.map(port => ({
        host: port.host.toString(),
        container: port.container.toString(),
        protocol: port.protocol,
      })),
    });
    if (res.success) {
      ElMessage({
        type: 'success',
        message: '更新成功',
        onClose() {
          router.push('/d/container');
        },
      });
    }
  } else {
    const res = await createContainer({
      ...formData.value,
      image: `${image}:${tag}`,
      icon: icon[0]?.url || '',
      ports: ports.map(port => ({
        host: port.host.toString(),
        container: port.container.toString(),
        protocol: port.protocol,
      })),
    });
    if (res.success) {
      ElMessage({
        type: 'success',
        message: '创建成功',
        onClose() {
          router.push('/d/container');
        },
      });
    }
  }
  loading.close();
};
</script>
<style scoped lang="less">
.new-or-edit-container-page {
  padding-top: 16px;
  padding-right: 16px;
  padding-bottom: 32px;
  .upload-demo .el-upload-dragger {
    padding: 10px 16px;
  }
  .el-icon--upload {
    font-size: 56px;
  }
  .el-upload__text {
    line-height: 24px;
  }
  .el-upload__tip {
    line-height: 18px;
    text-align: center;
  }
}
.cropper-box {
  text-align: center;
  margin: 12px;
  width: 400px;
  height: 400px;
}
#container-icon-cropper {
  width: 100%;
  display: block;
  max-width: 100%;
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
    display: flex;
    align-items: center;
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
  .el-upload--picture-card {
    border: 0;
  }
  .upload-icon .el-upload-dragger {
    padding: 10px 16px;
  }
  .form-card {
    & + .form-card {
      margin-top: 16px;
    }
    .el-card__header {
      padding: 12px 16px;
    }
    .el-card__body {
      padding: 12px 16px;
    }
  }
}
</style>
