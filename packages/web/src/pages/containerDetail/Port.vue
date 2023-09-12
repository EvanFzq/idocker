<template>
    <div class="port">
        <van-cell-group inset>
            <van-cell title-class="port-title" value-class="port-title" title="主机端口" value="容器端口" />
            <van-cell v-for="value, key in data" :key="key" :title="value?.[0]?.HostPort || '未绑定'" :value="key" />

        </van-cell-group>
    </div>
</template>
<script lang="ts" setup>
import { Ports } from '@common/types/container'
defineProps<{ data?: Ports }>()
</script>
<style lang="less">
.port {
    .port-title {
        font-weight: 700;
        font-size: 16px;
        color: #1989fa
    }
}
</style>