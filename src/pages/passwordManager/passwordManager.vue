<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import {
    insertPassword,
    getPasswords,
    deletePassword as deletePasswordApi,
    updatePassword as updatePasswordApi,
    importFromTxtFile,
    insertPasswordFromTextFile,
    exportToTxtFile,
    writeToClipboardApi,
    pasteApi,
    incrementUsageCountApi
    // writeToClipboard
} from "./index";

const passwordList = ref<any[]>([]);
const newPassword = ref({
    username: "",
    password: "",
    url: "",
    remark: "",
});
const promptMessage = ref("hello world!");
const showAddPasswordWindow = ref(false);
const contextMenuVisible = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });
const passwordMenuVisible = ref(false);
const searchMenuVisible = ref(false);
const passwordMenuPosition = ref({ x: 0, y: 0 });
const selectedPassword = ref<any>(null);
const isEditing = ref(false);
const selectedField = ref("");
const openAddPasswordWindow = () => {
    showAddPasswordWindow.value = true;
    isEditing.value = false;
};
const loadPasswords = async function () {
    try {
        const passwords = await getPasswords();
        // 先按 numberOfUses 降序，再按 updateTime 降序
        passwordList.value = (passwords || []).sort(function (
            a: { numberOfUses: number; updateTime: string },
            b: { numberOfUses: number; updateTime: string }
        ) {
            const usesA = a.numberOfUses ?? 0;
            const usesB = b.numberOfUses ?? 0;

            if (usesB !== usesA) {
                return usesB - usesA; // 按使用次数降序
            }

            // 如果使用次数相等，则按更新时间降序
            const timeA = new Date(a.updateTime).getTime();
            const timeB = new Date(b.updateTime).getTime();
            return timeB - timeA;
        });

        originalPasswordList.value = [...passwordList.value];
        searchKeyword.value = "";
    } catch (error) {
        console.error("加载密码失败:", error);
        passwordList.value = [];
        originalPasswordList.value = [];
    }
};

const handleMouseOver = (password: any, field: string) => {
    promptMessage.value = `${password[field] || "无内容"}`;
};
const handleMouseOut = () => {
    promptMessage.value = "";
};
const handlePasswordRightClick = (event: MouseEvent) => {
    event.preventDefault();
    passwordMenuPosition.value = {
        x: event.clientX,
        y: event.clientY,
    };
    passwordMenuVisible.value = true;
};
const handleSearchRightClick = (event: MouseEvent) => {
    event.preventDefault();
    passwordMenuPosition.value = {
        x: event.clientX,
        y: event.clientY,
    };
    searchMenuVisible.value = true;
};
const addPassword = async () => {
    try {
        if (isEditing.value && selectedPassword.value?.id) {
            await updatePasswordApi(
                selectedPassword.value.id, // 第一个参数：id
                {
                    // 第二个参数：passwordData
                    ...newPassword.value,
                    updateTime: undefined, // 让后端生成更新时间
                }
            );
            promptMessage.value = "密码更新成功";
            console.log("密码更新成功");
        } else {
            await insertPassword(newPassword.value);
            promptMessage.value = "密码添加成功";
            console.log("密码添加成功");
        }

        newPassword.value = { username: "", password: "", url: "", remark: "" };
        showAddPasswordWindow.value = false;
        selectedPassword.value = null;
        await loadPasswords();
    } catch (error) {
        console.error("操作失败:", error);
    }
};

const handleRightClick = (event: MouseEvent, password: any, field: string) => {
    event.preventDefault();
    selectedPassword.value = password;
    selectedField.value = field;
    contextMenuPosition.value = {
        x: event.clientX,
        y: event.clientY,
    };
    contextMenuVisible.value = true;
};

const clearContent = () => {
    newPassword.value = { username: "", password: "", url: "", remark: "" };
};

const handleCancel = () => {
    clearContent();
    showAddPasswordWindow.value = false;
    selectedPassword.value = null;
    promptMessage.value = "取消编辑成功";
};

const deletePassword = async () => {
    if (!selectedPassword.value) return;
    if (!confirm(`确定要删除 url: ${selectedPassword.value.url} 的记录吗？`)) {
        return;
    }
    try {
        await deletePasswordApi(selectedPassword.value.id);
        promptMessage.value = "删除成功";
        await loadPasswords();
    } catch (error) {
        console.error("删除失败:", error);
    } finally {
        contextMenuVisible.value = false;
    }
};

const randomPassword = () => {
    const length = 12; // 密码长度
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    // const specials = "!@#$%^&*()_+";
    const specials = "!@";
    // 确保每种类型至少有一个字符
    let password = [
        lowercase[Math.floor(Math.random() * lowercase.length)],
        uppercase[Math.floor(Math.random() * uppercase.length)],
        numbers[Math.floor(Math.random() * numbers.length)],
        specials[Math.floor(Math.random() * specials.length)],
    ].join("");

    // 剩余字符从所有字符集中随机选择
    const allChars = lowercase + uppercase + numbers + specials;
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // 打乱字符顺序
    password = password
        .split("")
        .sort(() => 0.5 - Math.random())
        .join("");

    newPassword.value.password = password;
    passwordMenuVisible.value = false;
    return password;
};

