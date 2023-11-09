<template>
  <div>
    <TitleBar
      title="用户设置"
      style="margin-bottom: 12px"
      :right-text="isEdit ? '取消' : '编辑'"
      @click-right="onClickRight"
    />
    <van-cell-group
      v-if="!isEdit"
      inset
    >
      <van-cell
        title="用户名"
        :value="userInfo.userName"
      />
      <van-cell
        title="密码尝试次数"
        :value="userInfo.passwordMaxRetryNum"
      />
    </van-cell-group>
    <van-form
      v-if="isEdit"
      @submit="onSubmit"
    >
      <van-cell-group inset>
        <van-field
          v-model="userInfoForm.userName"
          name="userName"
          label="用户名"
          :readonly="!isEdit"
          :maxlength="32"
          show-word-limit
          placeholder="请填写用户名"
          :rules="[
            { required: true, message: '请填写用户名' },
            {
              message: '最长：32，最短：4',
              validator: (value: string) => value.length <= 32 && value.length >= 4,
            },
          ]"
        />
        <van-field
          v-model="userInfoForm.passwordMaxRetryNum"
          type="digit"
          name="passwordMaxRetryNum"
          label="密码尝试次数"
          :readonly="!isEdit"
          placeholder="请填写密码最大尝试次数"
          :rules="[
            { required: true, message: '请填写密码最大尝试次数' },
            {
              message: '最大：100，最小：1',
              validator: value => Number(value) <= 100 && Number(value) >= 0,
            },
          ]"
        />
      </van-cell-group>
      <div class="submit-btn van-safe-area-bottom">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
        >
          保存
        </van-button>
      </div>
    </van-form>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { showLoadingToast, showSuccessToast } from 'vant';
import { useToggle } from '@vant/use';

import type { UserInfo } from '@common/types/setting';

import TitleBar from '@/components/TitleBar.vue';
import { getUserInfo, updateUserInfo } from '@/apis/setting';

const [isEdit, toggleEdit] = useToggle();
const userInfo = ref<Partial<UserInfo>>({});
const userInfoForm = ref<Partial<UserInfo>>({});

onMounted(async () => {
  const res = await getUserInfo();
  if (res.success) {
    userInfo.value = res.data;
  }
});

const onClickRight = () => {
  if (!isEdit.value) {
    userInfoForm.value = {
      ...userInfo.value,
    };
  }
  toggleEdit();
};
const onSubmit = async (values: UserInfo) => {
  showLoadingToast({ message: '保存中...', duration: 0, forbidClick: true });
  const res = await updateUserInfo({
    ...values,
    passwordMaxRetryNum: Number(values.passwordMaxRetryNum),
  });
  if (res.success) {
    showSuccessToast('保存成功');
    userInfo.value = {
      ...userInfo.value,
      ...values,
      passwordMaxRetryNum: Number(values.passwordMaxRetryNum),
    };
    toggleEdit();
  }
};
</script>
<style scoped lang="less">
.submit-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  padding: 12px;
  box-sizing: border-box;
  background-color: #fff;
}
</style>
