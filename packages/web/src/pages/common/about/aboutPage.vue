<template>
  <div class="about-page">
    <TitleBar />
    <div class="content">
      <a-image
        class="logo"
        src="/img/docker-500x374.png"
      />
      <a-typography-title style="color: #1989fa">iDocker</a-typography-title>
      <div class="row">
        <span>版本：</span>
        <span>{{ packageData.version }}</span>
      </div>
      <div class="row">
        <span>作者：</span>
        <span>Evan</span>
      </div>
      <div class="row">
        <span>QQ群：</span>
        <a-typography-paragraph :copyable="{ text: '930498439' }">930498439</a-typography-paragraph>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import TitleBar from '@/components/mobile/TitleBar.vue';

import packageData from '../../../../../../package.json';
</script>
<style scoped lang="less">
.about-page {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.content {
  flex: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #555;
}
.row {
  display: flex;
  margin-top: 12px;
}
</style>
<style lang="less">
.about-page {
  .logo {
    max-width: min(50vw, 300px);
    margin-bottom: 24px;
  }
}
</style>
