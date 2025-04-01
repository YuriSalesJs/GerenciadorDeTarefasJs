let tasks = []
let draggedItemId = null
let dropPosition = null
const taskList = document.getElementById('taskList')

function init() {
    loadTasks()
    setupEventListeners()
}

function loadTasks() {
    try {
        const savedTasks = localStorage.getItem('tasks')
        if (savedTasks) {
            tasks = JSON.parse(savedTasks)
            console.log('Tarefas carregadas:', tasks)
        }
        renderTasks()
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error)
        tasks = []
    }
}

function setupEventListeners() {
    document.getElementById('addTask').addEventListener('click', () => {
        const taskText = document.getElementById('taskInput').value.trim()
        if(taskText) addTask(taskText)
    })

    taskList.addEventListener('dragover', handleDragOver)
    taskList.addEventListener('dragleave', handleDragLeave)
    taskList.addEventListener('drop', handleDrop)
}

function addTask(text) {
    const priority = document.getElementById("taskPriority").value
    const newTask = {
        id: Date.now(),
        text,
        priority,
        completed: false
    }

    tasks.push(newTask)
    saveTasks()
    renderTasks()
    document.getElementById('taskInput').value = ''
}

function renderTasks() {
    taskList.innerHTML = tasks.map(task => `
        <li data-id="${task.id}"
            draggable="true"
            class="task-item ${task.priority} ${task.completed ? 'completed' : ''}"
            ondragstart="handleDragStart(event)">
            <input type="checkbox" ${task.completed ? 'checked' : ''}
                onchange="toggleTask(${task.id})">
            <span class="task-text">${task.text}</span>
            <span class="priority-label">(${task.priority})</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">X</button>
        </li>
    `).join('')
}

function saveTasks() {
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks))
        console.log('Tarefas salvas com sucesso:', tasks)
        return true
    } catch (error) {
        console.error('Erro ao salvar tarefas:', error)
        setTimeout(() => saveTasks(), 100)
        return false
    }
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id)
    saveTasks()
    renderTasks()
}

function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    )
    saveTasks()
    renderTasks()
}

function handleDragStart(e) {
    draggedItemId = parseInt(e.target.dataset.id)
    e.target.classList.add('dragging')
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', draggedItemId)
}

function handleDragOver(e) {
    e.preventDefault()
    const targetItem = e.target.closest('li')
    if (targetItem) {
        dropTargetId = parseInt(targetItem.dataset.id)
        e.dataTransfer.dropEffect = 'move'
        
        const rect = targetItem.getBoundingClientRect()
        const next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5
        targetItem.classList.toggle('drop-above', !next)
        targetItem.classList.toggle('drop-below', next)
    }
}

function handleDragLeave(e) {
    if (!e.target.closest('li')) {
        document.querySelectorAll('.drop-above, .drop-below').forEach(el => {
            el.classList.remove('drop-above', 'drop-below')
        })
    }
}

function handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()

    const targetItem = e.target.closest('li')
    if (!targetItem || !draggedItemId) return

    dropTargetId = parseInt(targetItem.dataset.id)
    if (isNaN(dropTargetId)) return

    const draggedIndex = tasks.findIndex(t => t.id === draggedItemId)
    const targetIndex = tasks.findIndex(t => t.id === dropTargetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newTasks = [...tasks]
    const [movedTask] = newTasks.splice(draggedIndex, 1)
    
    const adjustedTargetIndex = draggedIndex < targetIndex ? targetIndex : targetIndex + 1
    newTasks.splice(adjustedTargetIndex, 0, movedTask)

    tasks = newTasks
    saveTasks()
    renderTasks()
    
    resetDragState()
}

function resetDragState() {
    document.querySelectorAll('.drop-above, .drop-below').forEach(el => {
        el.classList.remove('drop-above', 'drop-below')
    })
    draggedItemId = null
    dropTargetId = null
}

document.addEventListener('DOMContentLoaded', init)