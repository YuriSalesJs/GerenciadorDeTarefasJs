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
    taskList.innerHTML = ''

    tasks.forEach(task => {
        const li = document.createElement('li')
        li.textContent = task.text
        taskList.appendChild(li)
    })
}

function saveTasks(tasks){
     localStorage.setItem('tasks', JSON.stringify(tasks))
}

function loadTasks(){
    return JSON.parse(localStorage.getItem('tasks')) 
}

document.addEventListener('DOMContentLoaded', () => {
    tasks = loadTasks() || []
    renderTasks()
})
