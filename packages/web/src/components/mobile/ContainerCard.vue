<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    class="box"
    @click="onCardClick"
  >
    <div
      v-if="icon"
      class="left"
    >
      <van-image
        v-if="getIcon(icon).type === 'url'"
        width="80"
        height="80"
        fit="contain"
        :src="getIcon(icon).content"
      >
        <template #error>
          {{
            name
              .split(/[\s-_]/)
              .shift()
              ?.slice(0, 8)
          }}
        </template>
      </van-image>
      <div
        v-if="icon && getIcon(icon).type === 'svg'"
        class="icon-svg"
        v-html="getIcon(icon).content"
      />
    </div>
    <div
      v-else
      class="left"
    >
      {{
        name
          .split(/[\s-_]/)
          .shift()
          ?.slice(0, 8)
      }}
    </div>
    <div class="right">
      <div class="top">
        <van-icon
          v-if="canUpdate"
          name="upgrade"
          color="red"
          class="upgrade"
          @click="onUpdateImage"
        />
        <div class="van-ellipsis name">
          {{ name }}
        </div>

        <van-tag
          class="status"
          :color="statusColor"
        >
          {{ statusLabel }}
        </van-tag>
      </div>
      <div class="middle">
        <div class="van-ellipsis image">
          {{ image }}
        </div>
        <div class="startedAt">
          <van-icon
            name="clock-o"
            style="margin-right: 4px"
          />{{ timeLongFormat(startedAt) }}
        </div>
      </div>
      <div class="middle">
        <div class="van-ellipsis cpu"> cpu: {{ cpu?.toFixed(1) || 0 }}% </div>
        <div class="mem">
          内存: {{ fileSizeFormat(memoryUsage || 0) || '-' }}/{{
            fileSizeFormat(memoryLimit || 0) || '-'
          }}
        </div>
      </div>
      <div class="bottom">
        <van-button
          v-if="isExited || isCreated"
          :disabled="isSelf"
          :color="ContainerButtonColor.running"
          square
          plain
          size="mini"
          @click="(e: MouseEvent) => onActive(e, ContainerActive.start)"
        >
          启动
        </van-button>
        <van-button
          v-if="isRunning || isRestarting"
          :disabled="isSelf"
          :color="ContainerButtonColor.exited"
          square
          plain
          size="mini"
          @click="(e: MouseEvent) => onActive(e, ContainerActive.stop)"
        >
          停止
        </van-button>
        <van-button
          v-if="!isRestarting"
          :disabled="isSelf"
          :color="ContainerButtonColor.restart"
          square
          plain
          size="mini"
          @click="(e: MouseEvent) => onActive(e, ContainerActive.restart)"
        >
          重启
        </van-button>
        <van-button
          v-if="isRunning"
          :disabled="isSelf"
          :color="ContainerButtonColor.paused"
          square
          plain
          size="mini"
          @click="(e: MouseEvent) => onActive(e, ContainerActive.pause)"
        >
          暂停
        </van-button>
        <van-button
          v-if="isPaused"
          :disabled="isSelf"
          :color="ContainerButtonColor.running"
          square
          plain
          size="mini"
          @click="(e: MouseEvent) => onActive(e, ContainerActive.unpause)"
        >
          恢复
        </van-button>
        <van-button
          :disabled="isSelf"
          :color="ContainerButtonColor.delete"
          square
          plain
          size="mini"
          @click="(e: MouseEvent) => onActive(e, ContainerActive.remove)"
        >
          删除
        </van-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { showSuccessToast, showConfirmDialog, showLoadingToast } from 'vant';

import {
  ContainerActive,
  ContainerButtonColor,
  ContainerStatusColor,
  ContainerStatusName,
} from '@common/constants/enum';
import { getIcon } from '@common/utils/utils';

import { fileSizeFormat, timeLongFormat } from '@/utils/utils';
import { activeContainer, updateContainerImage } from '@/apis/container';

const router = useRouter();

interface CcontainerCardProps {
  name: string;
  icon?: string;
  image?: string;
  id: string;
  startedAt: number;
  status: string;
  labels?: Record<string, string>;
  cpu?: number;
  memoryLimit?: number;
  memoryUsage?: number;
  isSelf?: boolean;
  canUpdate?: boolean;
}

const props = defineProps<CcontainerCardProps>();

const emit = defineEmits(['reload']);

const statusLabel = computed(() => ContainerStatusName[props.status]);
const statusColor = computed(() => ContainerStatusColor[props.status]);

const isRunning = computed(() => props.status === 'running');
const isPaused = computed(() => props.status === 'paused');
const isExited = computed(() => props.status === 'exited');
const isCreated = computed(() => props.status === 'created');
const isRestarting = computed(() => props.status === 'restarting');

const onActive = async (e: MouseEvent, type: ContainerActive) => {
  e.stopPropagation();
  try {
    if (type === ContainerActive.remove) {
      await showConfirmDialog({
        title: '确认删除吗？',
        message: '容器将从机器上移除，（镜像、配置文件不会丢失）',
      });
    }
    showLoadingToast({ message: '执行中...', duration: 0, forbidClick: true });
    const res = await activeContainer(props.id, type);

    if (res.success) {
      emit('reload');
      showSuccessToast('操作成功');
    }
  } catch (error) {
    console.error(error);
  }
};

const onCardClick = () => {
  router.push('/m/container/' + props.id);
};

const onUpdateImage = async (e: MouseEvent) => {
  e.stopPropagation();
  await showConfirmDialog({
    title: '确认更新容器镜像吗？',
    message: '可能存在不兼容情况，请关注容器更新日志',
  });
  showLoadingToast({ message: '执行中...', duration: 0, forbidClick: true });
  const res = await updateContainerImage(props.id);
  if (res.success) {
    emit('reload');
    showSuccessToast('更新成功');
  }
};
</script>
<style scoped>
.box {
  width: 100%;
  display: flex;
  flex-direction: row;
  background-color: #fff;
  margin: 8px;
  padding: 8px;
  border-radius: 4px;
}
@media screen and (min-width: 640px) {
  .box {
    width: calc(50% - 32px);
  }
}

@media screen and (min-width: 960px) {
  .box {
    width: calc(33% - 32px);
  }
}
@media screen and (min-width: 1280px) {
  .box {
    width: calc(25% - 32px);
  }
}

.left {
  flex: none;
  width: 80px;
  height: 80px;
  margin-top: 4px;
  color: #1989fa;
  margin-right: 12px;
  border-radius: 4px;
  overflow: hidden;
  border: solid 1px #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  line-height: 16px;
  vertical-align: middle;
  background-color: #fff;
}
.icon-svg {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.right {
  flex: auto;
  text-align: left;
}

.top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}
.upgrade {
  margin-right: 4px;
  font-weight: 500;
  line-height: 19px;
}
.name {
  flex: auto;
  width: 0;
}

.status {
  flex: none;
  margin-left: 12px;
}

.status.running {
  background-color: rgb(33, 228, 33);
}

.middle {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 6px;
  align-items: center;
}

.image {
  flex: auto;
  width: 0;
}

.startedAt {
  flex: none;
  margin-left: 12px;
}

.bottom {
  display: flex;
}

.bottom button {
  max-width: 25%;
  flex: auto;
}
</style>
