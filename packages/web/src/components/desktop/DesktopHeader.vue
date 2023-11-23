<template>
  <div class="header">
    <div class="logo">iDocker</div>
    <div class="right-menu">
      <a-dropdown>
        <div class="name">
          {{ userInfo.userName }}
          <DownOutlined style="margin-left: 4px" />
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="onLogout"> 注销 </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { DownOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import type { UserInfo } from '@common/types/setting';

import { getUserInfo } from '@/apis/setting';

const userInfo = ref<Partial<UserInfo>>({});

onMounted(async () => {
  const res = await getUserInfo();
  if (res.success) {
    userInfo.value = res.data;
  }
});

const onLogout = () => {
  sessionStorage.removeItem('token');
  message.success({
    content: '注销成功！',
    onClose() {
      location.href = '/d/login';
    },
  });
};
</script>
<style lang="less" scoped>
.header {
  height: 100%;
  overflow: hidden;
  padding: 16px 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .logo {
    color: #fff;
    margin: 0;
    font-size: 24px;
    font-weight: 700;
  }

  .name {
    cursor: pointer;
    color: #fff;
    display: flex;
    font-size: 18px;
    height: 24px;
    align-items: center;
    outline: none !important;
  }

  .logout {
    color: #fff;
  }
}
</style>
