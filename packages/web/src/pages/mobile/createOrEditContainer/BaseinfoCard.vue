<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <van-cell-group
      title="基本信息"
      inset
    >
      <van-field
        v-model="form.name"
        required
        name="name"
        label="容器名"
        placeholder="容器名"
        autocomplete="off"
        :rules="[{ required: true, message: '请填写容器名' }]"
      />
      <van-field label="图标类型">
        <template #input>
          <van-radio-group
            v-model="iconType"
            direction="horizontal"
            style="margin-bottom: 12px"
            @change="onIconTypeChange"
          >
            <van-radio name="upload">上传</van-radio>
            <van-radio name="url">URL</van-radio>
            <van-radio name="svg">SVG</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field
        v-if="iconType === 'upload'"
        name="icon"
        label="图标"
      >
        <template #input>
          <van-uploader
            v-model="form.icon"
            :max-size="10 * 1000 * 1000"
            :max-count="1"
            class="container-icon-upload"
            :after-read="onIconReaded"
            @oversize="onIconOversize"
          />
        </template>
      </van-field>
      <van-field
        v-if="iconType === 'url' && form.icon[0]"
        v-model="form.icon[0].url"
        :spellcheck="false"
        name="icon[0].url"
        label="图标URL"
        placeholder="请输入URL"
      />
      <van-image
        v-if="iconType === 'url' && form.icon[0]?.url"
        class="img-view"
        placeholder
        style="max-width: 80px; max-height: 80px; margin-left: 36%; margin-top: 8px"
        :src="form.icon[0].url"
      />
      <van-field
        v-if="iconType === 'svg' && form.icon[0]"
        v-model="form.icon[0].svg"
        name="icon[0].svg"
        label="图标SVG"
        type="textarea"
        :autosize="{ maxHeight: 200, minHeight: 50 }"
        :spellcheck="false"
        placeholder="请输入SVG"
      />
      <div
        v-if="iconType === 'svg' && form.icon[0]?.svg"
        class="svg-view"
        v-html="safeSvg(form.icon[0]?.svg) ? form.icon[0]?.svg : ''"
      />
      <van-popover
        v-model:show="showImagePopover"
        placement="bottom-end"
        trigger="manual"
        :show-arrow="false"
      >
        <template #reference>
          <van-field
            v-model="form.image"
            required
            name="image"
            label="镜像"
            placeholder="镜像"
            autocomplete="off"
            :rules="[{ required: true, message: '请填写镜像' }]"
            @update:model-value="onImageChange"
          />
        </template>
        <div class="image-list">
          <div
            v-for="image in imageList"
            :key="image.name"
            class="image-item"
            @click="() => onSelectImage(image)"
          >
            <div class="name">
              <span>{{ image.name }}</span>
              <van-icon
                v-if="image.is_official"
                name="medal-o"
                class="icon"
              />
            </div>
            <div class="star">
              {{ numberFormat(image.star_count) }}
              <van-icon
                name="star"
                class="icon"
              />
            </div>
          </div>
        </div>
      </van-popover>
      <van-field
        name="runAffterCreated"
        label="创建后启动"
      >
        <template #input>
          <div class="run-after-create">
            <van-switch v-model="form.runAffterCreated" />
          </div>
        </template>
      </van-field>
    </van-cell-group>
    <van-dialog
      :show="showIconCropper"
      title="标题"
      :lazy-render="false"
      show-cancel-button
      @cancel="onIconCropperCancel"
      @confirm="onIconCropperConfirm"
    >
      <div class="cropper-box">
        <img id="container-icon-cropper" />
      </div>
    </van-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { showToast, type UploaderFileListItem } from 'vant';
import Cropper from 'cropperjs';

import 'cropperjs/dist/cropper.css';
import type { Image } from '@common/types/image';

import { searchImage, uploadImg } from '@/apis';
import { numberFormat } from '@/utils/utils';
import { dataURLtoFile, safeSvg } from '@/utils/utils';

import type { ContainerFormData } from './type';

