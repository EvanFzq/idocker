<!-- eslint-disable vue/no-v-html -->
<template>
  <a-table
    :columns="columns"
    :data-source="list"
    :scroll="{ x: tableWidth }"
    size="middle"
    :pagination="{ showSizeChanger: true }"
  >
    <template
      #bodyCell="{
        column,
        record,
      }: {
        record: ContainerDetail;
        column: TableColumnProps<ContainerDetail>;
      }"
    >
      <template v-if="column.key === 'icon'">
        <a-image
          v-if="record.icon && getIcon(record.icon).type === 'url'"
          :width="60"
          :src="getIcon(record.icon).content"
          fit="cover"
          :preview="false"
        />
        <div
          v-if="record.icon && getIcon(record.icon).type === 'svg'"
          class="icon-svg"
          v-html="getIcon(record.icon).content"
        />
        <div
          v-if="!record.icon"
          class="no-icon"
        >
          {{
            record.name
              .split(/[\s-_]/)
              .shift()
              ?.slice(0, 8)
          }}
        </div>
      </template>
      <template v-if="column.key === 'name'">
        <div>
          {{ record.name }}
          <UpCircleOutlined
            v-if="record.canUpdate"
            style="color: #07c160"
            @click="onUpdate(record.id)"
          />
        </div>
      </template>
      <template v-if="column.key === 'status'">
        <a-tag :color="ContainerStatusColor[record.status]">
          {{ ContainerStatusName[record.status] }}
        </a-tag>
      </template>
      <template v-if="column.key === 'system'">
        <div class="row">
          <div style="flex: none">CPU:</div>
          <a-progress
            class="progress"
            :size="[120, 18]"
            :show-info="false"
            :percent="Number(record.cpu ? record.cpu.toFixed(2) : '0')"
          >
          </a-progress>
          <div class="progress-text">
            {{ (record.cpu ? record.cpu.toFixed(2) : '0') + '%' }}
          </div>
        </div>
        <div class="row">
          <div style="flex: none">内存:</div>
          <a-progress
            class="progress"
            :size="[120, 18]"
            :show-info="false"
            :percent="
              record.memoryLimit
                ? Math.floor(((record.memoryUsage || 0) * 100) / record.memoryLimit)
                : 0
            "
          >
          </a-progress>
          <div class="progress-text">
            {{ (fileSizeFormat(record.memoryUsage || 0) || '-') + '/' }}
            {{ fileSizeFormat(record.memoryLimit || 0) || '-' }}
          </div>
        </div>
      </template>
      <template v-if="column.key === 'networks'">
        <div
          v-for="(network, index) in record.networks"
          :key="index"
        >
          <span>{{ network.name }}</span>
        </div>
      </template>
      <template v-if="column.key === 'ports'">
        <div
          v-for="(port, index) in record.ports"
          :key="index"
        >
          <span>{{ port.hostPort }}</span>
          <span> -> </span>
          <span>{{ port.containerPort }}/{{ port.protocol }}</span>
        </div>
      </template>
      <template v-if="column.key === 'mounts'">
        <div
          v-for="(mount, index) in record.mounts?.sort((a, b) => a.source.localeCompare(b.source))"
          :key="index"
          class="mount"
        >
          <span class="type">{{
            MountTypeList.find(item => item.value === mount.type)?.label
          }}</span>
          <span> : </span>
          <span>
            {{ mount.type === 'bind' ? mount.source : mount.source.slice(0, 8) }} ->
            {{ mount.target }}
          </span>
        </div>
      </template>
      <template v-if="column.key === 'created'">
        <a-tooltip
          :title="dayjs(record.created).format('YYYY-MM-DD HH:mm:ss')"
          placement="top-start"
        >
          <div>
            {{ timeLongFormat(record.created) }}
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'operate'">
        <a-space class="button-row">
          <a-tooltip
            v-if="record.canUpdate"
            title="更新镜像"
            placement="top"
          >
            <a-button
              :icon="h(UpCircleOutlined)"
              type="link"
              size="small"
              @click="onUpdate(record.id)"
            />
          </a-tooltip>
          <a-tooltip
            title="信息"
            placement="top"
          >
            <a-button
              :icon="h(InfoCircleOutlined)"
              type="link"
              size="small"
              @click="onView(record.id)"
            />
          </a-tooltip>
          <a-tooltip
            title="日志"
            placement="top"
          >
            <a-button
              :icon="h(FileTextOutlined)"
              type="link"
              size="small"
              @click="onLog(record.id)"
            />
          </a-tooltip>
          <a-tooltip
            title="终端"
            placement="top"
          >
            <a-button
              :icon="h(CodeOutlined)"
              type="link"
              size="small"
              @click="onTermianl(record.id)"
            />
          </a-tooltip>
          <a-tooltip
            title="编辑"
            placement="top"
          >
            <a-button
              :icon="h(EditOutlined)"
              type="link"
              size="small"
              @click="onEdit(record.id)"
            />
          </a-tooltip>
        </a-space>
        <div class="button-row">
          <a-tooltip
            v-if="
              record.status === ContainerStatus.created || record.status === ContainerStatus.exited
            "
            title="启动"
            placement="bottom"
          >
            <a-button
              class="button"
              type="primary"
              :loading="activeLoadingId === record.id"
              style="background-color: #07c160"
              :icon="h(CaretRightOutlined)"
              @click="onActive(record.id, ContainerActive.start)"
            />
          </a-tooltip>
          <a-tooltip
            v-if="record.status === ContainerStatus.paused"
            title="恢复"
            placement="bottom"
          >
            <a-button
              class="button"
              type="primary"
              :loading="activeLoadingId === record.id"
              style="background-color: #07c160"
              :icon="h(PlayCircleOutlined)"
              @click="onActive(record.id, ContainerActive.unpause)"
            />
          </a-tooltip>
          <a-tooltip
            v-if="record.status === ContainerStatus.running"
            title="暂停"
            placement="bottom"
          >
            <a-button
              class="button"
              type="primary"
              :loading="activeLoadingId === record.id"
              style="background-color: #ff976a"
              :icon="h(PauseCircleOutlined)"
              @click="onActive(record.id, ContainerActive.pause)"
            />
          </a-tooltip>

          <a-tooltip
            v-if="record.status !== ContainerStatus.restarting"
            title="重启"
            placement="bottom"
          >
            <a-button
              class="button"
              type="primary"
              :loading="activeLoadingId === record.id"
              :icon="h(ReloadOutlined)"
              @click="onActive(record.id, ContainerActive.restart)"
            />
          </a-tooltip>
          <a-tooltip
            v-if="
              [
                ContainerStatus.running,
                ContainerStatus.restarting,
                ContainerStatus.paused,
              ].includes(record.status as ContainerStatus)
            "
            title="关闭"
            placement="bottom"
          >
            <a-button
              class="button"
              :loading="activeLoadingId === record.id"
              style="background-color: #dcdee0"
              :icon="h(StopOutlined)"
              @click="onActive(record.id, ContainerActive.stop)"
            />
          </a-tooltip>
          <a-tooltip
            title="删除"
            placement="bottom"
          >
            <a-button
              class="button"
              type="primary"
              :loading="activeLoadingId === record.id"
              style="background-color: #ee3c3c"
              :icon="h(DeleteOutlined)"
              @click="onActive(record.id, ContainerActive.remove)"
            />
          </a-tooltip>
        </div>
      </template>
    </template>
  </a-table>
