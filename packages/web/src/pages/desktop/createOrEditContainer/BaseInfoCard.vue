<!-- eslint-disable vue/no-v-html -->
<!-- eslint-disable vue/html-quotes -->
<template>
  <a-row>
    <a-col :span="24">
      <a-form-item
        label="图标"
        name="icon"
        :wrapper-col="iconType === 'upload' ? { style: { width: '220px', flex: 'none' } } : {}"
        :rules="[
          {
            validator: validatorSvg,
          },
        ]"
      >
        <a-form-item-rest>
          <a-radio-group
            v-model:value="iconType"
            size="small"
            button-style="solid"
            style="margin-bottom: 16px"
            @change="onIconTypeChange"
          >
            <a-radio-button value="upload">上传</a-radio-button>
            <a-radio-button value="url">URL</a-radio-button>
            <a-radio-button value="svg">SVG</a-radio-button>
          </a-radio-group>
        </a-form-item-rest>
        <a-tooltip
          v-if="iconType === 'upload'"
          title="支持jpeg、webp、png, 裁剪后不超过10MB"
          placement="right"
        >
          <a-upload
            v-model:fileList="form.icon"
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
        <div
          v-if="iconType === 'url'"
          class="icon-img"
        >
          <a-input
            v-model:value="form.icon[0].url"
            placeholder="请输入URL"
            spellcheck="false"
          />
          <a-image
            class="img-view"
            placeholder
            style="max-width: 80px; max-height: 80px; margin-left: 16px"
            :src="form.icon[0].url"
          />
        </div>

        <div
          v-if="iconType === 'svg'"
          class="icon-svg"
        >
          <a-textarea
            v-model:value="form.icon[0].svg"
            :rows="3"
            placeholder="请输入SVG"
            spellcheck="false"
          />
          <div
            class="svg-view"
            v-html="safeSvg(form.icon[0]?.svg) ? form.icon[0]?.svg : ''"
          />
        </div>
      </a-form-item>
    </a-col>
    <a-col v-bind="fieldLayout">
      <a-form-item
        label="容器名"
        name="name"
        :rules="[{ required: true, message: '请输入', trigger: 'blur' }]"
      >
        <a-input
          v-model:value="form.name"
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
        :rules="[{ required: true, message: '请输入', trigger: 'blur' }]"
      >
        <a-select
          v-model:value="form.image"
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
        :rules="[{ required: true, message: '请输入', trigger: 'blur' }]"
      >
        <a-input
          v-model:value="form.tag"
          style="width: 100%"
          placeholder="请输入"
        />
      </a-form-item>
    </a-col>
    <a-col
      v-if="mode === 'base'"
      v-bind="fieldLayout"
    >
      <a-form-item
        label="网络"
        :name="['networks', 0, 'name']"
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
            v-model:value="form.networks[0].name"
            style="width: 100%"
            placeholder="请选择"
            :options="networkList"
            :field-names="{ label: 'Name', value: 'Name' }"
            @change="(value: string) => onNetworkNameChange(value, 0)"
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
          v-model:value="form.restart"
          style="width: 100%"
          placeholder="请选择"
          :options="restartPolicyList"
          :field-names="{ label: 'text', value: 'value' }"
        />
      </a-form-item>
    </a-col>
    <a-col
      v-if="mode === 'advanced'"
      v-bind="fieldLayout"
    >
      <a-form-item
        label="hostname"
        name="hostname"
      >
        <a-input
          v-model:value="form.hostname"
          placeholder="示例：web01"
        />
      </a-form-item>
    </a-col>
    <a-col
      v-if="mode === 'advanced'"
      v-bind="fieldLayout"
    >
      <a-form-item
        label="domainName"
        name="domainName"
      >
        <a-input
          v-model:value="form.domainName"
          placeholder="示例：example.com"
        />
      </a-form-item>
    </a-col>
    <a-col v-bind="fieldLayout">
      <a-form-item
        label="内网地址"
        name="localUrl"
      >
        <a-input
          v-model:value="form.localUrl"
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
          v-model:value="form.internetUrl"
          placeholder="例：https://xxx.xxx.com"
        />
      </a-form-item>
    </a-col>
    <a-col
      v-if="mode === 'advanced'"
      v-bind="fieldLayout"
    >
      <a-form-item
        label="启动命令"
        name="command"
      >
        <a-textarea
          v-model:value="form.command"
          type="textarea"
          :rows="2"
          placeholder='请输入启动命令, 参数中间有空格使用双引号包裹,例：nginx -g "daemon off;"'
        />
      </a-form-item>
    </a-col>
    <a-col
      v-if="mode === 'advanced'"
      v-bind="fieldLayout"
    >
      <a-form-item
        label="Hosts文件配置"
        name="extraHosts"
      >
        <a-textarea
          v-model:value="form.extraHosts"
          :rows="3"
          placeholder="示例：www.baidu.com:192.168.0.1, cn.bing.com:192.168.0.2，多个使用逗号、空格、换行符分隔"
        />
      </a-form-item>
    </a-col>
    <a-col v-bind="fieldLayout">
      <a-form-item
        label="创建后启动"
        name="runAffterCreated"
      >
        <a-switch v-model:checked="form.runAffterCreated" />
      </a-form-item>
    </a-col>
  </a-row>
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
    @created="emit('reloadNetworkList')"
  />
