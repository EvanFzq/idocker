<template>
  <div class="baseinfo">
    <van-cell-group inset>
      <van-cell
        title="名称"
        :value="name"
      />
      <van-cell
        title-class="image-title"
        value-class="image-value"
        title="镜像"
        :value="image"
      />
      <van-cell
        title-class="image-title"
        value-class="image-value"
        title="重启策略"
        :value="restart || '-'"
      />
      <van-cell
        title="启动时间"
        :value="startTime ? dayjs(startTime).format('YYYY-MM-DD HH:mm:ss') : '-'"
      />
      <van-cell
        title="创建时间"
        :value="createTime ? dayjs(createTime).format('YYYY-MM-DD HH:mm:ss') : '-'"
      />
      <van-cell
        title="CMD"
        :value="cmd?.join(' ') || '-'"
      />
      <van-cell
        title="Entrypoint"
        :value="entrypoint?.join(' ') || '-'"
      />
      <van-cell
        title="Id"
        :value="id"
      />
    </van-cell-group>
  </div>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs';
interface BaseInfoProps {
  id?: string;
  name?: string;
  image?: string;
  restart?: string;
  startTime?: string;
  createTime?: string;
  cmd?: string[];
  entrypoint?: string[];
}
defineProps<BaseInfoProps>();
</script>
<style lang="less">
.baseinfo {
  .image-title,
  .image-value {
    flex: auto;
  }
}
</style>
