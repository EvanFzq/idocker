<template>
  <div class="header">
    <div class="left">
      <div class="logo">iDocker</div>
      <div class="left-menu">
        <a
          href="https://www.runoob.com/docker/docker-tutorial.html"
          referrerpolicy="no-referrer"
          target="_blank"
        >
          Docker 教程
        </a>
        <a-divider
          type="vertical"
          style="height: 20px; background-color: #fff; border-width: 2px"
        />
        <a
          href="https://hub.docker.com/"
          referrerpolicy="no-referrer"
          target="_blank"
        >
          Docker Hub
        </a>
      </div>
    </div>
    <div class="right-menu">
      <a-dropdown>
        <div class="name">
          {{ userInfo.userName }}
          <DownOutlined style="margin-left: 4px" />
        </div>
        <template #overlay>
          <a-menu :selectable="false">
            <a-menu-item @click="onChangePassword">修改密码</a-menu-item>
            <a-menu-divider />
            <a-menu-item @click="onLogout"> 注销 </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    <a-modal
      v-model:open="showChangePassword"
      title="修改密码"
      @ok="onConfirmChangePassword"
    >
      <a-form
        ref="passwordForm"
        style="margin-top: 16px"
        :model="passwordFormData"
        :label-col="{ style: { width: '120px' } }"
      >
        <a-form-item
          name="currentPassword"
          label="当前密码"
          :rules="[{ required: true, message: '请输入当前密码' }]"
        >
          <a-input
            v-model:value="passwordFormData.currentPassword"
            placeholder="请输入当前密码"
          />
        </a-form-item>
        <a-form-item
          name="newPassword"
          label="新密码"
          :rules="[{ required: true, message: '请输入新密码' }]"
        >
          <a-input-password
            v-model:value="passwordFormData.newPassword"
            placeholder="请输入新密码"
          />
        </a-form-item>
        <a-form-item
          name="newPassword2"
          label="确认新密码"
          :rules="[
            { required: true, message: '请确认新密码' },
            {
              validator: validatorPassword,
              message: '密码不一致',
            },
          ]"
        >
          <a-input-password
            v-model:value="passwordFormData.newPassword2"
            placeholder="请确认新密码"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { DownOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import type { UserInfo } from '@common/types/setting';

import { getUserInfo } from '@/apis/setting';
import { changePassword } from '@/apis/auth';

import type { FormInstance } from 'ant-design-vue';

interface FormData {
  currentPassword: string;
  newPassword: string;
  newPassword2: string;
}

const userInfo = ref<Partial<UserInfo>>({});
const showChangePassword = ref(false);
const passwordForm = ref<FormInstance>();
const passwordFormData = ref<Partial<FormData>>({});

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

const onChangePassword = () => {
  showChangePassword.value = true;
  passwordFormData.value = {};
};

const validatorPassword = () => {
  if (passwordFormData.value.newPassword === passwordFormData.value.newPassword2) {
    return Promise.resolve();
  }
  return Promise.reject('密码不一致');
};

const onConfirmChangePassword = async () => {
  await passwordForm.value?.validate();
  const { currentPassword, newPassword } = passwordFormData.value as FormData;
  const res = await changePassword(currentPassword, newPassword);
  if (res.success) {
    showChangePassword.value = false;
    message.success({
      content: '修改成功！',
      onClose() {
        sessionStorage.removeItem('token');
        location.href = '/d/login';
      },
    });
  }
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
  .left {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .logo {
    color: #fff;
    margin: 0;
    font-size: 24px;
    font-weight: 700;
  }
  .left-menu {
    margin-left: 64px;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    a {
      color: #fff;
      padding: 4px 12px;
      &:hover {
        border-bottom: solid 2px #fff;
      }
    }
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
