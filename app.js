let tasks = []

document.getElementById('addTask').addEventListener('click', () => {
    const taskText = document.getElementById('taskInput').value.trim()
    if(taskText) addTask(taskText)
})

function addTask(text){
    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    }

    tasks.push(newTask)
    saveTasks(tasks)
    renderTasks();
}

function renderTasks(){
    const taskList = document.getElementById('taskList')
    taskList.innerHTML = tasks.map(task => `
        <li class="${task.completed ? 'completed' : ''}">
            <input type="checkbox" ${task.completed ? 'checked' : ''}
                onchange = "toggleTask(${task.id})">
                ${task.text}
            <button onclick = "deleteTask(${task.id})">X</button>
        </li>        
        `).join('')
    }

function saveTasks(tasks){
     localStorage.setItem('tasks', JSON.stringify(tasks))
}

function loadTasks(){
    return JSON.parse(localStorage.getItem('tasks')) 
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
}

document.addEventListener('DOMContentLoaded', () => {
    tasks = loadTasks() || []
    renderTasks()
})
