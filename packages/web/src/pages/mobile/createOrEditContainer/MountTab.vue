<template>
  <van-cell-group
    v-for="(mount, index) in mountList"
    :key="index"
    class="mount-card"
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
          <van-radio
            v-for="item in MountTypeList"
            :key="item.value"
            :name="item.value"
          >
            {{ item.label }}
          </van-radio>
        </van-radio-group>
      </template>
    </van-field>

    <van-field
      v-if="['bind', 'device'].includes(mount.type)"
      v-model="mount.hostBind"
      :name="'mounts[' + index + '].hostBind'"
      label="主机(设备)路径"
      placeholder="请输入主机(设备)路径"
      required
      :rules="[{ required: true, message: '请输入主机(设备)路径' }]"
    />
    <van-field
      v-if="mount.type === 'volume'"
      v-model="mount.volume"
      required
      is-link
      readonly
      :name="'mounts[' + index + '].volume'"
      label="数据卷"
      placeholder="点击选择数据卷"
      :rules="[{ required: true, message: '请选择数据卷' }]"
      @click="onSelectVolume(index)"
    />

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
  <van-popup
    v-model:show="showVolumePicker"
    position="bottom"
  >
    <van-picker
      :columns="volumeList"
      @confirm="onVolumeConfirm"
      @cancel="showVolumePicker = false"
    />
  </van-popup>
  <div class="add-mount">
    <van-button
      size="small"
      class="add-mount-btn"
      @click="onAddMount"
    >
      新增挂载配置
    </van-button>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

import type { MountConfig } from '@common/types/container';
import { MountTypeList } from '@common/constants/enum';

import { getVolumeList } from '@/apis/volume';

import type { ContainerFormData } from './type';

const props = defineProps<{ formData: ContainerFormData }>();

interface PickerValue {
  selectedValues: string[];
}

const mountList = ref<MountConfig[]>(props.formData.mounts || []);
const volumeList = ref<{ text: string; value: string }[]>([]);
const showVolumePicker = ref(false);
const seletcVolumeIndex = ref(0);

const emit = defineEmits(['valueChange']);

watch(
  () => props.formData.mounts,
  () => {
    mountList.value = props.formData.mounts;
  },
  { deep: true },
);
watch(
  mountList,
  () => {
    emit('valueChange', { mounts: mountList.value });
  },
  { deep: true },
);

onMounted(async () => {
  const res = await getVolumeList();
  if (res.success) {
    volumeList.value = res.data.map(item => ({ text: item.Name, value: item.Name }));
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
const onSelectVolume = (index: number) => {
  showVolumePicker.value = true;
  seletcVolumeIndex.value = index;
};
const onVolumeConfirm = ({ selectedValues }: PickerValue) => {
  mountList.value[seletcVolumeIndex.value].volume = selectedValues[0];
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
