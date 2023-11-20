<template>
  <div class="aside">
    <div class="menu-list">
      <el-menu
        default-active="/d/container"
        :collapse="!isOpen"
        style="border: none"
        @select="onMenuSelect"
      >
        <el-menu-item index="/d/container">
          <el-icon><VideoPlay /></el-icon>
          <span>容器</span>
        </el-menu-item>
        <el-menu-item index="/d/image">
          <el-icon><Coin /></el-icon>
          <template #title>镜像</template>
        </el-menu-item>
        <el-menu-item index="/d/network">
          <el-icon><Connection /></el-icon>
          <template #title>网络</template>
        </el-menu-item>
        <el-menu-item index="/d/vol">
          <el-icon><Document /></el-icon>
          <template #title>数据</template>
        </el-menu-item>
      </el-menu>
    </div>
    <el-button
      class="collapse-btn"
      type="primary"
      @click="onCollapse"
    >
      <el-icon v-if="isOpen"><ArrowLeftBold /></el-icon>
      <el-icon v-if="!isOpen"><ArrowRightBold /></el-icon>
    </el-button>
  </div>
</template>
<script setup lang="ts">
import { ElMenu, ElMenuItem } from 'element-plus';
import { useRouter } from 'vue-router';
import {
  Connection,
  Coin,
  VideoPlay,
  Document,
  ArrowLeftBold,
  ArrowRightBold,
} from '@element-plus/icons-vue';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['change']);
const router = useRouter();

const onCollapse = () => {
  emit('change', !props.isOpen);
};
const onMenuSelect = (key: string) => {
  router.push(key);
};
</script>
<style scoped lang="less">
.aside {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .menu-list {
    flex: auto;
    overflow: auto;
    border-right: solid 1px #e5e5e5;
    background-color: #fff;
  }
  .collapse-btn {
    flex: none;
    border-radius: 0;
  }
}
</style>