</template>
<script setup lang="ts">
import dayjs from 'dayjs';
import { h, ref } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import {
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  CaretRightOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  StopOutlined,
  UpCircleOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  CodeOutlined,
} from '@ant-design/icons-vue';

import type { ContainerDetail } from '@common/types/container';
import {
  ContainerStatusName,
  ContainerStatusColor,
  ContainerStatus,
  ContainerActive,
  MountTypeList,
} from '@common/constants/enum';
import { getIcon } from '@common/utils/utils';

import { activeContainer, updateContainerImage } from '@/apis/container';
import { fileSizeFormat, timeLongFormat } from '@/utils/utils';

import type { TableColumnProps } from 'ant-design-vue';

defineProps<{ list: ContainerDetail[] }>();
const emit = defineEmits(['reload']);
const router = useRouter();
const activeLoadingId = ref('');
const columns: TableColumnProps<ContainerDetail>[] = [
  {
    key: 'icon',
    dataIndex: 'icon',
    title: '图标',
    width: 100,
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: '名称',
    width: 180,
    sorter: (a: ContainerDetail, b: ContainerDetail) => a.name.localeCompare(b.name),
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: '状态',
    width: 100,
    sorter: (a: ContainerDetail, b: ContainerDetail) => a.status.localeCompare(b.status),
  },
  {
    key: 'image',
    dataIndex: 'image',
    title: '镜像',
    width: 180,
  },
  {
    key: 'system',
    dataIndex: 'id',
    title: '资源消耗',
    width: 300,
    sorter: (a: ContainerDetail, b: ContainerDetail) => (a.cpu || 0) - (b.cpu || 0),
  },
  {
    key: 'networks',
    dataIndex: 'networks',
    title: '网络',
    width: 120,
  },
  {
    key: 'ports',
    dataIndex: 'ports',
    title: '端口（主机->容器）',
    width: 180,
  },
  {
    key: 'mounts',
    dataIndex: 'mounts',
    title: '挂载（主机->容器）',
    width: 360,
  },
  {
    key: 'created',
    dataIndex: 'created',
    title: '启动时间',
    width: 100,
    sorter: (a: ContainerDetail, b: ContainerDetail) => a.created - b.created,
  },
  {
    key: 'operate',
    dataIndex: 'id',
    title: '操作',
    width: 160,
    fixed: 'right',
    align: 'center',
  },
];
const tableWidth: number = (columns as { width: number }[]).reduce(
  (pre: number, cur: { width: number }) => pre + cur.width,
  0,
);

