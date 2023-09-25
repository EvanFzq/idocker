<template>
  <div class="page">
    <router-view v-slot="{ Component }">
      <keep-alive :include="['HomePage']">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup lang="ts"></script>
<style scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
