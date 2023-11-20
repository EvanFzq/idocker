<template>
  <el-table
    :data="list"
    stripe
    style="width: 100%"
    class="container-list"
  >
    <el-table-column
      prop="icon"
      label="图标"
      width="100"
    >
      <template #default="{ row }">
        <el-image
          v-if="row.icon"
          style="width: 60px; height: 60px"
          :src="row.icon"
          fit="cover"
        >
          <template #error>
            <div class="image-slot">
              <el-icon><icon-picture /></el-icon>
            </div>
          </template>
        </el-image>
        <div
          v-else
          class="no-icon"
        >
          {{
            row.name
              .split(/[\s-_]/)
              .shift()
              ?.slice(0, 8)
          }}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="name"
      label="名称"
      width="180"
    />
    <el-table-column
      prop="status"
      label="状态"
      width="100"
    >
      <template #default="{ row }: { row: ContainerDetail }">
        <el-tag
          class="ml-2"
          effect="dark"
          :color="ContainerStatusColor[row.status]"
        >
          {{ ContainerStatusName[row.status] }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="image"
      label="镜像"
      width="180"
    />
    <el-table-column
      prop="id"
      label="资源消耗"
      width="200"
    >
      <template #default="{ row }: { row: ContainerDetail }">
        <div class="row">
          <div>CPU:</div>
          <el-tooltip
            :content="(row.cpu ? row.cpu.toFixed(2) : '0') + '%'"
            placement="top"
          >
            <el-progress
              class="progress"
              :text-inside="true"
              :stroke-width="18"
              :percentage="Number(row.cpu ? row.cpu.toFixed(2) : '0')"
            >
              <div class="progress-text"> {{ (row.cpu ? row.cpu.toFixed(2) : '0') + '%' }}</div>
            </el-progress>
          </el-tooltip>
        </div>
        <div class="row">
          <div>内存:</div>
          <el-tooltip
            :content="`${fileSizeFormat(row.memoryUsage || 0) || '-'} / ${
              fileSizeFormat(row.memoryLimit || 0) || '-'
            }`"
            placement="top"
          >
            <el-progress
              class="progress"
              :text-inside="true"
              :stroke-width="18"
              :percentage="
                row.memoryLimit ? Math.floor(((row.memoryUsage || 0) * 1000) / row.memoryLimit) : 0
              "
            >
              <div class="progress-text">
                {{ (fileSizeFormat(row.memoryUsage || 0) || '-') + '/' }}
                {{ fileSizeFormat(row.memoryLimit || 0) || '-' }}
              </div>
            </el-progress>
          </el-tooltip>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="networks"
      label="网络"
      width="100"
    >
      <template #default="{ row }: { row: ContainerDetail }">
        <div
          v-for="(network, index) in row.networks"
          :key="index"
        >
          {{ network.type }}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="ports"
      label="端口（主机->容器）"
      width="160"
    >
      <template #default="{ row }: { row: ContainerDetail }">
        <div
          v-for="(port, index) in row.ports"
          :key="index"
        >
          <span>{{ port.hostPort }}</span>
          <span> -> </span>
          <span>{{ port.containerPort }}/{{ port.protocol }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="mounts"
      label="挂载（主机->容器）"
      width="300"
    >
      <template #default="{ row }: { row: ContainerDetail }">
        <div
          v-for="(mount, index) in row.mounts?.sort((a, b) => a.source.localeCompare(b.source))"
          :key="index"
          class="mount"
        >
          <span class="type">{{ mount.type == 'bind' ? '路径' : '卷' }}</span>
          <span> : </span>
          <span>
            {{ mount.type === 'bind' ? mount.source : mount.source.slice(0, 8) }} ->
            {{ mount.target }}
          </span>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="created"
      label="启动时间"
      width="80"
    >
      <template #default="{ row }: { row: ContainerDetail }">
        <el-tooltip
          :content="dayjs(row.created).format('YYYY-MM-DD HH:mm:ss')"
          placement="top-start"
        >
          <div>
            {{ timeLongFormat(row.created) }}
          </div>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column
      prop="id"
      label="操作"
      width="210"
      fixed="right"
      align="center"
    >
      <template #default="{ row }: { row: ContainerDetail }">
        <el-space class="button-row">
          <el-button
            type="primary"
            :icon="View"
            link
            @click="onView(row.id)"
          >
            查看
          </el-button>
          <el-button
            type="primary"
            :icon="Edit"
            link
          >
            编辑
          </el-button>
        </el-space>
        <el-button-group class="button-row">
          <el-tooltip
            v-if="row.status === ContainerStatus.created || row.status === ContainerStatus.exited"
            content="启动"
            placement="top"
          >
            <el-button
              type="success"
              :icon="VideoPlay"
              @click="onActive(row.id, ContainerActive.start)"
            />
          </el-tooltip>
          <el-tooltip
            v-if="row.status === ContainerStatus.paused"
            content="恢复"
            placement="top"
          >
            <el-button
              type="success"
              :icon="VideoPlay"
              @click="onActive(row.id, ContainerActive.unpause)"
            />
          </el-tooltip>
          <el-tooltip
            v-if="row.status === ContainerStatus.running"
            content="暂停"
            placement="top"
          >
            <el-button
              type="warning"
              :icon="VideoPause"
              @click="onActive(row.id, ContainerActive.pause)"
            />
          </el-tooltip>

          <el-tooltip
            v-if="row.status !== ContainerStatus.restarting"
            content="重启"
            placement="top"
          >
            <el-button
              type="primary"
              :icon="RefreshRight"
              @click="onActive(row.id, ContainerActive.restart)"
            />
          </el-tooltip>
          <el-tooltip
            v-if="
              row.status === ContainerStatus.running || row.status === ContainerStatus.restarting
            "
            content="关闭"
            placement="top"
          >
            <el-button
              type="warning"
              :icon="SwitchButton"
              @click="onActive(row.id, ContainerActive.stop)"
            />
          </el-tooltip>
          <el-tooltip
            content="删除"
            placement="top"
          >
            <el-button
              type="danger"
              :icon="Delete"
              @click="onActive(row.id, ContainerActive.remove)"
            />
          </el-tooltip>
        </el-button-group>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup lang="ts">
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElLoading, ElMessage } from 'element-plus';
import {
  Picture as IconPicture,
  VideoPause,
  Edit,
  View,
  Delete,
  VideoPlay,
  RefreshRight,
  SwitchButton,
} from '@element-plus/icons-vue';

import type { ContainerDetail } from '@common/types/container';
import {
  ContainerStatusName,
  ContainerStatusColor,
  ContainerStatus,
  ContainerActive,
} from '@common/constants/enum';

import { activeContainer } from '@/apis/container';
import { fileSizeFormat, timeLongFormat } from '@/utils/utils';

defineProps<{ list: ContainerDetail[] }>();
const emit = defineEmits(['reload']);
const router = useRouter();

const onActive = async (id: string, type: ContainerActive) => {
  try {
    if (type === ContainerActive.remove) {
      await ElMessageBox.confirm('容器将从机器上移除，（镜像、配置文件不会丢失）', '确认删除吗？');
    }
    const loadingInstance = ElLoading.service({});
    const res = await activeContainer(id, type);

    if (res.success) {
      ElMessage.success('操作成功');
    }
    loadingInstance.close();
    emit('reload');
  } catch (error) {
    console.error(error);
  }
};
const onView = (id: string) => {
  router.push('/d/container/' + id);
};
</script>
<style scoped lang="less">
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
  color: #fff;
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
<style>
.container-list {
  .network-list {
    .el-collapse-item__header {
      height: 36px;
      border: 0;
    }
    .el-collapse-item__wrap {
      border: 0;
    }
    .el-collapse-item__content {
      padding-bottom: 12px;
    }
  }
}
</style>
