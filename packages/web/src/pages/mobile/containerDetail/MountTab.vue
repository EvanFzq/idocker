<template>
  <div class="mount">
    <van-cell-group
      v-for="(item, index) in list"
      :key="index"
      class="mount-card"
      inset
    >
      <van-cell
        title-class="mount-title"
        :title="'挂载' + (index + 1)"
      />
      <van-cell
        title="类型"
        :value="MountTypeList.find(mount => mount.value === item.type)?.label"
      />
      <van-cell
        :title="item.type === 'bind' ? '主机路径' : '数据卷'"
        :value="item.source"
      />
      <van-cell
        title="容器路径"
        :value="item.target"
      />
      <van-cell
        title="读写"
        :value="item.rw ? '读写' : '只读'"
      />
    </van-cell-group>
  </div>
</template>
<script lang="ts" setup>
import type { Mount } from '@common/types/container';
import { MountTypeList } from '@common/constants/enum';
defineProps<{ list?: Mount[] }>();
</script>
<style lang="less">
.mount {
  .mount-card {
    margin-bottom: 12px;
  }

  .mount-title {
    font-weight: 700;
    font-size: 16px;
    color: #1989fa;
  }
}
</style>
