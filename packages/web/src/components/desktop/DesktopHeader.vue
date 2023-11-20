<template>
  <div class="header">
    <div class="logo">iDocker</div>
    <div class="right-menu">
      <el-dropdown class="user">
        <span class="name">
          {{ userInfo.userName }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="onLogout">注销</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ArrowDown } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

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
  ElMessage({
    message: '注销成功！',
    type: 'success',
    onClose() {
      location.href = '/d/login';
    },
  });
};
</script>
<style lang="less" scoped>
.header {
  height: 100%;
  background: #409eff;
  overflow: hidden;
  padding: 16px;
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
  .user {
    .name {
      cursor: pointer;
      color: #fff;
      display: flex;
      align-items: center;
      outline: none !important;
    }
  }
  .logout {
    color: #fff;
  }
}
</style>
