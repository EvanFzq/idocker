<template>
  <a-result
    status="404"
    title="404"
    sub-title="页面不存在！请检查页面地址"
    class="desktop-page-404"
  >
    <template #extra>
      <a-button
        type="primary"
        @click="router.push('/d/container')"
      >
        回到首页
      </a-button>
    </template>
  </a-result>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
