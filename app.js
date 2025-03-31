let tasks = []
let draggedItem = null
const taskList = document.getElementById('taskList')

document.getElementById('addTask').addEventListener('click', () => {
    const taskText = document.getElementById('taskInput').value.trim()
    if(taskText) addTask(taskText)
})

function addTask(text){
    const priority = document.getElementById("taskPriority").value
    const newTask = {
        id: Date.now(),
        text,
        priority,
        completed: false
    }

    tasks.push(newTask)
    saveTasks(tasks)
    renderTasks()
}

function renderTasks(){
    taskList.innerHTML = tasks.map(task => `
        <li data-id="${task.id}" 
            draggable="true"
            class="${task.priority} ${task.completed ? 'completed' : ''}"
            ondragstart="handleDragStart(event)"
            ondragover="handleDragOver(event)"
            ondrop="handleDrop(event)">
            <input type="checkbox" ${task.completed ? 'checked' : ''}
                onchange="toggleTask(${task.id})">
                ${task.text}
            <span class="priority-label">(${task.priority})</span>    
            <button onclick="deleteTask(${task.id})">X</button>
        </li>        
    `).join('')
}

function saveTasks(tasks){
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function loadTasks(){
    return JSON.parse(localStorage.getItem('tasks')) || []
}

function deleteTask(id){
    tasks = tasks.filter(task => task.id !== id)
    saveTasks(tasks)
    renderTasks()
}

function toggleTask(id){
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    )
    saveTasks(tasks)
    renderTasks()
}

// Funções de Drag and Drop
function handleDragStart(e) {
    draggedItem = e.target
    e.target.classList.add('dragging')
    e.dataTransfer.setData('text/plain', e.target.dataset.id)
    e.dataTransfer.effectAllowed = 'move'
}

function handleDragOver(e){
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    const targetItem = e.target.closest('li')

    if(targetItem && targetItem !== draggedItem){
        const rect = targetItem.getBoundingClientRect()
        const next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5
        taskList.insertBefore(
            draggedItem,
            next ? targetItem.nextSibling : targetItem
        )
    }
}

function handleDrop(e) {
    e.preventDefault()
    const targetItem = e.target.closest('li')

    if(targetItem && draggedItem !== targetItem){
        const draggedId = parseInt(draggedItem.dataset.id)
        const targetId = parseInt(targetItem.dataset.id)

        const draggedIndex = tasks.findIndex(task => task.id === draggedId)
        const targetIndex = tasks.findIndex(task => task.id === targetId)

        if(draggedIndex !== -1 && targetIndex !== -1){
            const [removed] = tasks.splice(draggedIndex, 1)
            tasks.splice(targetIndex, 0, removed)
            saveTasks(tasks)
        }
    }
    draggedItem.classList.remove('dragging')
    draggedItem = null
}

function handleDragEnd(){
    if(draggedItem){
        draggedItem.classList.remove('dragging')
        draggedItem = null
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    tasks = loadTasks()
    renderTasks()

    taskList.addEventListener('dragover', handleDragOver)
    taskList.addEventListener('drop', handleDrop)
    taskList.addEventListener('dragend', handleDragEnd)
})