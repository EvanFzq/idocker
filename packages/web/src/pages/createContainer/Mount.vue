<template>
  <van-cell-group
    class="mount-card"
    v-for="(mount, index) in mountList"
    inset
    style="margin-top: 16px"
  >
    <van-field
      :name="'mounts[' + index + '].type'"
      label="类型"
    >
      <template #input>
        <van-radio-group
          v-model="mount.type"
          direction="horizontal"
        >
          <van-radio name="bind">路径</van-radio>
          <van-radio name="volume">卷</van-radio>
        </van-radio-group>
      </template>
    </van-field>

    <van-field
      v-if="mount.type === 'bind'"
      v-model="mount.hostBind"
      :name="'mounts[' + index + '].hostBind'"
      label="主机路径"
      placeholder="请输入主机路径"
      required
      :rules="[{ required: true, message: '请输入主机路径' }]"
    />
    <van-field
      v-if="mount.type === 'volume'"
      required
      v-model="mount.volume"
      is-link
      readonly
      :name="'mounts[' + index + '].volume'"
      label="卷"
      placeholder="点击选择卷"
      @click="showVolumePicker = true"
      :rules="[{ required: true, message: '请选择卷' }]"
    />
    <van-popup
      v-model:show="showVolumePicker"
      position="bottom"
    >
      <van-picker
        :columns="volumeList"
        @confirm="value => onVolumeConfirm(index, value)"
        @cancel="showVolumePicker = false"
      />
    </van-popup>
    <van-field
      v-model="mount.container"
      :name="'mounts[' + index + '].container'"
      label="容器路径"
      placeholder="请输入容器路径"
      required
      :rules="[{ required: true, message: '请填写容器路径' }]"
    />
    <van-field
      :name="'mounts[' + index + '].readonly'"
      label="只读"
    >
      <template #input>
        <div class="readonly">
          <van-switch v-model="mount.readonly" />
        </div>
      </template>
    </van-field>
    <van-button
      icon="delete-o"
      size="small"
      round
      type="danger"
      class="delete-icon"
      @click="() => onDeleteMount(index)"
    />
  </van-cell-group>
  <div class="add-mount">
    <van-button
      size="small"
      class="add-mount-btn"
      @click="onAddMount"
      >新增挂载配置</van-button
    >
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { MountConfig } from '@common/types/container';
import { getVolumeList } from '@/apis/volume';

const mountList = ref<MountConfig[]>([]);
const volumeList = ref<{ text: string; value: string }[]>([]);
const showVolumePicker = ref(false);

onMounted(async () => {
  const res = await getVolumeList();
  if (res.success) {
    volumeList.value = res.data.Volumes.map(item => ({ text: item.Name, value: item.Name }));
  }
});

const onAddMount = () => {
  mountList.value = [
    ...mountList.value,
    {
      type: 'bind',
      hostBind: '',
      volume: '',
      container: '',
      readonly: false,
    },
  ];
};
const onDeleteMount = (index: number) => {
  mountList.value.splice(index, 1);
};

const onVolumeConfirm = (index: number, { selectedValues }: { selectedValues: string[] }) => {
  mountList.value[index].volume = selectedValues[0];
  showVolumePicker.value = false;
};
</script>
<style scoped lang="less">
.add-mount {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  margin-bottom: 32px;
  box-sizing: border-box;
  .add-mount-btn {
    width: 80%;
  }
}
.mount-card {
  position: relative;
  .delete-icon {
    position: absolute;
    right: 6px;
    top: 6px;
  }
}
.readonly {
  text-align: right;
  height: 30px;
  flex: auto;
}
</style>
