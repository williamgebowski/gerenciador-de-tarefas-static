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
        tasks.push({ text: taskText, completed: false });
        renderTasks();
        taskInput.value = '';
        taskInput.focus();
        updateStats();
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
        const taskElement = createTaskElement(task.text);
        if (task.completed) {
            taskElement.classList.add('completed');
        }
        taskList.appendChild(taskElement);
    });
}

function createTaskElement(taskText) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    
    const taskSpan = document.createElement('span');
    taskSpan.className = 'task-text';
    taskSpan.textContent = taskText;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.setAttribute('aria-label', 'Remover tarefa');
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    
    deleteBtn.addEventListener('click', () => {
        li.remove();
        updateStats();
    });
    
    li.appendChild(taskSpan);
    li.appendChild(deleteBtn);
    
    return li;
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