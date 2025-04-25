<script lang="ts" setup>
    import { ref } from 'vue'

    interface TodoItem {
        id: number
        text: string
        completed: boolean
    }

    const newTodo = ref('')
    const todos = ref<TodoItem[]>([])

    const addTodo = () => {
        if (newTodo.value.trim()) {
            todos.value.push({
                id: Date.now(),
                text: newTodo.value,
                completed: false
            })
            newTodo.value = ''
        }
    }

    const toggleTodo = (id: number) => {
        const todo = todos.value.find(t => t.id === id)
        if (todo) {
            todo.completed = !todo.completed
        }
    }

    const deleteTodo = (id: number) => {
        todos.value = todos.value.filter(t => t.id !== id)
    }

    const newForm = () => {
        const newWindow = window.open('', '_blank', 'width=400,height=300')
        if (newWindow) {
            newWindow.document.write(`
            <html>
                <head>
                <title>新待办事项</title>
                </head>
                <body>
                <h1>添加新待办事项</h1>
                <input type="text" id="newTodo" placeholder="输入待办事项" />
                <button onclick="saveTodo()">保存</button>
                </body>
            </html>
            `)
        }
        }
</script>

<template>
    <div class="todo-container">
        <h1>待办事项</h1>
        <div class="input-section">
            <input v-model="newTodo" placeholder="添加新任务" @keyup.enter="addTodo" />
            <button @click="addTodo">添加</button>
        </div>
        <div>
            <button @click="newForm">新窗口</button>
        </div>
        <ul class="todo-list">
            <li v-for="todo in todos" :key="todo.id" :class="{ completed: todo.completed }">
                <input type="checkbox" :checked="todo.completed" @change="toggleTodo(todo.id)" />
                <span>{{ todo.text }}</span>
                <button @click="deleteTodo(todo.id)">删除</button>
            </li>
        </ul>
    </div>
</template>
    
<style scoped src="./toDoList.css"></style>


