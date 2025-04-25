<script lang="ts" setup>
    import {openNewPage} from "./index";
    const openNewPage_o = async () => {
        openNewPage();
    }
</script>
<template>
    <div>
        <button @click="openNewPage_o">newPage</button>
    </div>
</template>



<style lang="scss" scoped>
</style>
