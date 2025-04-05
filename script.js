// Elementos do DOM
const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');

// Carregar tarefas do localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Atualizar estatísticas
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    totalTasksSpan.textContent = `${total} tarefa${total !== 1 ? 's' : ''}`;
    completedTasksSpan.textContent = `${completed} completada${completed !== 1 ? 's' : ''}`;
}

// Criar elemento de tarefa
function createTaskElement(task) {
    const li = document.createElement('li');
    if (task.completed) {
        li.classList.add('completed');
    }

    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;

    const taskActions = document.createElement('div');
    taskActions.className = 'task-actions';

    const completeButton = document.createElement('button');
    completeButton.className = 'complete-btn';
    completeButton.setAttribute('aria-label', task.completed ? 'Desfazer tarefa' : 'Completar tarefa');
    completeButton.innerHTML = `<i class="fas ${task.completed ? 'fa-undo' : 'fa-check-circle'}"></i>`;
    completeButton.onclick = () => toggleTask(task.id);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.setAttribute('aria-label', 'Remover tarefa');
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteButton.onclick = () => removeTask(task.id);

    taskActions.appendChild(completeButton);
    taskActions.appendChild(deleteButton);

    li.appendChild(taskText);
    li.appendChild(taskActions);
    return li;
}

// Adicionar nova tarefa
function addTask() {
    const text = taskInput.value.trim();
    if (text) {
        const task = {
            id: Date.now(),
            text,
            completed: false
        };
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskList.appendChild(createTaskElement(task));
        taskInput.value = '';
        updateStats();
    }
}

// Alternar estado de conclusão da tarefa
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    updateStats();
}

// Remover tarefa
function removeTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    updateStats();
}

// Renderizar todas as tarefas
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        taskList.appendChild(createTaskElement(task));
    });
}

// Event Listeners
addButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Inicialização
renderTasks();
updateStats(); 