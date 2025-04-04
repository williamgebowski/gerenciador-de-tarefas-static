// Elementos do DOM
const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');

// Array para armazenar as tarefas
let tasks = [];

// Carrega as tarefas do localStorage ao iniciar
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
}

// Salva as tarefas no localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTaskCount();
}

// Atualiza o contador de tarefas
function updateTaskCount() {
    const count = tasks.length;
    taskCount.textContent = `${count} ${count === 1 ? 'tarefa' : 'tarefas'}`;
}

// Adiciona uma nova tarefa
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const task = {
            id: Date.now(),
            text: taskText
        };
        tasks.push(task);
        saveTasks();
        renderTasks();
        taskInput.value = '';
        taskInput.focus();
    }
}

// Remove uma tarefa
function removeTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Renderiza todas as tarefas
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'todo-item';
        taskElement.innerHTML = `
            <span>${task.text}</span>
            <button onclick="removeTask(${task.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        taskList.appendChild(taskElement);
    });
}

// Event Listeners
addButton.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Inicializa a aplicação
loadTasks(); 