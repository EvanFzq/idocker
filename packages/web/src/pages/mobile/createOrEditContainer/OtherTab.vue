<template>
  <van-cell-group
    inset
    style="margin-top: 16px"
  >
    <van-field
      v-model="form.restart"
      is-link
      readonly
      name="restart"
      label="重启策略"
      placeholder="点击选择重启策略"
      @click="showRestartPicker = true"
    />
    <van-popup
      v-model:show="showRestartPicker"
      position="bottom"
    >
      <van-picker
        :columns="restartPolicyList"
        @confirm="onRestartConfirm"
        @cancel="showRestartPicker = false"
      />
    </van-popup>
    <van-field
      v-model="form.localUrl"
      name="localUrl"
      placeholder="例：http://192.168.0.1:7880"
    >
      <template #label>
        <div>
          <span>内网地址</span>
          <van-popover placement="right">
            <p style="max-width: 60vw; padding: 0 12px; font-size: 10px">
              支持PROTOCOL、HOST、PORT参数。PROTOCOL、HOST为idocker访问页地址的protocol和host。PORT为绑定给容器的第一个host端口，可使用PORTx指定为第x个端口，例：[PROTOCOL]//[HOST]:[PORT2]
            </p>
            <template #reference>
              <van-icon name="question-o" />
            </template>
          </van-popover>
        </div>
      </template>
    </van-field>
    <van-field
      v-model="form.internetUrl"
      name="internetUrl"
      placeholder="例：https://xxx.xxx.com"
    >
      <template #label>
        <div>
          <span>外网地址</span>
          <van-popover placement="right">
            <p style="max-width: 60vw; padding: 0 12px; font-size: 10px">
              支持PROTOCOL、HOST、PORT参数。PROTOCOL、HOST为idocker访问页地址的protocol和host。PORT为绑定给容器的第一个host端口，可使用PORTx指定为第x个端口，例：[PROTOCOL]//[HOST]:[PORT]
            </p>
            <template #reference>
              <van-icon name="question-o" />
            </template>
          </van-popover>
        </div>
      </template>
    </van-field>
  </van-cell-group>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';

import { restartPolicyList } from '@common/constants/const';

import type { ContainerFormData } from './CreateOrEditContainerPage.vue';

const props = defineProps<{ formData: ContainerFormData }>();
const emit = defineEmits(['valueChange']);

const showRestartPicker = ref(false);
const form = ref({
  restart: 'no',
  localUrl: '',
  internetUrl: '',
});

watch(
  () => props.formData,
  () => {
    form.value = {
      restart: props.formData.restart,
      localUrl: props.formData.localUrl,
      internetUrl: props.formData.internetUrl,
    };
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

const onRestartConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  form.value.restart = selectedValues[0];
  showRestartPicker.value = false;
};
</script>
