<template>
  <div class="btn-row">
    <div class="left"></div>
    <div class="right">
      <a-space>
        <a-button
          type="primary"
          :icon="h(PlusOutlined)"
          @click="showPullImageModal = true"
        >
          拉取镜像
        </a-button>
      </a-space>
    </div>
  </div>
  <PullImageModal
    v-model:open="showPullImageModal"
    @pulled="$emit('reload')"
  />
</template>
<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';
import { h, ref } from 'vue';

import PullImageModal from '@/components/desktop/PullImageModal.vue';

defineEmits(['reload']);

const showPullImageModal = ref(false);
</script>
<style scoped lang="less">
.btn-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
</style>
