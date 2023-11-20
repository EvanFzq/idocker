<template>
  <van-nav-bar title="登录" />
  <van-form
    class="form"
    @submit="onSubmit"
  >
    <van-cell-group inset>
      <van-field
        v-model="username"
        name="username"
        label="用户名"
        placeholder="用户名"
        autofocus
        :rules="[{ required: true, message: '请填写用户名' }]"
        autocomplete="off"
      />
      <van-field
        v-model="password"
        type="password"
        name="password"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
        autocomplete="off"
      />
    </van-cell-group>
    <div style="margin: 16px">
      <van-button
        round
        block
        type="primary"
        native-type="submit"
      >
        提交
      </van-button>
    </div>
  </van-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { login } from '@/apis/auth';

const username = ref('');
const password = ref('');
const onSubmit = async (values: { username: string; password: string }) => {
  const { username, password } = values;
  const res = await login(username, password);
  if (res.success) {
    sessionStorage.setItem('token', res.data.token);
    history.back();
  }
};
</script>

<style scoped>
.form {
  margin-top: 32px;
}
</style>
@/apis/auth
