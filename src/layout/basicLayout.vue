<template>
  <div id="basicLayout">
    <div style="min-height: 100vh">
      <!-- <div-header class="header">
        <GlobalHeader />
      </div-header> -->
      <div>
        <GlobalSider class="sider" />
        <div class="content">
          <router-view />
        </div>
      </div>
      <!-- <div class="footer">
        <a href="https://github.com/object-1ve" target="_blank"> 内容由 AI 生成，请仔细甄别 by object1ve</a>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
// import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalSider from "@/components/GlobalSider.vue";
</script>

<style scoped>

</style>