</template>
<script setup lang="ts">
import { ref, watch, h } from 'vue';
import { InboxOutlined, FireFilled, StarFilled, PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

import type { Network } from '@common/types/network';
import type { Image } from '@common/types/image';
import { restartPolicyList } from '@common/constants/const';

import CreateNetworkModal from '@/components/desktop/CreateNetworkModal.vue';
import { searchImage, uploadImg } from '@/apis';
import { dataURLtoFile, numberFormat, safeSvg } from '@/utils/utils';

import type { FormData } from './type';
import type { UploadFile, RadioChangeEvent } from 'ant-design-vue';

const fieldLayout = {
  xs: 24,
  md: 12,
  xl: 8,
  xxl: 6,
};
const props = defineProps<{
  formData: FormData;
  mode: 'base' | 'advanced';
  networkList: Network[];
}>();
const emit = defineEmits(['valueChange', 'reloadNetworkList']);

const iconType = ref<'upload' | 'url' | 'svg'>(props.formData.icon[0]?.svg ? 'svg' : 'upload');
const showIconCropper = ref(false);
const showPreviewIcon = ref(false);
const previewIconUrl = ref('');
const iconCropper = ref<Cropper | null>(null);
const iconFileName = ref<string | undefined>('');
const showCreateNetworkModal = ref(false);
const imageList = ref<Image[]>([]);
const {
  name,
  icon,
  image,
  tag,
  networks,
  runAffterCreated,
  command,
  hostname,
  domainName,
  extraHosts,
  restart,
  localUrl,
  internetUrl,
} = props.formData;
const form = ref<
  Pick<
    FormData,
    | 'name'
    | 'icon'
    | 'image'
    | 'tag'
    | 'networks'
    | 'runAffterCreated'
    | 'command'
    | 'hostname'
    | 'domainName'
    | 'extraHosts'
    | 'restart'
    | 'localUrl'
    | 'internetUrl'
  >
>({
  name,
  icon,
  image,
  tag,
  networks,
  runAffterCreated,
  command,
  hostname,
  domainName,
  extraHosts,
  restart,
  localUrl,
  internetUrl,
});

watch(
  () => props.formData,
  () => {
    const {
      name,
      icon,
      image,
      tag,
      networks,
      runAffterCreated,
      command,
      hostname,
      domainName,
      extraHosts,
      restart,
      localUrl,
      internetUrl,
    } = props.formData;
    form.value = {
      name,
      icon,
      image,
      tag,
      networks,
      runAffterCreated,
      command,
      hostname,
      domainName,
      extraHosts,
      restart,
      localUrl,
      internetUrl,
    };
    if (icon[0]?.svg && iconType.value !== 'svg') {
      iconType.value = 'svg';
    } else if (icon[0]?.url?.startsWith('http') && iconType.value !== 'url') {
      iconType.value = 'url';
    }
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

const onIconTypeChange = (e: RadioChangeEvent) => {
  const type = e.target.value;
  if (type === 'url' || type === 'svg') {
    form.value.icon = [
      {
        url: type === 'url' ? form.value.icon[0]?.url : '',
        uid: '',
        name: '',
        svg: type === 'svg' ? form.value.icon[0]?.svg : '',
      },
    ];
  }
  if (type === 'upload') {
    form.value.icon = [];
  }
};

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
  form.value.icon = [];
};

const onIconCropperConfirm = async () => {
  const croppedData = iconCropper.value?.getCroppedCanvas({}).toDataURL('image/png');
  if (croppedData) {
    const file = dataURLtoFile(croppedData, iconFileName.value as string);
    const res = await uploadImg(file, { name: iconFileName.value, height: 240 });
    if (res.success) {
      message.success({
        content: '上传成功',
      });
      form.value.icon = [
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
  form.value.tag = 'latest';
};
const validatorSvg = () => {
  const svg = form.value.icon[0]?.svg;
  if (!svg || safeSvg(svg)) return Promise.resolve();
  return Promise.reject('SVG存在不安全代码');
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
</script>
<style scoped lang="less">
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
.icon-svg {
  display: flex;
  align-items: center;
  .svg-view {
    margin-left: 16px;
    width: 80px;
    height: 80px;
    border: solid 1px #ccc;
    border-radius: 6px;
    display: flex;
    align-items: center;
  }
}
.icon-img {
  display: flex;
  align-items: center;
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
</style>
<style lang="less">
.new-or-edit-container-page {
  .icon-upload-control {
    .ant-upload-select {
      background-color: #fff !important;
    }
  }
}
.image-search-list {
  width: 300px !important;
}
</style>
