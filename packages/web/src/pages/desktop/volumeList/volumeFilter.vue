<template>
  <div class="btn-row">
    <div class="left"></div>
    <div class="right">
      <a-space>
        <a-button
          type="primary"
          :icon="h(PlusOutlined)"
          @click="showCreateVolumeModal = true"
        >
          创建数据卷
        </a-button>
      </a-space>
    </div>
  </div>
  <CreateVolumeModal
    v-model:open="showCreateVolumeModal"
    @finish="$emit('reload')"
  />
</template>
<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';
import { h, ref } from 'vue';

import CreateVolumeModal from '@/components/desktop/CreateVolumeModal.vue';

defineEmits(['reload']);

const showCreateVolumeModal = ref(false);
</script>
<style scoped lang="less">
.btn-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
</style>
