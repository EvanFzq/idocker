<template>
  <a-modal
    :open="open"
    title="拉取镜像"
    ok-text="拉取"
    cancel-text="取消"
    destroy-on-close
    :confirm-loading="loading"
    :mask-closable="false"
    @cancel="$emit('update:open', false)"
    @ok="onPullImage"
  >
    <a-form
      ref="formRef"
      class="pull-image-form"
      :model="formData"
      :label-col="{ style: { width: '60px' } }"
    >
      <a-row>
        <a-col :span="16">
          <a-form-item
            label="镜像"
            name="image"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <a-select
              v-model:value="formData.image"
              style="width: 100%"
              show-search
              placeholder="请输入镜像名并选择"
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
        <a-col :span="8">
          <a-form-item
            name="tag"
            :rules="[{ required: true, message: '请输入Tag' }]"
          >
            <a-input
              v-model:value="formData.tag"
              style="width: 100%"
              placeholder="请输入Tag"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { FireFilled, StarFilled } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import type { Image } from '@common/types/image';

import { numberFormat } from '@/utils/utils';
import { searchImage, pullImage } from '@/apis/image';

import type { FormInstance } from 'ant-design-vue';

const props = defineProps<{ open: boolean }>();
const emits = defineEmits(['update:open', 'finish']);
const formRef = ref<FormInstance>();
const formData = ref({
  image: null as string | null,
  tag: '',
});
const imageList = ref<Image[]>([]);
const loading = ref(false);

watch(props, () => {
  if (!props.open) {
    imageList.value = [];
    formData.value = {
      image: null as string | null,
      tag: '',
    };
  }
});

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
  formData.value.tag = 'latest';
};

const onPullImage = async () => {
  loading.value = true;
  await formRef.value?.validate();
  const { image, tag } = formData.value;
  const res = await pullImage(image + ':' + tag);
  if (res.success) {
    message.success('拉取成功');
    emits('update:open', false);
    emits('finish');
  }
  loading.value = false;
};
</script>
<style scoped lang="less">
.pull-image-form {
  margin: 16px 12px 0;
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
