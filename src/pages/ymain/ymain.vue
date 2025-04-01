<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
    insertPassword,
    getPasswords,
    deletePassword as deletePasswordApi,
    updatePassword as updatePasswordApi,
    importFromTxtFile,
    insertPasswordFromTextFile
    // writeToClipboard
} from './index'

const passwordList = ref<any[]>([])
const newPassword = ref({
    username: '',
    password: '',
    url: '',
    remark: ''
})
const showAddPasswordWindow = ref(false)
const contextMenuVisible = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })
const selectedPassword = ref<any>(null)
const isEditing = ref(false)

const openAddPasswordWindow = () => {
    showAddPasswordWindow.value = true
    isEditing.value = false
}

const loadPasswords = async () => {
    try {
        const passwords = await getPasswords()
        passwordList.value = passwords || [] // Fallback to empty array if undefined
        originalPasswordList.value = [...passwordList.value]
        searchKeyword.value = ''
    } catch (error) {
        console.error('加载密码失败:', error)
        passwordList.value = [] // Ensure we have an array even on error
        originalPasswordList.value = []
    }
}


const addPassword = async () => {
    try {
        if (isEditing.value && selectedPassword.value?.id) {
            await updatePasswordApi(
                selectedPassword.value.id,  // 第一个参数：id
                {                          // 第二个参数：passwordData
                    ...newPassword.value,
                    updateTime: undefined  // 让后端生成更新时间
                }
            )
            console.log('密码更新成功')
        } else {
            await insertPassword(newPassword.value)
            console.log('密码添加成功')
        }

        newPassword.value = { username: '', password: '', url: '', remark: '' }
        showAddPasswordWindow.value = false
        selectedPassword.value = null
        await loadPasswords()
    } catch (error) {
        console.error('操作失败:', error)
    }
}

const handleRightClick = (event: MouseEvent, password: any) => {
    event.preventDefault()
    selectedPassword.value = password
    contextMenuPosition.value = {
        x: event.clientX,
        y: event.clientY
    }
    contextMenuVisible.value = true
}

const clearContent = () => {
    newPassword.value = { username: '', password: '', url: '', remark: '' }
}

const handleCancel = () => {
    clearContent()
    showAddPasswordWindow.value = false
    selectedPassword.value = null
}

const deletePassword = async () => {
    if (!selectedPassword.value) return

    if (!confirm(`确定要删除 url: ${selectedPassword.value.url} 的记录吗？`)) {
        return
    }

    try {
        await deletePasswordApi(selectedPassword.value.id)
        await loadPasswords()
    } catch (error) {
        console.error('删除失败:', error)
    } finally {
        contextMenuVisible.value = false
    }
}

const editPassword = () => {
    if (!selectedPassword.value) return

    newPassword.value = { ...selectedPassword.value }
    showAddPasswordWindow.value = true
    isEditing.value = true
    contextMenuVisible.value = false

    // window.scrollTo({
    //     top: 10,
    //     left: 0, 
    // })
}

const handleClickOutside = () => {
    contextMenuVisible.value = false
}
// const clickedCellText = ref<string | null>(null) // New ref to store text of the clicked cell

// const copy = async () => {
//     // Get the text stored from the right-click event
//     const textToCopy = clickedCellText.value;

//     // Ensure there is text to copy
//     if (typeof textToCopy !== 'string' || textToCopy.trim() === '') {
//         console.warn('No text content found in the clicked cell to copy.');
//         contextMenuVisible.value = false; // Hide context menu
//         return;
//     }

//     try {
//         // Use the imported writeToClipboard function from './index.ts'
//         // This assumes './index.ts' correctly exports a function that calls
//         // the Electron clipboard API (like window.api.writeToClipboard)
//         await writeToClipboard(textToCopy);
//         console.log(`Copied "${textToCopy}" to clipboard!`);
//         // Optional: Show a success message to the user

