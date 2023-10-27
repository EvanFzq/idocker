<template>
  <TitleBar title="数据卷列表" />
  <div class="volume-list">
    <VolumeCard
      v-for="volume in volumeList"
      :key="volume.Name"
      :volume="volume"
      @click="onVolumeClick(volume)"
    />
  </div>

  <div class="add-volume-btn-row van-safe-area-bottom">
    <van-button
      block
      round
      class="btn"
      type="primary"
      @click="showAddModal = true"
    >
      新增数据卷
    </van-button>
  </div>
  <van-dialog
    :show="showAddModal"
    title="新增数据卷"
    show-cancel-button
    @cancel="showAddModal = false"
    @confirm="onAddVolumeConfirm"
  >
    <van-form
      ref="addModalForm"
      class="add-modal-form"
    >
      <van-field
        v-model="volumeForm.name"
        name="name"
        label="数据卷名"
        required
        autocomplete="off"
        placeholder="请输入数据卷名"
        class="add-volume-field"
        :rules="[{ required: true, message: '请输入数据卷名' }]"
      />
    </van-form>
  </van-dialog>
  <van-action-sheet
    v-model:show="showAction"
    :actions="actions"
    cancel-text="取消"
    :title="actionVolume?.Name"
  />
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { showLoadingToast, showSuccessToast } from 'vant';

import type { Volume } from '@common/types/volume';

import TitleBar from '@/components/TitleBar.vue';
import { getVolumeList, createVolume, removeVolume } from '@/apis/volume';

import type { FormInstance } from 'vant';
import VolumeCard from './VolumeCard.vue';

const volumeList = ref<Volume[]>([]);
const showAddModal = ref(false);
const showAction = ref(false);
const actionVolume = ref<Volume | null>(null);
const addModalForm = ref<FormInstance>();
const volumeForm = ref({
  name: '',
});

const actions = computed(() => {
  const disabledRemove = !!actionVolume.value?.UsageData.RefCount;
  return [
    {
      name: '删除',
      color: disabledRemove ? undefined : '#ee0a24',
      subname: disabledRemove ? '存在容器的数据卷无法删除' : undefined,
      disabled: disabledRemove,
      callback: onRemoveVolume,
    },
  ];
});
const getDataList = async () => {
  const res = await getVolumeList();
  if (res.success) {
    volumeList.value = res.data;
  }
};

onMounted(async () => {
  getDataList();
});

const onVolumeClick = (volume: Volume) => {
  actionVolume.value = volume;
  showAction.value = true;
};

const onAddVolumeConfirm = async () => {
  await addModalForm.value?.validate();
  showLoadingToast({ message: '创建中...', duration: 0, forbidClick: true });
  const res = await createVolume(volumeForm.value.name);
  if (res.success) {
    showSuccessToast('创建成功');
    showAddModal.value = false;
    getDataList();
  }
};

const onRemoveVolume = async () => {
  if (!actionVolume.value) {
    return;
  }
  showLoadingToast({ message: '删除中...', duration: 0, forbidClick: true });
  const res = await removeVolume(actionVolume.value.Name);
  if (res.success) {
    showSuccessToast('删除成功');
    showAction.value = false;
    actionVolume.value = null;
    getDataList();
  }
};
</script>
<style scoped lang="less">
.volume-list {
  flex: auto;
  height: 0;
  overflow-x: auto;
  margin-bottom: 72px;
}
.add-volume-btn-row {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 12px;
  background-color: #fff;
  box-sizing: border-box;
}
.add-modal-form {
  padding: 12px 6px;
}
</style>