const props = defineProps<{ formData: ContainerFormData }>();
const emit = defineEmits(['valueChange']);
const form = ref<Pick<ContainerFormData, 'name' | 'icon' | 'image' | 'runAffterCreated'>>({
  name: '',
  icon: [],
  image: '',
  runAffterCreated: false,
});

const iconType = ref<'upload' | 'url' | 'svg'>(props.formData.icon[0]?.svg ? 'svg' : 'upload');

watch(
  () => props.formData,
  () => {
    form.value = {
      name: props.formData.name,
      icon: props.formData.icon,
      image: props.formData.image,
      runAffterCreated: props.formData.runAffterCreated,
    };

    if (props.formData.icon[0]?.svg && iconType.value !== 'svg') {
      iconType.value = 'svg';
    } else if (props.formData.icon[0]?.url?.startsWith('http') && iconType.value !== 'url') {
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

const showImagePopover = ref(false);
const showIconCropper = ref(false);
const iconCropper = ref<Cropper | null>(null);
const iconFileName = ref<string | undefined>('');
const imageList = ref<Image[]>([]);

const onIconTypeChange = (value: 'upload' | 'url' | 'svg') => {
  if (value === 'url' || value === 'svg') {
    form.value.icon = [
      {
        url: value === 'url' ? form.value.icon[0]?.url : '',
        svg: value === 'svg' ? form.value.icon[0]?.svg : '',
      },
    ];
  }
  if (value === 'upload') {
    form.value.icon = [];
  }
};

let searchImageTimer: NodeJS.Timeout;
const onImageChange = async (value: string) => {
  showImagePopover.value = true;
  clearTimeout(searchImageTimer);
  searchImageTimer = setTimeout(async () => {
    if (value.trim()) {
      const res = await searchImage(value.trim(), { limit: 10 });
      if (res.success) {
        imageList.value = res.data;
      }
    }
  }, 200);
};

const onSelectImage = (selectImage: Image) => {
  form.value.image = selectImage.name;
  showImagePopover.value = false;
};

const onIconOversize = () => {
  showToast('文件大小不能超过10MB');
};

const onIconReaded = (file: UploaderFileListItem | UploaderFileListItem[]) => {
  iconFileName.value = Array.isArray(file) ? file[0].file?.name : file.file?.name;
  showIconCropper.value = true;
  const image = document.getElementById('container-icon-cropper');
  if (!image) {
    return;
  }
  const src = Array.isArray(file) ? file[0].content : file.content;
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
  form.value.icon = [];
};
const onIconCropperConfirm = async () => {
  const croppedData = iconCropper.value?.getCroppedCanvas().toDataURL('image/jpeg');
  if (croppedData) {
    const file = dataURLtoFile(croppedData, iconFileName.value as string);
    const res = await uploadImg(file, { name: iconFileName.value, height: 240 });
    if (res.success) {
      showToast({
        type: 'success',
        message: '上传成功',
      });
      form.value.icon[0] = { url: res.data };
      showIconCropper.value = false;
    }
  }
};
</script>

<style scoped lang="less">
.icon-url {
  border: solid 1px #ccc;
  border-radius: 6px;
  width: 100%;
}
.icon-svg {
  border: solid 1px #ccc;
  border-radius: 6px;
  height: 100px;
  width: 100%;
}
.svg-view {
  width: 80px;
  height: 80px;
  margin-left: 36%;
  margin-top: 8px;
  border: solid 1px #ccc;
  border-radius: 6px;
  display: flex;
  align-items: center;
}
.image-list {
  width: 270px;

  .image-item {
    padding: 8px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: solid 1px #f5f5f5;

    .name {
      white-space: nowrap;
      overflow: hidden;
      flex: auto;
      text-overflow: ellipsis;

      .icon {
        margin-right: 6px;
      }
    }

    .star {
      width: 55px;
      font-size: 10px;
      text-align: right;
      flex: none;
    }

    .icon {
      color: #1989fa;
    }
  }
}
.run-after-create {
  text-align: right;
  height: 30px;
  flex: auto;
}
.cropper-box {
  text-align: center;
  margin: 12px;
  width: 100%;
  max-height: 100vw;
}
#container-icon-cropper {
  width: 100%;
  display: block;
  max-width: 100%;
}
</style>
