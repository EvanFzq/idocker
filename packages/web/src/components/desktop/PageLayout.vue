<template>
  <div class="page">
    <div class="top">
      <div class="left">
        <el-breadcrumb
          v-if="breadcrumbs"
          :separator-icon="ArrowRight"
        >
          <el-breadcrumb-item
            v-for="(breadcrumb, i) in breadcrumbs"
            :key="i"
            :to="breadcrumb.to"
            :replace="breadcrumb.replace"
          >
            {{ breadcrumb.lable }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <div
          v-else
          class="title"
        >
          {{ title }}
        </div>
      </div>

      <div class="right-btns">
        <slot name="right" />
      </div>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue';

import type { RouteLocationRaw } from 'vue-router';

export interface Breadcrumb {
  to?: string | RouteLocationRaw;
  replace?: boolean;
  lable: string;
}

defineProps<{
  breadcrumbs?: Breadcrumb[];
  title?: string;
}>();
</script>
<style scoped lang="less">
.page {
  height: 100%;
  display: flex;
  flex-direction: column;
  .top {
    flex: none;
    height: 48px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 1px 1px 5px #ccc;
    .title {
      font-weight: 700;
      font-size: 20px;
      color: #409eff;
    }
  }
  .content {
    flex: auto;
    overflow: auto;
    height: 0;
    padding-left: 16px;
  }
}
</style>
