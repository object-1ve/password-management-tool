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
    </div>
</template>
    
<style scoped src="./shortcuts.css"></style>