//     } catch (error) {
//         console.error('Failed to copy text to clipboard:', error);
//         // Optional: Show an error message to the user
//     } finally {
//         // Always hide the context menu and clear the stored text
//         contextMenuVisible.value = false;
//         clickedCellText.value = null;
//     }
// }
const formatDateTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return ''

    // 处理 2025/4/1 18:20:38 这样的格式
    const [datePart, timePart] = dateTimeStr.split(' ')
    const [year, month, day] = datePart.split('/')

    // 补零处理
    const padZero = (num: string) => num.padStart(2, '0')
    const formattedDate = `${year}-${padZero(month)}-${padZero(day)}`

    return timePart ? `${formattedDate} ${timePart}` : formattedDate
}
const importFromTxt = async () => {
    try {
        // 1. 打开文件选择对话框
        const { filePaths } = await (window as any).api.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'Text Files', extensions: ['txt'] }]
        })

        if (!filePaths || filePaths.length === 0) return

        // 2. 读取文件内容
        const fileContent = await importFromTxtFile(filePaths[0])
        const lines = fileContent.split('\n').filter((line: string) => line.trim())

        // 3. 解析并导入每条记录
        let successCount = 0
        for (const line of lines) {
            try {
                const [username, password, url, remark, updateTime, createTime] = line.split('\t')

                await insertPasswordFromTextFile({
                    username: username?.trim() || '',
                    password: password?.trim() || '',
                    url: url?.trim() || '',
                    remark: remark ? `${remark.trim()} from text` : 'from text',
                    updateTime: updateTime ? formatDateTime(updateTime.trim()) : '',
                    createTime: createTime ? formatDateTime(createTime.trim()) : ''
                })
                successCount++
            } catch (error) {
                console.error('导入单条记录失败:', error)
            }
        }

        // 4. 刷新列表并显示结果
        await loadPasswords()
        alert(`成功导入 ${successCount}/${lines.length} 条记录`)

    } catch (error) {
        console.error('导入失败:', error)
        alert('导入失败，请检查文件格式')
    }
}


const searchKeyword = ref('') // 添加搜索关键词
const originalPasswordList = ref<any[]>([]) // 保存原始数据

