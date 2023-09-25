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
        width="80"
        height="80"
        fit="contain"
        :src="icon"
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
          :disabled="disabled"
          :color="buttonColorMap.running"
          square
          plain
          size="mini"
          @click="(e: MouseEvent) => onActive(e, ContainerActive.start)"
        >
          启动
        </van-button>
        <van-button
          v-if="isRunning"
          :disabled="disabled"
          :color="buttonColorMap.exited"
          square
          plain
          size="mini"
          @click="(e: MouseEvent) => onActive(e, ContainerActive.stop)"
        >
          停止
        </van-button>
        <van-button
          v-if="!isRestarting"
          :disabled="disabled"
          :color="buttonColorMap.restart"
          square
          plain
          size="mini"
          @click="(e: MouseEvent) => onActive(e, ContainerActive.restart)"
        >
          重启
        </van-button>
        <van-button
          v-if="isRunning"
          :disabled="disabled"
          :color="buttonColorMap.paused"
          square
          plain
          size="mini"
          @click="(e: MouseEvent) => onActive(e, ContainerActive.pause)"
        >
          暂停
        </van-button>
        <van-button
          v-if="isPaused"
          :disabled="disabled"
          :color="buttonColorMap.running"
          square
          plain
          size="mini"
          @click="(e: MouseEvent) => onActive(e, ContainerActive.unpause)"
        >
          恢复
        </van-button>
        <van-button
          :disabled="disabled"
          :color="buttonColorMap.delete"
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

import { fileSizeFormat, timeLongFormat } from '@/utils/utils';
import { activeContainer } from '@/apis/container';
import { ContainerActive } from '@common/constants/enum';
import { buttonColorMap, statusColorMap, statusLabelMap } from '@/constants/container';

const router = useRouter();

interface CcontainerCardProps {
  name: string;
  disabled?: boolean;
  icon?: string;
  image?: string;
  id: string;
  startedAt: string;
  status: string;
  created?: string;
  labels?: Record<string, string>;
  cpu?: number;
  memoryLimit?: number;
  memoryUsage?: number;
}

const props = defineProps<CcontainerCardProps>();

const emit = defineEmits(['reload']);

const statusLabel = computed(() => statusLabelMap[props.status]);
const statusColor = computed(() => statusColorMap[props.status]);

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
  router.push('/container/' + props.id);
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
  /* margin-top: 12px; */
}

.bottom button {
  width: 25%;
  border-right: solid 1px #fff;
}
</style>
