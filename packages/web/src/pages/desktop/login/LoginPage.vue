<template>
  <div class="desktop-login-page">
    <div class="login-box">
      <div class="logo">iDocker</div>
      <div class="title">登录</div>
      <a-form
        ref="formRef"
        :model="form"
        label-width="60px"
        class="login-form"
        hide-required-mark
      >
        <a-form-item
          label="账户"
          name="username"
          :rules="[{ required: true, message: '请输入' }]"
        >
          <a-input v-model:value="form.username" />
        </a-form-item>
        <a-form-item
          label="密码"
          name="password"
          :rules="[{ required: true, message: '请输入' }]"
        >
          <a-input-password
            v-model:value="form.password"
            autocomplete="new-password"
          />
        </a-form-item>
        <a-button
          shape="round"
          type="primary"
          size="large"
          class="login-btn"
          html-type="submit"
          :disabled="!form.password.trim() || !form.username.trim()"
          @click="onSubmit"
        >
          登录
        </a-button>
      </a-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

import { login } from '@/apis/auth';

import type { FormInstance } from 'ant-design-vue';

const form = ref({
  username: '',
  password: '',
});

const formRef = ref<FormInstance>();

const onSubmit = async () => {
  await formRef.value?.validate();
  const { username, password } = form.value;
  const res = await login(username, password);
  if (res.success) {
    sessionStorage.setItem('token', res.data.token);
    history.back();
  }
};
</script>

<style scoped lang="less">
.desktop-login-page {
  height: 100%;
  background-size: cover;
  background-position: center;
  background-image: url('/img/bg.jpg');
  .login-box {
    background-color: #fff;
    width: 300px;
    border-radius: 16px;
    position: fixed;
    right: 15vw;
    top: 50vh;
    margin-top: -160px;
    padding: 32px;
    .logo {
      font-size: 24px;
      color: #409eff;
      font-weight: 500;
      padding: 16px 0;
    }
    .title {
      font-size: 18px;
      font-weight: 500;
    }
  }
  .login-form {
    margin-top: 16px;
    label {
      font-weight: 500;
    }
  }
  .login-btn {
    margin-top: 16px;
    width: 100%;
  }
}
</style>
<style lang="less">
.desktop-login-page {
  .login-form {
    label {
      color: #333;
      font-weight: 500;
    }
  }
}
</style>
