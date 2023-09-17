<template>
  <van-cell-group inset>
    <van-field
      v-model="command"
      rows="4"
      autosize
      name="command"
      label="启动命令"
      type="textarea"
      placeholder="请输入启动命令"
    />
  </van-cell-group>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const command = ref('');
</script>
