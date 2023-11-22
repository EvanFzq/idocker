<template>
  <el-result
    title="4 0 4"
    sub-title="页面不存在！请检查页面地址"
    class="desktop-page-404"
  >
    <template #icon>
      <el-empty
        class="empty"
        description=" "
      />
    </template>
    <template #extra>
      <el-button
        type="primary"
        @click="router.back()"
      >
        回退
      </el-button>
    </template>
  </el-result>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
<style lang="less">
.desktop-page-404 {
  .el-empty__image svg {
    width: 100%;
    height: 100%;
  }
}
</style>
