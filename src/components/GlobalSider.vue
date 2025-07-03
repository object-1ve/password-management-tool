<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from 'vue-router'
import { PictureOutlined, UserOutlined } from '@ant-design/icons-vue'

const router = useRouter()

// 菜单项
const menuItems = [
  {
    key: '/passwordManager',
    label: '密码管理器',
  },
  {
    key: '/shortcuts',
    label: '快捷键',
  }
]

// 当前要高亮的菜单项
const current = ref<string[]>([])

// 监听路由变化，更新高亮菜单项
router.afterEach((to) => {
  current.value = [to.path]
})

// 路由跳转事件
const doMenuClick = (key: string) => {
  router.push(key)
}

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
          :class="{ active: current[0] === '/passwordManager' }"
          @click="doMenuClick('/passwordManager')"
        >
          密码管理器
        </div>
        <div
          class="nav-item"
          :class="{ active: current[0] === '/shortcuts' }"
          @click="doMenuClick('/shortcuts')"
        >
          快捷键
        </div>
      </nav>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  width: 100%;
}

.sidebar {
  width: 150px;
  background-color: #ffffff;
  color: rgb(0, 0, 0);
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  text-align: left;
  border-right: 1px solid #e8e8e8;
}

.nav-item {
  color: #6b6b6b;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s;
  margin: 5px 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  border-radius: 5px;
}

.nav-item:hover {
  background-color: #f0f0f0;
}

.nav-item.active {
  background-color: #e6f7ff;
  color: #1890ff;
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  overflow-y: auto;
}
</style>