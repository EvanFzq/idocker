<template>
  <div class="notice-page">
    <TitleBar
      title="通知设置"
      style="margin-bottom: 12px"
      :right-text="isEdit ? '取消' : '编辑'"
      @click-right="onClickRight"
    />
    <van-cell-group
      v-if="!isEdit && noticeInfo"
      title="邮箱配置"
      inset
    >
      <van-cell
        title="邮箱类型"
        :value="noticeInfo.email?.type"
      />
      <van-cell
        title="邮箱账户"
        :value="noticeInfo.email?.account"
      />
      <van-cell
        title="邮箱密码"
        :value="new Array(noticeInfo.email?.password?.length || 0).fill('*').join('')"
      />
    </van-cell-group>
    <van-cell-group
      v-if="!isEdit && noticeInfo"
      title="事件通知配置"
      inset
    >
      <van-cell
        v-for="item in eventTypeList"
        :key="item.key"
        :title="item.name"
        :value="noticeInfo.events?.[item.key]?.map(item => EventActionName[item]).join(',') || '无'"
      />
    </van-cell-group>
    <van-form
      v-if="isEdit"
      class="form-list"
      @submit="onSubmit"
    >
      <van-cell-group
        title="邮箱配置"
        inset
      >
        <van-field
          v-model="noticeInfoForm.email.type"
          is-link
          readonly
          name="email.type"
          label="邮箱类型"
          placeholder="请选择邮箱类型"
          :rules="[{ required: true, message: '请选择邮箱类型' }]"
          @click="showEmailTypePicker = true"
        />
        <van-popup
          v-model:show="showEmailTypePicker"
          position="bottom"
        >
          <van-picker
            :columns="EmailTypeList"
            @confirm="onEmailTypeConfirm"
            @cancel="showEmailTypePicker = false"
          />
        </van-popup>
        <van-field
          v-model="noticeInfoForm.email.account"
          type="email"
          name="email.account"
          label="邮箱账号"
          placeholder="请填写邮箱账号"
          :rules="[{ required: true, message: '请填写邮箱账号' }]"
        />
        <van-field
          v-model="noticeInfoForm.email.password"
          type="password"
          name="email.password"
          :label="noticeInfoForm.email.type !== EmailType.Outlook ? '授权码' : '邮箱密码'"
          :placeholder="
            noticeInfoForm.email.type !== EmailType.Outlook ? '请填写授权码' : '请填写邮箱密码'
          "
          :rules="[
            {
              required: true,
              message:
                noticeInfoForm.email.type !== EmailType.Outlook ? '请填写授权码' : '请填写邮箱密码',
            },
          ]"
        />
      </van-cell-group>
      <van-cell-group
        title="事件通知配置"
        inset
      >
        <van-field
          v-for="eventType in eventTypeList"
          :key="eventType.key"
          :name="'events.' + eventType.key"
          :label="eventType.name"
        >
          <template #input>
            <van-checkbox-group
              v-model="noticeInfoForm.events[eventType.key]"
              direction="horizontal"
            >
              <van-checkbox
                v-for="action in EventTypeActions[eventType.key]"
                :key="action"
                :name="action"
                shape="square"
                class="action-item"
              >
                {{ EventActionName[action] }}
              </van-checkbox>
            </van-checkbox-group>
          </template>
        </van-field>
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
import set from 'lodash-es/set';

import type { NoticeInfo } from '@common/types/setting';
import {
  EmailType,
  EmailTypeList,
  EventTypeName,
  EventActionName,
  EventTypeActions,
} from '@common/constants/enum';

import TitleBar from '@/components/mobile/TitleBar.vue';
import { getNoticeInfo, updateNoticeInfo } from '@/apis/setting';

const [isEdit, toggleEdit] = useToggle();
const noticeInfo = ref<NoticeInfo | null>(null);
const noticeInfoForm = ref({
  email: {
    type: undefined as EmailType | undefined,
    account: '',
    password: '',
  },
  events: {
    container: [],
    image: [],
    volume: [],
    network: [],
    daemon: [],
  } as Record<string, string[]>,
});
const showEmailTypePicker = ref(false);

const eventTypeList = Object.entries(EventTypeName).map(([key, value]) => ({ key, name: value }));

onMounted(async () => {
  const res = await getNoticeInfo();
  if (res.success) {
    noticeInfo.value = res.data;
  }
});

const onClickRight = () => {
  if (!noticeInfo.value) return;
  if (!isEdit.value) {
    noticeInfoForm.value = {
      email: {
        type: noticeInfo.value.email?.type,
        account: noticeInfo.value.email?.account || '',
        password: noticeInfo.value.email?.password || '',
      },
      events: {
        container: noticeInfo.value.events?.container || [],
        image: noticeInfo.value.events?.image || [],
        volume: noticeInfo.value.events?.volume || [],
        network: noticeInfo.value.events?.network || [],
        daemon: noticeInfo.value.events?.daemon || [],
      },
    };
  }
  toggleEdit();
};

const onEmailTypeConfirm = ({ selectedValues }: { selectedValues: EmailType[] }) => {
  noticeInfoForm.value.email.type = selectedValues[0];
  showEmailTypePicker.value = false;
};

const onSubmit = async (values: NoticeInfo) => {
  showLoadingToast({ message: '保存中...', duration: 0, forbidClick: true });
  const params: NoticeInfo = {} as NoticeInfo;
  Object.entries(values).forEach(([key, value]: [string, string | number | boolean]) => {
    set(params, key, value);
  });
  const res = await updateNoticeInfo(params);
  if (res.success) {
    showSuccessToast('保存成功');
    noticeInfo.value = {
      ...noticeInfo.value,
      ...params,
    };
    toggleEdit();
  }
};
</script>
<style scoped lang="less">
.notice-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 80px;
}
.form-list {
  flex: auto;
  height: 0;
  overflow: auto;
}
.submit-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  padding: 12px;
  box-sizing: border-box;
  background-color: #fff;
}
.action-item {
  margin: 4px 6px;
}
</style>
