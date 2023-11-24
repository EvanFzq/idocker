<template>
  <div class="btn-row">
    <div class="left"></div>
    <div class="right">
      <a-space>
        <a-button
          type="primary"
          :icon="h(PlusOutlined)"
          @click="showCreateNetworkModal = true"
        >
          创建网络
        </a-button>
      </a-space>
    </div>
  </div>
  <CreateNetworkModal
    v-model:open="showCreateNetworkModal"
    @created="$emit('reload')"
  />
</template>
<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';
import { h, ref } from 'vue';

import CreateNetworkModal from '@/components/desktop/CreateNetworkModal.vue';

defineEmits(['reload']);

const showCreateNetworkModal = ref(false);
</script>
<style scoped lang="less">
.btn-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
</style>
