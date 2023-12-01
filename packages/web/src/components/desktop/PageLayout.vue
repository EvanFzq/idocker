<template>
  <div class="page">
    <div class="top">
      <div class="left">
        <a-breadcrumb
          :routes="breadcrumbs"
          class="breadcrumb"
        >
          <template #itemRender="{ route }">
            <span v-if="!route.path">{{ route.breadcrumbName }}</span>
            <router-link
              v-else
              :to="route.path"
            >
              {{ route.breadcrumbName }}
            </router-link>
          </template>
        </a-breadcrumb>
        <div
          v-if="title"
          class="title"
        >
          {{ title }}
        </div>
      </div>
      <div>
        <slot name="extra" />
      </div>
    </div>
    <div
      class="content"
      :style="contentStyle"
    >
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { CSSProperties } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

export interface Route {
  path?: string | RouteLocationRaw;
  breadcrumbName: string;
}

defineProps<{
  breadcrumbs?: Route[];
  title?: string;
  contentStyle?: CSSProperties;
}>();
</script>
<style scoped lang="less">
.page {
  height: 100%;
  display: flex;
  flex-direction: column;
  .top {
    flex: none;
    padding: 0 16px;
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0px 5px 5px #ccc;
    border-bottom: solid 1px #ccc;
    background-color: #fff;
    .breadcrumb {
      flex: none;
      padding: 6px 0;
    }
    .title {
      font-weight: 700;
      font-size: 24px;
      color: #409eff;
      height: 36px;
      margin-bottom: 6px;
      flex: none;
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
