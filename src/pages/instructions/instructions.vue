<template>
  <div>
    <el-table :data="filterTableData" style="width: 100%">
      <el-table-column label="指令">
        <template #default="scope">
          {{ scope.row.keys }}
        </template>
      </el-table-column>
      <el-table-column label="功能" prop="functions" />
      <el-table-column label="备注">
        <template #default="scope">
          <el-tag
            v-for="(tag, index) in (scope.row.remarks ?? '').split(',').map(s => s.trim()).filter(Boolean)"
            :key="index"
            style="margin-right: 6px;"
          >
            {{ tag }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="最后更新时间">
        <template #default="scope">
          {{ formatTimestamp(scope.row.last_used_time) }}
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <div style="display: flex; align-items: center; gap: 20px">
            <el-button size="small" @click="openDialog()">添加</el-button>
            <el-input v-model="search" size="small" placeholder="输入关键词搜索" />
          </div>
        </template>
        <template #default="scope">
          <el-button size="small" @click="openDialog(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="400px">
      <el-form :model="formModel" label-width="80px">
        <el-form-item label="指令">
          <el-input
            v-model="formModel.keys"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="功能描述">
          <el-input v-model="formModel.functions" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="remarksInput"
            placeholder=""
            @keyup.enter.native="addRemark"
            @blur="addRemark"
          />
          <div style="margin-top: 8px;">
            <el-tag
              v-for="(tag, index) in formRemarks"
              :key="index"
              closable
              @close="removeRemark(index)"
              style="margin-right: 6px;"
            >
              {{ tag }}
            </el-tag>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import {
  getInstructions,
  addInstruction,
  updateInstruction,
  deleteInstruction,
} from './index'; // 你的 API 文件路径
import { ElMessage,ElMessageBox } from 'element-plus';

interface Instruction {
  id?: number;
  keys: string;
  functions: string;
  remarks?: string;
  last_used_time: number | null;
}

const search = ref('');
const tableData = ref<Instruction[]>([]);

// 过滤表格数据
const filterTableData = computed(() =>
  tableData.value.filter(
    (item) =>
      !search.value ||
      item.keys.toLowerCase().includes(search.value.toLowerCase()) ||
      item.functions.toLowerCase().includes(search.value.toLowerCase()) ||
      ((item.remarks ?? '').toLowerCase().includes(search.value.toLowerCase()))
  )
);

const formatTimestamp = (timestamp: number | null): string => {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const loadData = async () => {
  const raw = await getInstructions();
  tableData.value = raw.map(item => ({
    ...item,
    keys: item.keys || '',
    remarks: item.remarks ?? '',
  }));
};

const handleDelete = async (id?: number) => {
  if (!id) return;

  try {
    await ElMessageBox.confirm(
      '确定要删除这条数据吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    await deleteInstruction(id);
    await loadData();
  } catch (error) {
    // 用户取消了删除
    console.log('删除取消', error);
  }
};



const handleTagClose = async (id: number | undefined, tag: string) => {
  if (!id) return;
  const item = tableData.value.find(i => i.id === id);
  if (!item || !item.remarks) return;

  const newRemarks = (item.remarks ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(r => r && r !== tag)
    .join(',');

  await updateInstruction({
    id,
    keys: item.keys,
    functions: item.functions,
    remarks: newRemarks,
    last_used_time: item.last_used_time,
  });
  await loadData();
};

// 对话框相关
const dialogVisible = ref(false);
const dialogTitle = ref('添加指令');
const formModel = ref<Instruction>({
  keys: '',
  functions: '',
  remarks: '',
  last_used_time: null,
});
let editingId: number | undefined = undefined;

// 备注相关：字符串数组和输入框
const formRemarks = ref<string[]>([]);
const remarksInput = ref('');

// 初始化时同步备注字符串转数组
watch(
  () => formModel.value.remarks,
  (val) => {
    const remarksStr = val ?? '';
    formRemarks.value = remarksStr.split(',').map(s => s.trim()).filter(Boolean);
  },
  { immediate: true }
);

// 添加备注函数，支持逗号分割多个标签
function addRemark() {
  const input = remarksInput.value.trim();
  if (!input) return;
  const newTags = input.split(',').map(t => t.trim()).filter(Boolean);
  for (const tag of newTags) {
    if (!formRemarks.value.includes(tag)) {
      formRemarks.value.push(tag);
    }
  }
  remarksInput.value = '';
  formModel.value.remarks = formRemarks.value.join(',');
}

// 删除备注标签
function removeRemark(index: number) {
  formRemarks.value.splice(index, 1);
  formModel.value.remarks = formRemarks.value.join(',');
}

const openDialog = (row?: Instruction) => {
  if (row) {
    dialogTitle.value = '编辑指令';
    editingId = row.id;
    formModel.value = { ...row };
  } else {
    dialogTitle.value = '添加指令';
    editingId = undefined;
    formModel.value = {
      keys: '',
      functions: '',
      remarks: '',
      last_used_time: null,
    };
  }
  dialogVisible.value = true;
};

const handleSave = async () => {
  if (!formModel.value.keys || !formModel.value.functions) {
    ElMessage.warning('请输入完整信息');
    return;
  }

  if (editingId !== undefined) {
    await updateInstruction({
      id: editingId,
      keys: formModel.value.keys.trim(),
      functions: formModel.value.functions.trim(),
      remarks: (formModel.value.remarks ?? '').trim(),
      last_used_time: null,
    });
  } else {
    await addInstruction({
      keys: formModel.value.keys.trim(),
      functions: formModel.value.functions.trim(),
      remarks: (formModel.value.remarks ?? '').trim(),
      last_used_time: null,
    });
  }
  dialogVisible.value = false;
  await loadData();
};

onMounted(async () => {
  await loadData();
});
</script>
