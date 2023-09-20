<template>
  <div class="env-var">
    <van-cell-group inset>
      <van-cell
        title-class="env-var-title"
        value-class="env-var-title"
        title="变量键"
        value="值"
      />
      <van-cell
        v-for="(envVal, index) in envs"
        :key="index"
        :title="envVal.split('=')[0]"
        :value="envVal.split('=')[1]"
      />
    </van-cell-group>
  </div>
</template>
<script lang="ts" setup>
defineProps<{ envs?: string[] }>();
</script>

<style lang="less">
.env-var {
  .env-var-title {
    font-weight: 700;
    font-size: 16px;
    color: #1989fa;
  }
}
</style>
