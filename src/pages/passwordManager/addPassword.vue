<template>
    <div>
        <div class="window-content">
                    <div>
                        <button @click="addPassword" class="button2">添加</button>
                        <button @click="showAddPasswordWindow = false" class="button2">取消</button>
                    </div>
                    <input type="text" v-model="newPassword.username" placeholder="用户名" />
                    <input type="password" v-model="newPassword.password" placeholder="密码" />
                    <input type="url" v-model="newPassword.url" placeholder="网址 (可选)" />
                    <input type="text" v-model="newPassword.remark" placeholder="备注 (可选)" />
                </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
</style>
