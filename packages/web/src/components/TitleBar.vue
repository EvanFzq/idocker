<template>
  <van-nav-bar
    title="镜像列表"
    left-text="返回"
    left-arrow
    class="title"
    @click-left="onClickLeft"
  />
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
const onClickLeft = () => {
  router.back();
};
</script>
