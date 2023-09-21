<template>
  <van-nav-bar
    :title="title"
    left-text="返回"
    left-arrow
    class="title"
    @click-left="onClickLeft"
  />
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { NavBarProps } from 'vant';

defineProps<Partial<NavBarProps>>();

const router = useRouter();
const onClickLeft = () => {
  router.back();
};
</script>
