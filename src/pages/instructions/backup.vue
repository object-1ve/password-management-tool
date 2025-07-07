<template>
  <el-button class="mt-4" style="width: 100%" @click="onAddItem">
    Add Item
  </el-button>
  <el-table :data="filterTableData" style="width: 100%">
    <el-table-column label="快捷键" prop="keys" />
    <el-table-column label="功能" prop="functions" />
    <el-table-column label="最后使用时间" prop="last_used_time">
      <template #default="scope">
        {{ formatTimestamp(scope.row.last_used_time) }}
      </template>
    </el-table-column>
    <el-table-column align="right">
      <template #header>
        <el-input v-model="searchKeyword" size="small" placeholder="搜索快捷键或功能" />
      </template>
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.row)">
          编辑
        </el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.row)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { getShortcuts, updateShortcut, deleteShortcut } from './index'
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

interface Shortcut {
  id: number;
  keys: string;
  functions: string;
  last_used_time: number;
}

const shortcuts = ref<Shortcut[]>([])
const searchKeyword = ref('')

const filterTableData = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (!keyword) return shortcuts.value
  return shortcuts.value.filter(item =>
      item.keys.toLowerCase().includes(keyword) ||
      item.functions.toLowerCase().includes(keyword)
  )
})
/**
 * 格式化时间戳为本地日期时间字符串
 */
// const formatTimestamp = (timestamp: number ): string => {
//   const date = new Date(timestamp);
//   console.log("hello world")
//   console.log(timestamp)
//   console.log(date)
//   console.log("hello world")
//   const formatted = date.toLocaleString( '',{
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//     hour: '2-digit',
//     minute: '2-digit',
//     second: '2-digit',
//   });
//   console.log(formatted); // "2024/07/04 16:01:12"
//   return formatted;
// }
// const handleAdd = () =>{
//
// }
const formatTimestamp = (timestamp: number): string => {
  timestamp = timestamp * 1000
  const date = new Date(timestamp);

  const pad = (n:number) => n.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // 月份从0开始
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}
// const onAddItem = () => {
//   now.setDate(now.getDate() + 1)
//   shortcutd.value.push({
//     date: dayjs(now).format('YYYY-MM-DD'),
//     name: 'Tom',
//     state: 'California',
//     city: 'Los Angeles',
//     address: 'No. 189, Grove St, Los Angeles',
//     zip: 'CA 90036',
//   })
// }

const handleEdit = async (shortcut: Shortcut) => {
  try {
    const { value: inputValue } = await ElMessageBox.prompt(
        `编辑快捷键: ${shortcut.keys}`,
        '编辑',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: shortcut.functions,
          inputPlaceholder: '请输入功能描述'
        }
    )

    if (inputValue !== null) {
      await updateShortcut({
        ...shortcut,
        functions: inputValue,
        last_used_time: Date.now()
      })
      ElMessage.success('更新成功')
      await loadShortcuts()
    }
  } catch (error) {
    console.log('取消编辑')
  }
}

const handleDelete = async (shortcut: Shortcut) => {
  try {
    await ElMessageBox.confirm(
        `确定删除快捷键: ${shortcut.keys} 吗?`,
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
    )

    await deleteShortcut(shortcut.id)
    ElMessage.success('删除成功')
    await loadShortcuts()
  } catch (error) {
    console.log('取消删除')
  }
}

const loadShortcuts = async () => {
  try {
    const dbShortcuts = await getShortcuts()
    shortcuts.value = (dbShortcuts || []).map(item => ({
      id: item.id,
      keys: item.keys,
      functions: item.functions,
      last_used_time: item.last_used_time
    }))
    console.log("shortcuts loaded:", shortcuts.value)
  } catch (error) {
    ElMessage.error('加载快捷键失败')
    console.error('加载快捷键失败:', error)
  }
}

onMounted(() => {
  loadShortcuts()
})
</script>
