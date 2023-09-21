<template>
  <TitleBar title="镜像列表" />
  <div class="image-list">
    <ImageCard
      v-for="image in imageList"
      :key="image.Id"
      :image="image"
      @click="onImageClick(image)"
    />
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
        name="pullImageName"
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
import TitleBar from '@/components/TitleBar.vue';
import { getImageList, removeImage, updateImage, pullImage } from '@/apis/image';
import type { ImageItem } from '@common/types/image';
import ImageCard from './ImageCard.vue';

const imageList = ref<ImageItem[]>([]);
const showAction = ref(false);
const actionImage = ref<ImageItem | null>(null);
const showPullModal = ref(false);
const pullModalForm = ref<FormInstance>();
const pullImageName = ref('');
const actions = computed(() => {
  const disabledRemove = !!actionImage.value?.Containers;
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
  height: 0;
  overflow-x: auto;
  margin-bottom: 72px;
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
