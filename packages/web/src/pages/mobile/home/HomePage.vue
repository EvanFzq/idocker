<template>
  <div class="home-page">
    <NavTab v-if="active === 'nav'" />
    <ContainerTab v-if="active === 'container'" />
    <SettingTab v-if="active === 'setting'" />
    <AboutTab v-if="active === 'about'" />
    <van-tabbar
      :model-value="active"
      @change="onTabChange"
    >
      <van-tabbar-item
        name="nav"
        icon="apps-o"
      >
        导航
      </van-tabbar-item>
      <van-tabbar-item
        name="container"
        icon="play-circle-o"
      >
        容器
      </van-tabbar-item>
      <van-tabbar-item name="add">
        <div
          class="center-add"
          @click="onAddNew"
        >
          <van-icon name="plus" />
        </div>
      </van-tabbar-item>
      <van-tabbar-item
        name="setting"
        icon="setting-o"
      >
        设置
      </van-tabbar-item>
      <van-tabbar-item
        name="about"
        icon="award-o"
      >
        关于
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import ContainerTab from './ContainerTab.vue';
import SettingTab from './SettingTab.vue';
import NavTab from './NavTab.vue';
import AboutTab from './AboutTab.vue';
const active = ref('nav');

const router = useRouter();

const onTabChange = (value: string) => {
  if (value !== 'add') {
    active.value = value;
  }
};

const onAddNew = () => {
  router.push('/m/container');
};
</script>

<style scoped>
.home-page {
  height: 100%;
}
.center-add {
  position: absolute;
  top: -20px;
  left: 50%;
  margin-left: -25px;
  box-sizing: border-box;
  background-color: #fff;
  z-index: 999;
  border: solid 2px #1989fa;
  color: #1989fa;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
