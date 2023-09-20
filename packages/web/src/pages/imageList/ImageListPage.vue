<template>
  <TitleBar />
  <div class="image-list">
    <div
      v-for="image in imageList"
      :key="image.Id"
      class="image-item"
    >
      <div class="row name">
        <div>{{ image.Name }}</div>
        <div @click="onImageClick(image)">
          <van-icon name="ellipsis" />
        </div>
      </div>
      <div class="row">
        <div>
          <span>容器数量：</span>
          <span :style="image.Containers ? 'color:green' : 'color:red'">{{
            image.Containers
          }}</span>
        </div>
        <div>时间：{{ dayjs.unix(image.Created).format('YYYY-MM-DD HH:mm') }}</div>
      </div>
      <div class="row">
        <div class="tag-row">
          <van-tag
            v-for="tag in image.Tags"
            :key="tag"
            class="tag"
            type="primary"
          >
            {{ tag }}
          </van-tag>
        </div>
        <div class="size"> 大小：{{ fileSizeFormat(image.Size) }} </div>
      </div>
    </div>
  </div>
  <div class="pull-image-btn-row van-safe-area-bottom">
    <van-button
      block
      round
      class="btn"
      type="primary"
      @click="showPullModal = true"
    >
      拉取镜像
    </van-button>
  </div>
  <van-dialog
    :show="showPullModal"
    title="拉取镜像"
    show-cancel-button
    @cancel="showPullModal = false"
    @confirm="onPullImageConfirm"
  >
    <van-form ref="pullModalForm">
      <van-field
        v-model="pullImageName"
        label="镜像名"
        required
        placeholder="请输入镜像名"
        class="pull-image-field"
        :rules="[{ required: true, message: '请输入镜像名' }]"
      />
    </van-form>
  </van-dialog>
  <van-action-sheet
    v-model:show="showAction"
    :actions="actions"
    cancel-text="取消"
  >
    <template #description>
      <div style="font-size: 20px; margin-bottom: 12px; color: #333">{{ actionImage?.Name }}</div>
      <van-text-ellipsis
        rows="2"
        :content="actionImage?.Id"
        expand-text="展开"
        collapse-text="收起"
      />
    </template>
  </van-action-sheet>
</template>
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import type { FormInstance } from 'vant';
import { showLoadingToast, showSuccessToast } from 'vant';
import dayjs from 'dayjs';
import TitleBar from '@/components/TitleBar.vue';
import { getImageList, removeImage, updateImage, pullImage } from '@/apis/image';
import type { ImageItem } from '@common/types/image';
import { fileSizeFormat } from '@/utils/utils';

const imageList = ref<ImageItem[]>([]);
const showAction = ref(false);
const actionImage = ref<ImageItem | null>(null);
const showPullModal = ref(false);
const pullModalForm = ref<FormInstance>();
const pullImageName = ref('');
const actions = computed(() => {
  const disabledRemove = !!imageList.value.find(image => image.Id === actionImage.value?.Id)
    ?.Containers;
  return [
    {
      name: '更新',
      callback: onUpdateImage,
    },
    {
      name: '删除',
      color: disabledRemove ? undefined : '#ee0a24',
      subname: disabledRemove ? '存在容器的镜像无法删除' : undefined,
      disabled: disabledRemove,
      callback: onRemoveImage,
    },
  ];
});

const getDataList = async () => {
  const res = await getImageList();
  if (res.success) {
    imageList.value = res.data;
  }
};

const onImageClick = (image: ImageItem) => {
  actionImage.value = image;
  showAction.value = true;
};

const onRemoveImage = async () => {
  if (!actionImage.value) {
    return;
  }
  showLoadingToast({ message: '删除中...', duration: 0, forbidClick: true });
  const res = await removeImage(actionImage.value.Id);
  if (res.success) {
    showSuccessToast('删除成功');
    showAction.value = false;
    actionImage.value = null;
    getDataList();
  }
};

const onUpdateImage = async () => {
  if (!actionImage.value) {
    return;
  }
  showLoadingToast({ message: '更新中...', duration: 0, forbidClick: true });
  const res = await updateImage(actionImage.value.Name);
  if (res.success) {
    showSuccessToast('更新成功');
    showAction.value = false;
    actionImage.value = null;
    getDataList();
  }
};

const onPullImageConfirm = async () => {
  await pullModalForm.value?.validate();
  showLoadingToast({ message: '拉取中...', duration: 0, forbidClick: true });
  const res = await pullImage(pullImageName.value);
  if (res.success) {
    showSuccessToast('拉取成功');
    showPullModal.value = false;
    pullImageName.value = '';
    getDataList();
  }
};

onMounted(async () => {
  getDataList();
});
</script>
<style scoped lang="less">
.image-list {
  flex: auto;
  margin-bottom: 72px;
  .image-item {
    background-color: #fff;
    margin: 12px;
    padding: 8px;
    .row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      font-size: 10px;
      color: rgba(0, 0, 0, 0.5);
    }
    .name {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.87);
    }
    .row + .row {
      margin-top: 6px;
    }
    .tag-row {
      flex: auto;
    }
    .tag {
      margin-right: 6px;
      margin-bottom: 6px;
    }
    .size {
      flex: none;
    }
  }
}
.pull-image-btn-row {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 12px;
  background-color: #fff;
  box-sizing: border-box;
}
.pull-image-field {
  margin: 12px 0;
}
</style>