const handleActive = async (id: string, type: ContainerActive) => {
  activeLoadingId.value = id;
  const res = await activeContainer(id, type);

  if (res.success) {
    message.success('操作成功');
  }
  activeLoadingId.value = '';
  emit('reload');
};

const onActive = async (id: string, type: ContainerActive) => {
  try {
    if (type === ContainerActive.remove) {
      Modal.confirm({
        title: '确认删除吗？',
        content: '容器将从机器上移除，（镜像、配置文件不会丢失）',
        onOk: () => handleActive(id, type),
      });
    } else {
      handleActive(id, type);
    }
  } catch (error) {
    console.error(error);
  }
};
const onView = (id: string) => {
  router.push('/d/container/' + id);
};
const onLog = (id: string) => {
  router.push(`/d/container/${id}?tab=logs`);
};
const onTermianl = (id: string) => {
  router.push(`/d/container/${id}?tab=termianl`);
};
const onEdit = (id: string) => {
  router.push('/d/container/newOrEdit?id=' + id);
};
const onUpdate = (id: string) => {
  Modal.confirm({
    title: '确认更新容器镜像吗？',
    content: '可能存在不兼容情况，请关注容器更新日志',
    async onOk() {
      const res = await updateContainerImage(id);
      if (res.success) {
        emit('reload');
        message.success('更新成功');
      }
    },
  });
};
</script>
<style scoped lang="less">
.icon-svg {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.no-icon {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #409eff;
}
.row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  & + .row {
    margin-top: 12px;
  }
}
.url {
  font-size: 10px;
}
.button-row {
  text-align: center;
  .button {
    border-radius: 0;
    &:first-of-type {
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
    }
    &:last-of-type {
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
    }
  }
}
.button-row + .button-row {
  margin-top: 6px;
}
.progress {
  flex: auto;
  margin-left: 6px;
}
.progress-text {
  font-size: 10px;
  width: 180px;
  margin-left: 4px;
}
.network-list {
  border: 0;
  padding: 12px;
  background-color: #fff;
  .network {
    color: #999;
    font-size: 10px;
    line-height: 16px;
  }
}
.mount {
  font-size: 10px;
  line-height: 16px;
  width: 100%;
  .type {
    font-size: 12px;
    font-weight: 500;
  }
  & + .mount {
    margin-top: 4px;
    border-top: solid 1px #e5e5e5;
    padding-top: 4px;
  }
}
</style>
