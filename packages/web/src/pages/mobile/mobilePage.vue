<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="['HomePage']">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
<script setup lang="ts"></script>
