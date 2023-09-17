

<template>
    <div>
        <Container v-if="active === 'container'" />
        <Setting v-if="active === 'setting'" />
        <van-tabbar v-model="active">
            <van-tabbar-item name="container" icon="play-circle-o">容器</van-tabbar-item>
            <!-- <van-tabbar-item name="template" icon="records">模版</van-tabbar-item> -->
            <van-tabbar-item>
                <div class="center-add" @click="onAddNew">
                    <van-icon name="plus" />
                </div>
            </van-tabbar-item>
            <!-- <van-tabbar-item name="other" icon="apps-o">其他</van-tabbar-item> -->
            <van-tabbar-item name="setting" icon="setting-o">设置</van-tabbar-item>
        </van-tabbar>
    </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'

import Container from './Container.vue'
import Setting from './Setting.vue'
const active = ref('container');

const router = useRouter()

const onAddNew = () => {
    router.push('/container/new')
}
</script>
  
<style scoped>
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
  