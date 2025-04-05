// Elementos do DOM
const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');

// Array para armazenar as tarefas
let tasks = [];

// Carrega as tarefas do localStorage ao iniciar
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
        updateStats();
    }
}

// Salva as tarefas no localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateStats();
}

// Atualiza as estatísticas
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    totalTasksSpan.textContent = `${total} ${total === 1 ? 'tarefa' : 'tarefas'}`;
    completedTasksSpan.textContent = `${completed} ${completed === 1 ? 'completada' : 'completadas'}`;
}

// Adiciona uma nova tarefa
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false
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

// Alterna o estado de conclusão de uma tarefa
function toggleTask(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

// Renderiza todas as tarefas
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
}

// Cria um elemento de tarefa
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    if (task.completed) {
        li.classList.add('completed');
    }
    
    const taskSpan = document.createElement('span');
    taskSpan.className = 'task-text';
    taskSpan.textContent = task.text;
    
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-actions';
    
    const completeBtn = document.createElement('button');
    completeBtn.className = 'complete-btn';
    completeBtn.setAttribute('aria-label', task.completed ? 'Desfazer conclusão' : 'Concluir tarefa');
    completeBtn.innerHTML = '<i class="fas fa-check"></i>';
    completeBtn.addEventListener('click', () => toggleTask(task.id));
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.setAttribute('aria-label', 'Remover tarefa');
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.addEventListener('click', () => removeTask(task.id));
    
    actionsDiv.appendChild(completeBtn);
    actionsDiv.appendChild(deleteBtn);
    
    li.appendChild(taskSpan);
    li.appendChild(actionsDiv);
    
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