// 添加搜索函数
const search = () => {
    const keyword = searchKeyword.value.trim().toLowerCase()

    if (!keyword) {
        passwordList.value = [...originalPasswordList.value]
        return
    }

    passwordList.value = originalPasswordList.value
        .map(item => {
            const matches = {
                username: item.username?.toLowerCase().includes(keyword),
                password: item.password?.toLowerCase().includes(keyword),
                url: item.url?.toLowerCase().includes(keyword),
                remark: item.remark?.toLowerCase().includes(keyword),
                updateTime: item.updateTime?.toLowerCase().includes(keyword),
                createTime: item.createTime?.toLowerCase().includes(keyword)
            }

            return {
                ...item,
                _matches: matches,
                _isMatched: Object.values(matches).some(Boolean)
            }
        })
        .filter(item => item._isMatched)
}
onMounted(() => {
    loadPasswords()
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
    <div class="password-manager">
        <div class="button-section">
            <div class="buttons-left">
                <button class="button0" @click="loadPasswords">刷新</button>
                <template v-if="!showAddPasswordWindow">
                    <button class="button0" @click="openAddPasswordWindow">添加</button>
                </template>
                <template v-else>
                    <button @click="handleCancel" class="button2">取消</button>
                    <button @click="addPassword" class="button2">{{ isEditing ? '更新' : '添加' }}</button>
                </template>
                <button class="button0" @click="importFromTxt">txt导入</button>
            </div>
            <div class="search-input-wrapper">
                <input type="text" v-model="searchKeyword" placeholder="输入关键词搜索" @keyup.enter="search">
                <button @click="search" class="search-icon-button" >
                    <img src="./search.svg" alt="搜索" class="search-icon">
                </button>
            </div>
        </div>
        <div class="add-password-window" v-if="showAddPasswordWindow">
            <div class="window-content">
                <h3>{{ isEditing ? '编辑密码' : '添加新密码' }}</h3>
                <div class="input-group">
                    <label for="username">用户名</label>
                    <input id="username" type="text" v-model="newPassword.username" placeholder="请输入用户名" />
                </div>
                <div class="input-group">
                    <label for="password">密码</label>
                    <input id="password" type="text" v-model="newPassword.password" placeholder="请输入密码" />
                </div>
                <div class="input-group">
                    <label for="url">网址</label>
                    <input id="url" type="url" v-model="newPassword.url" placeholder="请输入网址 (可选)" />
                </div>
                <div class="input-group">
                    <label for="remark">备注</label>
                    <input id="remark" type="text" v-model="newPassword.remark" placeholder="请输入备注 (可选)" />
                </div>
            </div>
        </div>


        <div class="password-table" v-if="passwordList.length > 0">
            <table>
                <thead>
                    <tr>
                        <th>用户名</th>
                        <th>密码</th>
                        <th>网址</th>
                        <th>备注</th>
                        <th>更新时间</th>
                        <th>创建时间</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in passwordList" :key="index"
                        @contextmenu="handleRightClick($event, item)">
                        <td :data-matched="item?._matches?.username">{{ item?.username }}</td>
                        <td :data-matched="item?._matches?.password">{{ item?.password }}</td>
                        <td :data-matched="item?._matches?.url">{{ item?.url }}</td>
                        <td :data-matched="item?._matches?.remark">{{ item?.remark }}</td>
                        <td :data-matched="item?._matches?.updateTime">{{ item?.updateTime }}</td>
                        <td :data-matched="item?._matches?.createTime">{{ item?.createTime }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="contextMenuVisible" class="context-menu" :style="{
                left: `${contextMenuPosition.x}px`,
                top: `${contextMenuPosition.y}px`
            }" @click.stop>
            <div class="menu-item" @click="deletePassword">删除</div>
            <div class="menu-item" @click="editPassword">编辑</div>
            <!-- <div class="menu-item" @click="copy">复制</div> -->
        </div>
    </div>
</template>

<style scoped>
.input-group {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

td[data-matched="true"] {
    background-color: #f5eb76;
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

.input-group label {
    margin-right: 10px;
    min-width: 60px;
    /* 为标签设置最小宽度保持对齐 */
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
}

.password-manager {
    margin: 0 auto;
    padding: 20px;
}

.button-section {
    display: flex;
    justify-content: space-between; /* 左右两端对齐 */
    align-items: center;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 5px;
}

.buttons-left {
    display: flex;
    gap: 10px; /* 按钮之间的间距 */
}

.search-input-wrapper {
    position: relative;
    /* 不需要额外设置，会自动靠右 */
}

.search-container {
    display: flex;
    margin-left: auto;
    /* 将搜索区域推到最右边 */
}

.search-container input {
    padding: 8px 32px 8px 12px;
    width: 200px;
    border: 1px solid #ddd;
    border-radius: 4px;
}
.search-icon-button {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
}
.search-icon {
    width: 16px;
    height: 16px;
    object-fit: contain;
}
.search-icon:hover  {
    background-color: #f5f5f5;
}

.button2 {
    width: 90px;
    height: 40px;
    background-color: #0067c8;
    padding: 8px 15px;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
.button2:hover {
    background-color: #004a92;
}

.add-password-window {
    margin-top: 10px;
}

.button-section button:not(:last-child) {
    margin-right: 20px;
}

input {
    display: block;
    width: 100%;
    margin-bottom: 10px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.button0 {
    width: 90px;
    height: 40px;
    padding: 8px 15px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.button0:hover {
    background-color: #2f6e32;
}

.password-table {
    margin: 20px 0;
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

th,
td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    overflow: hidden;
    /* 隐藏溢出内容 */
    text-overflow: ellipsis;
    /* 显示省略号 */
    white-space: nowrap;
    /* 禁止换行 */
    max-width: 0;
    /* 允许单元格收缩 */
}

th:nth-child(1),
td:nth-child(1) {
    width: 15%;
}

/* 用户名 */
th:nth-child(2),
td:nth-child(2) {
    width: 15%;
}

/* 密码 */
th:nth-child(3),
td:nth-child(3) {
    width: 10%;
}

/* 网址 */
th:nth-child(4),
td:nth-child(4) {
    width: 10%;
}

/* 备注 */
th:nth-child(5),
td:nth-child(5) {
    width: 10%;
}

/* 更新时间 */
th:nth-child(6),
td:nth-child(6) {
    width: 10%;
}

/* 创建时间 */
th {
    background-color: #f2f2f2;
    font-weight: bold;
}

tr:hover {
    background-color: #f5f5f5;
}

td:hover {
    background-color: #d4d4d4;
}

.context-menu {
    position: fixed;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    min-width: 50px;
}

.menu-item {
    padding: 8px 12px;
    cursor: pointer;
}

.menu-item:hover {
    background-color: #f5f5f5;
}

.window-content h3 {
    margin-bottom: 15px;
    color: #333;
}
</style>