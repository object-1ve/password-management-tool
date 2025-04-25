<script setup lang="ts">
import { ref } from 'vue';
// import ytable from './pages/ytable.vue'
// import yy from './pages/yy.vue'
import yMain from './pages/ymain/ymain.vue'
import ytoDoList from './pages/toDoList/toDoList.vue'
import pageThree from './pages/pageThree/index.vue'
const currentView = ref('home');
const switchView = (view: string) => {
  currentView.value = view;
};
</script>

<template>
  <div class="container">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <nav>
        <div class="nav-item" 
            :class="{ active: currentView === 'home' }" 
            @click="switchView('home')">
          首页
        </div>
        <div class="nav-item" 
            :class="{ active: currentView === 'passwords' }" 
            @click="switchView('passwords')">
            任务清单
        </div>
        <div class="nav-item" 
            :class="{ active: currentView === 'generate' }" 
            @click="switchView('generate')">
          密码生成
        </div>
        <!-- <div class="nav-item" 
            :class="{ active: currentView === 'settings' }" 
            @click="switchView('settings')">
          设置
        </div> -->
      </nav>
    </div>
    
    <!-- 右侧内容区 -->
    <div class="content">
      <div v-if="currentView === 'home'">
          <yMain></yMain>
      </div>
      
      <div v-if="currentView === 'passwords'">
        <ytoDoList></ytoDoList>
      </div>
      
      <div v-if="currentView === 'generate'">
        <pageThree></pageThree>
      </div>
      
      <!-- <div v-if="currentView === 'settings'">
        <h2>设置</h2>
        <p>应用程序设置选项</p>
      </div> -->
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
  width: 150px;
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
  color:#6b6b6b;
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