const pasteToSearch = async () => {
    try {
        const text = await pasteApi();
        if (text) {
            searchKeyword.value = text;
            search();
        }
        searchMenuVisible.value = false;
    } catch (error) {
        console.error("粘贴失败:", error);
        promptMessage.value = "粘贴失败";
    }
};

const handleClick = async () => {
    if (searchKeyword.value) {
        // 如果有内容，则清除
        searchKeyword.value = '';
        search();
    } else {
        pasteToSearch();
    }
};



const clearSearch = async () => {
    searchKeyword.value = "";
    search();
    searchMenuVisible.value = false;
}
const editPassword = () => {
    if (!selectedPassword.value) return;

    newPassword.value = { ...selectedPassword.value };
    showAddPasswordWindow.value = true;
    isEditing.value = true;
    contextMenuVisible.value = false;
};
const copyContent = async () => {
    if (!selectedPassword.value || !selectedField.value) return;
    try {
        const fieldValue = selectedPassword.value[selectedField.value];
        await writeToClipboardApi(fieldValue);
        contextMenuVisible.value = false;
        promptMessage.value = `${fieldValue} 已复制到剪贴板`;

    } catch (error) {
        console.error("复制失败:", error);
        alert("复制失败");
    }
};
const copyByClick = async (password: any, field: string , id:number) => {
    try {
        const value = String(password[field]);
        await writeToClipboardApi(value);
        promptMessage.value = `${value} 已复制到剪贴板`;
        console.log(id);
        await incrementUsageCountApi(id)
        await loadPasswords();
    } catch (error) {
        console.error("复制失败:", error);
        alert("复制失败");
    }
};
const exportPassword = async () => {
    try {
        // 1. 使用showSaveDialog而不是showOpenDialog
        const { filePath } = await (window as any).api.showSaveDialog({
            title: "保存密码记录",
            filters: [{ name: "Text Files", extensions: ["txt"] }],
        });

        if (!filePath) return;

        let content = "";
        passwordList.value.forEach((password) => {
            content +=
                [
                    password.username,
                    password.password,
                    password.url,
                    password.remark,
                    password.numberOfUses,
                    password.updateTime,
                    password.createTime,
                ].join("\t") + "\n";
        });
        exportToTxtFile(filePath, content);
        promptMessage.value = "导出成功";
    } catch (error) {
        console.error("导出失败:", error);
        alert("导出失败");
    } finally {
        contextMenuVisible.value = false;
    }
};

const handleClickOutside = () => {
    contextMenuVisible.value = false;
};

const importFromTxt = async () => {
    try {
        // 1. 打开文件选择对话框
        const { filePaths } = await (window as any).api.showOpenDialog({
            properties: ["openFile"],
            filters: [{ name: "Text Files", extensions: ["txt"] }],
        });

        if (!filePaths || filePaths.length === 0) return;

        // 2. 读取文件内容
        const fileContent = await importFromTxtFile(filePaths[0]);
        const lines = fileContent.split("\n").filter((line: string) => line.trim());

        // 3. 解析并导入每条记录
        let successCount = 0;
        for (const [index, line] of lines.entries()) {
            try {
                // 严格检查每行必须有6个字段
                const fields = line.split("\t").map((f: String) => f.trim());
                if (fields.length !== 6) {
                    console.error(
                        `第${index + 1}行格式错误: 应有6个字段，实际得到${fields.length}个`
                    );
                    continue;
                }

                const [username, password, url, remark, updateTime, createTime] = fields;

                await insertPasswordFromTextFile({
                    username: username || "",
                    password: password || "",
                    url: url || "",
                    remark: remark || "from text",
                    updateTime: updateTime ? updateTime : "",
                    createTime: createTime ? createTime : "",
                });
                successCount++;
            } catch (error) {
                console.error(`导入第${index + 1}行失败:`, error);
            }
        }

        // 4. 刷新列表并显示结果
        await loadPasswords();
        promptMessage.value = `成功导入 ${successCount}/${lines.length} 条记录`;
    } catch (error) {
        console.error("导入失败:", error);
        alert("导入失败，请检查文件格式。确保使用制表符分隔字段，每行包含6个字段。");
    }
};

const searchKeyword = ref(""); // 添加搜索关键词
const originalPasswordList = ref<any[]>([]); // 保存原始数据

