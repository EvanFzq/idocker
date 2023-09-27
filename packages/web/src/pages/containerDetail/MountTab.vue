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
        :value="item.Type === 'bind' ? '路径' : '数据卷'"
      />
      <van-cell
        :title="item.Type === 'bind' ? '主机路径' : '数据卷'"
        :value="item.Type === 'bind' ? item.Source : item.Name"
      />
      <van-cell
        title="容器路径"
        :value="item.Destination"
      />
      <van-cell
        title="读写"
        :value="item.RW ? '读写' : '只读'"
      />
    </van-cell-group>
  </div>
</template>
<script lang="ts" setup>
import type { Mount } from '@common/types/container';
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
