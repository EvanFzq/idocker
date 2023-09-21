SettingTab
<template>
  <van-nav-bar title="设置" />
  <div class="setting">
    <van-cell-group
      title="个人信息"
      inset
      class="setting-list"
    >
      <van-cell
        title="修改密码"
        is-link
        @click="showChangePassword = true"
      />
    </van-cell-group>
    <van-cell-group
      title="管理"
      inset
      class="setting-list"
    >
      <van-cell
        title="镜像列表"
        is-link
        to="/image/list"
      />
      <van-cell
        title="网络列表"
        is-link
        to="/network/list"
      />
    </van-cell-group>
    <div class="btns">
      <van-button
        type="primary"
        round
        block
        @click="onLogout"
      >
        注销
      </van-button>
    </div>
  </div>
  <van-dialog
    :show="showChangePassword"
    title="修改密码"
    show-cancel-button
    @confirm="onChangePasswordSubmit"
    @cancel="showChangePassword = false"
  >
    <van-form
      ref="changePasswordForm"
      class="change-password-form"
    >
      <van-field
        v-model="currentPassword"
        colon
        name="currentPassword"
        label="当前密码"
        placeholder="请填写当前密码"
        :rules="[{ required: true, message: '请填写当前密码' }]"
      />
      <van-field
        v-model="newPassword"
        colon
        type="password"
        name="newPassword"
        label="新密码"
        placeholder="请填写新密码"
        :rules="[{ required: true, message: '请填写新密码' }]"
      />
      <van-field
        v-model="newPassword2"
        colon
        type="password"
        name="newPassword2"
        label="确认新密码"
        placeholder="请确认新密码"
        :rules="[
          { required: true, message: '请确认新密码' },
          { validator: validatorPassword, message: '密码不一致' },
        ]"
      />
    </van-form>
  </van-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'vant';
import { showSuccessToast } from 'vant';
import { ref } from 'vue';
import { changePassword } from '@/apis/user';

const onLogout = () => {
  sessionStorage.removeItem('token');
  showSuccessToast({
    message: '注销成功！',
    onClose() {
      location.href = '/login';
    },
  });
};

// 修改密码
const showChangePassword = ref(false);
const currentPassword = ref('');
const newPassword = ref('');
const newPassword2 = ref('');
const changePasswordForm = ref<FormInstance>();
const validatorPassword = () => {
  return newPassword.value === newPassword2.value;
};
const onChangePasswordSubmit = async () => {
  try {
    await changePasswordForm.value?.validate();
    const res = await changePassword(currentPassword.value, newPassword.value);
    if (res.success) {
      showSuccessToast({
        message: '修改成功！',
        onClose() {
          showChangePassword.value = false;
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<style lang="less" scoped>
.setting {
  position: relative;

  .setting-list {
    margin: 12px;
  }

  .btns {
    margin: 12px;
    margin-top: 36px;
  }
}

.change-password-form {
  margin: 12px 0;
}
</style>