// 添加搜索函数
const search = () => {
    const keyword = searchKeyword.value.trim().toLowerCase();

    if (!keyword) {
        passwordList.value = [...originalPasswordList.value];
        return;
    }

    passwordList.value = originalPasswordList.value
        .map((item) => {
            const matches = {
                username: item.username?.toLowerCase().includes(keyword),
                password: item.password?.toLowerCase().includes(keyword),
                url: item.url?.toLowerCase().includes(keyword),
                remark: item.remark?.toLowerCase().includes(keyword),
                numberOfUses: item.numberOfUses?.toLowerCase().includes(keyword),
                updateTime: item.updateTime?.toLowerCase().includes(keyword),
                createTime: item.createTime?.toLowerCase().includes(keyword),
            };

            return {
                ...item,
                _matches: matches,
                _isMatched: Object.values(matches).some(Boolean),
            };
        })
        .filter((item) => item._isMatched);
};
onMounted(() => {
    loadPasswords();
    document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
});


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
                    <button @click="addPassword" class="button2">
                        {{ isEditing ? "更新" : "添加" }}
                    </button>
                </template>
                <button class="button0" @click="importFromTxt">txt导入</button>
                <button class="button0" @click="exportPassword">导出txt</button>
            </div>
            <div class="search-input-wrapper">
                <input type="text" v-model="searchKeyword" placeholder="输入关键词搜索" @input="search"
                    @contextmenu.prevent="handleSearchRightClick" @click=handleClick() />
            </div>
        </div>
        <div class="add-password-window" v-if="showAddPasswordWindow">
            <div class="window-content">
                <h3>{{ isEditing ? "编辑密码" : "添加新密码" }}</h3>
                <div class="input-group">
                    <label for="username">用户名</label>
                    <input id="username" type="text" v-model="newPassword.username" placeholder="请输入用户名" />
                </div>
                <div class="input-group">
                    <label for="password">密码</label>
                    <input id="password" type="text" v-model="newPassword.password" placeholder="请输入密码"
                        @contextmenu.prevent="handlePasswordRightClick" />
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
                        <th>使用次数</th>
                        <th>更新时间</th>
                        <th>创建时间</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in passwordList" :key="index">
                        <td @mouseover="handleMouseOver(item, 'username')" @mouseout="handleMouseOut"
                            :data-matched="item?._matches?.username" data-field="username"
                            @contextmenu="handleRightClick($event, item, 'username')"
                            @click="copyByClick(item, 'username',item.id)">
                            {{ item?.username }}
                        </td>
                        <td @mouseover="handleMouseOver(item, 'password')" @mouseout="handleMouseOut"
                            :data-matched="item?._matches?.password" data-field="password"
                            @contextmenu="handleRightClick($event, item, 'password')"
                            @click="copyByClick(item, 'password',item.id)">
                            {{ item?.password }}
                        </td>
                        <td :data-matched="item?._matches?.url" data-field="url"
                            @contextmenu="handleRightClick($event, item, 'url')"
                            @click="copyByClick(item, 'url',item.id)" 
                            @mouseover="handleMouseOver(item, 'url')"
                            @mouseout="handleMouseOut">
                            {{ item?.url }}
                        </td>
                        <td :data-matched="item?._matches?.remark" data-field="remark"
                            @contextmenu="handleRightClick($event, item, 'remark')"
                            @click="copyByClick(item, 'remark',item.id)" 
                            @mouseover="handleMouseOver(item, 'remark')"
                            @mouseout="handleMouseOut">
                            {{ item?.remark }}
                        </td>
                        <td :data-matched="item?._matches?.numberOfUses" data-field="numberOfUses"
                            @contextmenu="handleRightClick($event, item, 'numberOfUses')"
                            @click="copyByClick(item, 'numberOfUses',item.id)" 
                            @mouseover="handleMouseOver(item, 'numberOfUses')"
                            @mouseout="handleMouseOut">
                            {{ item?.numberOfUses }}
                        </td>
                        <td :data-matched="item?._matches?.updateTime" data-field="updateTime"
                            @contextmenu="handleRightClick($event, item, 'updateTime')"
                            @click="copyByClick(item, 'updateTime',item.id)"
                            @mouseover="handleMouseOver(item, 'updateTime')"
                            @mouseout="handleMouseOut">
                            {{ item?.updateTime }}
                        </td>
                        <td :data-matched="item?._matches?.createTime" data-field="createTime"
                            @contextmenu="handleRightClick($event, item, 'createTime')"
                            @click="copyByClick(item, 'createTime',item.id)"
                            @mouseover="handleMouseOver(item, 'createTime')" @mouseout="handleMouseOut">
                            {{ item?.createTime }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="contextMenuVisible" class="context-menu" :style="{
            left: `${contextMenuPosition.x}px`,
            top: `${contextMenuPosition.y}px`,
        }" @click.stop>
            <div class="menu-item" @click="deletePassword">删除</div>
            <div class="menu-item" @click="editPassword">编辑</div>
            <div class="menu-item" @click="copyContent">复制</div>
        </div>
        <div v-if="passwordMenuVisible" class="context-menu" :style="{
            left: `${passwordMenuPosition.x}px`,
            top: `${passwordMenuPosition.y}px`,
        }" @click.stop>
            <div class="menu-item" @click="randomPassword">随机</div>
        </div>
        <div v-if="searchMenuVisible" class="context-menu" :style="{
            left: `${passwordMenuPosition.x}px`,
            top: `${passwordMenuPosition.y}px`,
        }" @click.stop>
            <div class="menu-item" @click="pasteToSearch">粘贴</div>
            <div class="menu-item" @click="clearSearch">清空</div>
        </div>
    </div>
    <div id="promptBar">
        {{ promptMessage }}
    </div>
</template>

<style scoped src="./ymain.css"></style>
