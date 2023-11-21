<template>
  <div class="dashboard">
    <div class="dashboard-item">
      <el-progress
        type="dashboard"
        :percentage="Math.floor(totalData.cpu / totalData.cpuNum)"
      >
        <template #default>
          <div class="percentage-value">{{ Number(totalData.cpu.toFixed(2)) }}%</div>
          <div class="percentage-label"> 总量：{{ totalData.cpuNum }}00% </div>
        </template>
      </el-progress>
      <div class="dashboard-name">CPU使用率</div>
    </div>
    <div class="dashboard-item">
      <el-progress
        type="dashboard"
        :percentage="totalData.memoryUsage / totalData.memoryLimit"
      >
        <template #default>
          <div class="percentage-value">
            {{ Number((totalData.memoryUsage / totalData.memoryLimit).toFixed(2)) }}%
          </div>
          <div class="percentage-label">
            {{
              `${fileSizeFormat(totalData.memoryUsage) || '-'} / ${
                fileSizeFormat(totalData.memoryLimit) || '-'
              }`
            }}
          </div>
        </template>
      </el-progress>
      <div class="dashboard-name">内存使用率</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { fileSizeFormat } from '@/utils/utils';

defineProps<{
  totalData: { cpu: number; cpuNum: number; memoryUsage: number; memoryLimit: number };
}>();
</script>
<style scoped lang="less">
.dashboard {
  display: flex;
  justify-content: space-evenly;
  .dashboard-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 16px 48px;
  }
  .dashboard-name {
    font-weight: 700;
    font-size: 16px;
    color: #333;
  }
}
</style>
