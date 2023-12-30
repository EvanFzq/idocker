<template>
  <div class="dashboard">
    <div class="dashboard-item">
      <a-progress
        type="dashboard"
        :stroke-color="strokeColor(Math.floor(totalData.cpu / totalData.cpuNum))"
        :percent="Math.floor(totalData.cpu / totalData.cpuNum)"
      >
        <template #format>
          <div class="percentage-value">{{ Number(totalData.cpu.toFixed(2)) }}%</div>
          <div class="percentage-label"> 总量：{{ totalData.cpuNum }}00% </div>
        </template>
      </a-progress>
      <div class="dashboard-name">CPU使用率</div>
    </div>
    <div class="dashboard-item">
      <a-progress
        type="dashboard"
        :stroke-color="strokeColor((totalData.memoryUsage * 100) / totalData.memoryLimit)"
        :percent="(totalData.memoryUsage * 100) / totalData.memoryLimit"
      >
        <template #format>
          <div class="percentage-value">
            {{ Number(((totalData.memoryUsage * 100) / totalData.memoryLimit).toFixed(2)) }}%
          </div>
          <div class="percentage-label">
            {{
              `${fileSizeFormat(totalData.memoryUsage) || '-'} / ${
                fileSizeFormat(totalData.memoryLimit) || '-'
              }`
            }}
          </div>
        </template>
      </a-progress>
      <div class="dashboard-name">内存使用率</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { fileSizeFormat } from '@/utils/utils';

defineProps<{
  totalData: { cpu: number; cpuNum: number; memoryUsage: number; memoryLimit: number };
}>();

const strokeColor = (value: number) => {
  if (value < 30) {
    return 'rgb(7, 193, 96)';
  }
  if (value > 80) {
    return '#ff4d4f';
  }
  return '#f60';
};
</script>
<style scoped lang="less">
.dashboard {
  display: flex;
  flex: auto;
  width: 50%;
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
  .percentage-value {
    font-size: 24px;
    margin-bottom: 12px;
    color: #1677ff;
  }
  .percentage-label {
    font-size: 14px;
  }
}
</style>
