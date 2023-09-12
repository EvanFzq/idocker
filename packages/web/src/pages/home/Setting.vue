<template>
    <van-nav-bar title="设置" right-text="注销" @click-right="onClickRight" />
</template>

<script lang="ts" setup>
import { showSuccessToast } from 'vant'
const onClickRight = () => {
    sessionStorage.removeItem('token')
    showSuccessToast({
        message: "注销成功！", onClose() {
            location.href = '/login'
        }
    })
}
</script>

<style scoped></style>