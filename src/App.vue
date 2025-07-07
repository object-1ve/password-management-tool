<script setup lang="ts">
import { ref } from "vue";
// import ytable from './pages/ytable.vue'
// import yy from './pages/yy.vue'
import passwordManager from "./pages/passwordManager/passwordManager.vue";
import instructions from "./pages/instructions/instructions.vue";
const currentView = ref("home");
const switchView = (view: string) => {
  currentView.value = view;
};
</script>

<template>
  <div class="container">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <nav>
        <div
          class="nav-item"
          :class="{ active: currentView === 'home' }"
          @click="switchView('home')"
        >
          密码管理
        </div>
        <div
          class="nav-item"
          :class="{ active: currentView === 'shortcuts' }"
          @click="switchView('shortcuts')"
        >
          指令集
        </div>
      </nav>
    </div>

    <!-- 右侧内容区 -->
    <div class="content">
      <div v-if="currentView === 'home'">
        <passwordManager></passwordManager>
      </div>
      <div v-if="currentView === 'shortcuts'">
        <instructions></instructions>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-container {
  width: 800px;
  height: 400px;
}
.container {
  display: flex;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 5px;
  right: 0;
  bottom: 0;
}

.sidebar {
  width: 100px;
  background-color: #ffffff;
  color: rgb(0, 0, 0);
  display: flex;
  flex-direction: column;
  padding: 0px 0;
  text-align: left;
}

.logo {
  padding: 0 0px;
  margin-bottom: 30px;
}

.nav-item {
  color: #6b6b6b;
  padding: 0px 8px;
  cursor: pointer;
  transition: all 0.3s;
  height: 30px;
  margin: 5px 0;
  font-size: 15px;
  display: flex;
  align-items: center;
}

.nav-item:hover {
  background-color: #dcdcdc;
  border-radius: 5px;
}

.nav-item.active {
  background-color: #dcdcdc;
  border-radius: 5px;
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  overflow-y: auto;
}
</style>
