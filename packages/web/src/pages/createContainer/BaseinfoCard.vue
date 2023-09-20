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
              <van-icon
                v-if="image.is_official"
                name="medal-o"
                class="icon"
              />
              <span>{{ image.name }}</span>
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
        v-model="form.network"
        required
        is-link
        readonly
        name="network"
        label="网络"
        placeholder="点击选择网络"
        :rules="[{ required: true, message: '请选择网络' }]"
        @click="showNetworkPicker = true"
      />
      <van-popup
        v-model:show="showNetworkPicker"
        position="bottom"
      >
        <van-picker
          :columns="networkList"
          :columns-field-names="{
            text: 'Name',
            value: 'Name',
          }"
          @confirm="onNetworkConfirm"
          @cancel="showNetworkPicker = false"
        />
      </van-popup>
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
        name="runAffterCreated"
        label="创建后启动"
      >
        <template #input>
          <div class="run-after-create">
            <van-switch v-model="form.runAffterCreated" />
          </div>
        </template>
      </van-field>
      <!-- 创建后启动 -->
    </van-cell-group>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { searchImage, getNetworkList } from '@/apis';
import type { Image } from '@common/types/image';
import { restartPolicyList } from '@common/constants/const';
import type { Network } from '@common/types/network';
import { numberFormat } from '@/utils/utils';

const emit = defineEmits(['networkChange']);

const form = ref({
  name: '',
  image: '',
  network: '',
  restart: '',
  runAffterCreated: false,
});
const showImagePopover = ref(false);
const showNetworkPicker = ref(false);
const showRestartPicker = ref(false);
const imageList = ref<Image[]>([]);
const networkList = ref<Network[]>([]);

onMounted(async () => {
  const res = await getNetworkList();
  if (res.success) {
    networkList.value = res.data;
  }
});

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
  }, 500);
};

const onSelectImage = (selectImage: Image) => {
  form.value.image = selectImage.name;
  showImagePopover.value = false;
};
const onNetworkConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  form.value.network = selectedValues[0];
  showNetworkPicker.value = false;
  emit('networkChange', selectedValues[0]);
};
const onRestartConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  form.value.restart = selectedValues[0];
  showRestartPicker.value = false;
};
</script>

<style scoped lang="less">
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
</style>
