<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-section">
        <div class="footer-logo">
          <div>内容由 AI 生成，请仔细甄别</div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// import { computed } from 'vue'
//
// // 计算当前年份
// const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.app-footer {
  background-color: #fff;
  color: #666;
  border-top: 1px solid #eee;
  width: 100%;
  margin-top: auto;
  position: relative;
  z-index: 2;
}

.footer-section {
  flex: 1;
  min-width: 200px;
  padding: 0 15px;
}

.footer-logo{
  font-size: 1rem;
  margin-bottom: 2px;
  color: #333;
}

.footer-section h4 {
  font-size: 1rem;
  color: #333;
}

.footer-links a {
  color: #666;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #007bff;
}


/* 响应式设计 */
@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
  }
  
  .footer-section {
    width: 100%;
    margin-bottom: 20px;
    padding: 0;
  }
}

@media (max-width: 480px) {
  .app-footer {
    padding: 30px 0 15px;
  }
  
  .footer-section h4 {
    font-size: 0.95rem;
  }
  
  .footer-links a {
    font-size: 0.9rem;
  }

}
</style> 