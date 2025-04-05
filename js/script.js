// Elementos do DOM
const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const completedTasksSpan = document.getElementById('completedTasks');
const deletedTasksSpan = document.getElementById('deletedTasks');

// Elementos de histórico
const showCompletedBtn = document.getElementById('showCompletedBtn');
const showDeletedBtn = document.getElementById('showDeletedBtn');

const completedHistoryContainer = document.getElementById('completedHistoryContainer');
const deletedHistoryContainer = document.getElementById('deletedHistoryContainer');

const completedHistoryList = document.getElementById('completedHistoryList');
const deletedHistoryList = document.getElementById('deletedHistoryList');

// Verificar se todos os elementos foram encontrados
console.log('Elementos do DOM:', {
    taskInput,
    addButton,
    taskList,
    completedTasksSpan,
    deletedTasksSpan,
    showCompletedBtn,
    showDeletedBtn,
    completedHistoryContainer,
    deletedHistoryContainer,
    completedHistoryList,
    deletedHistoryList
});

// Arrays para armazenar as tarefas
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
let deletedTasks = JSON.parse(localStorage.getItem('deletedTasks')) || [];

console.log('Dados carregados:', { tasks, completedTasks, deletedTasks });

// Salvar no localStorage
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    localStorage.setItem('deletedTasks', JSON.stringify(deletedTasks));
}

// Função para formatar o tempo decorrido
function getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'agora mesmo';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    
    const days = Math.floor(hours / 24);
    if (days < 30) return `há ${days} ${days === 1 ? 'dia' : 'dias'}`;
    
    const months = Math.floor(days / 30);
    if (months < 12) return `há ${months} ${months === 1 ? 'mês' : 'meses'}`;
    
    const years = Math.floor(months / 12);
    return `há ${years} ${years === 1 ? 'ano' : 'anos'}`;
}

// Criar elemento de tarefa
function createTaskElement(task, isCompleted = false) {
    const li = document.createElement('li');
    li.className = 'task-item';
    
    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';
    
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;
    
    const taskTime = document.createElement('span');
    taskTime.className = 'task-time';
    taskTime.textContent = getTimeAgo(task.timestamp);
    
    const taskActions = document.createElement('div');
    taskActions.className = 'task-actions';
    
    if (!isCompleted) {
        const moveUpBtn = document.createElement('button');
        moveUpBtn.className = 'move-up-btn';
        moveUpBtn.innerHTML = '⬆️';
        moveUpBtn.title = 'Mover para cima';
        moveUpBtn.onclick = () => moveTaskUp(task.id);
        
        const moveDownBtn = document.createElement('button');
        moveDownBtn.className = 'move-down-btn';
        moveDownBtn.innerHTML = '⬇️';
        moveDownBtn.title = 'Mover para baixo';
        moveDownBtn.onclick = () => moveTaskDown(task.id);
        
        taskActions.appendChild(moveUpBtn);
        taskActions.appendChild(moveDownBtn);
    }
    
    const completeBtn = document.createElement('button');
    completeBtn.className = 'complete-btn';
    completeBtn.innerHTML = isCompleted ? '↩️' : '✅';
    completeBtn.title = isCompleted ? 'Desfazer' : 'Concluir';
    completeBtn.onclick = () => toggleTask(task.id);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.title = 'Excluir';
    deleteBtn.onclick = () => deleteTask(task.id);
    
    taskActions.appendChild(completeBtn);
    taskActions.appendChild(deleteBtn);
    
    taskContent.appendChild(taskText);
    taskContent.appendChild(taskTime);
    
    li.appendChild(taskContent);
    li.appendChild(taskActions);
    
    return li;
}

// Renderizar todas as tarefas
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
}

// Adicionar nova tarefa
function addTask(text) {
    if (!text.trim()) return;
    
    const task = {
        id: Date.now().toString(),
        text: text.trim(),
        timestamp: Date.now()
    };
    
    tasks.unshift(task);
    taskInput.value = '';
    
    renderTasks();
    updateStats();
    saveToLocalStorage();
}

// Alternar estado de conclusão da tarefa
function toggleTask(id) {
    let taskIndex = tasks.findIndex(task => task.id === id);
    let taskArray = tasks;
    let isCompleted = false;
    
    if (taskIndex === -1) {
        taskIndex = completedTasks.findIndex(task => task.id === id);
        taskArray = completedTasks;
        isCompleted = true;
    }
    
    if (taskIndex !== -1) {
        const task = taskArray[taskIndex];
        
        if (isCompleted) {
            completedTasks.splice(taskIndex, 1);
            tasks.unshift(task);
        } else {
            tasks.splice(taskIndex, 1);
            completedTasks.unshift(task);
        }
        
        renderTasks();
        updateCompletedHistoryList();
        updateStats();
        saveToLocalStorage();
    }
}

// Excluir tarefa
function deleteTask(id) {
    let taskIndex = tasks.findIndex(task => task.id === id);
    let taskArray = tasks;
    
    if (taskIndex === -1) {
        taskIndex = completedTasks.findIndex(task => task.id === id);
        taskArray = completedTasks;
    }
    
    if (taskIndex !== -1) {
        const task = taskArray[taskIndex];
        taskArray.splice(taskIndex, 1);
        deletedTasks.unshift(task);
        
        if (deletedTasks.length > 30) {
            deletedTasks.pop();
        }
        
        renderTasks();
        updateCompletedHistoryList();
        updateDeletedHistoryList();
        updateStats();
        saveToLocalStorage();
    }
}

// Atualizar histórico de notas concluídas
function updateCompletedHistoryList() {
    completedHistoryList.innerHTML = '';
    
    if (completedTasks.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'empty-history';
        emptyMessage.textContent = 'Nenhuma nota concluída';
        completedHistoryList.appendChild(emptyMessage);
        return;
    }
    
    completedTasks.forEach(task => {
        const taskElement = createTaskElement(task, true);
        completedHistoryList.appendChild(taskElement);
    });
}

// Atualizar histórico de notas excluídas
function updateDeletedHistoryList() {
    deletedHistoryList.innerHTML = '';
    
    if (deletedTasks.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'empty-history';
        emptyMessage.textContent = 'Lixeira vazia';
        deletedHistoryList.appendChild(emptyMessage);
        return;
    }
    
    deletedTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'history-item';
        
        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';
        
        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;
        
        const taskTime = document.createElement('span');
        taskTime.className = 'history-time';
        taskTime.textContent = getTimeAgo(task.timestamp);
        
        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';
        
        const restoreBtn = document.createElement('button');
        restoreBtn.className = 'restore-btn';
        restoreBtn.innerHTML = '↩️';
        restoreBtn.title = 'Restaurar';
        restoreBtn.onclick = () => restoreTask(task.id);
        
        const deletePermanentBtn = document.createElement('button');
        deletePermanentBtn.className = 'delete-permanent-btn';
        deletePermanentBtn.innerHTML = '🗑️';
        deletePermanentBtn.title = 'Excluir permanentemente';
        deletePermanentBtn.onclick = () => deletePermanently(task.id);
        
        taskActions.appendChild(restoreBtn);
        taskActions.appendChild(deletePermanentBtn);
        
        taskContent.appendChild(taskText);
        taskContent.appendChild(taskTime);
        
        li.appendChild(taskContent);
        li.appendChild(taskActions);
        
        deletedHistoryList.appendChild(li);
    });
}

// Restaurar tarefa excluída
function restoreTask(id) {
    const taskIndex = deletedTasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        const task = deletedTasks[taskIndex];
        deletedTasks.splice(taskIndex, 1);
        tasks.unshift(task);
        
        renderTasks();
        updateDeletedHistoryList();
        updateStats();
        saveToLocalStorage();
    }
}

// Excluir permanentemente
function deletePermanently(id) {
    const taskIndex = deletedTasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        deletedTasks.splice(taskIndex, 1);
        updateDeletedHistoryList();
        updateStats();
        saveToLocalStorage();
    }
}

// Atualizar estatísticas
function updateStats() {
    completedTasksSpan.textContent = completedTasks.length;
    deletedTasksSpan.textContent = deletedTasks.length;
}

// Controle de visibilidade dos históricos
function toggleHistoryContainer(button, container) {
    const isVisible = container.classList.contains('visible');
    const icon = button.querySelector('i');
    
    if (isVisible) {
        container.classList.remove('visible');
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    } else {
        container.classList.add('visible');
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Adicionar tarefa
    addButton.addEventListener('click', () => {
        addTask(taskInput.value);
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(taskInput.value);
        }
    });

    // Toggle history containers
    showCompletedBtn.addEventListener('click', () => {
        toggleHistoryContainer(showCompletedBtn, completedHistoryContainer);
    });

    showDeletedBtn.addEventListener('click', () => {
        toggleHistoryContainer(showDeletedBtn, deletedHistoryContainer);
    });

    // Inicialização
    renderTasks();
    updateCompletedHistoryList();
    updateDeletedHistoryList();
    updateStats();
});

// Funções para mover tarefas
function moveTaskUp(taskId) {
    const index = tasks.findIndex(task => task.id === taskId);
    if (index > 0) {
        const temp = tasks[index];
        tasks[index] = tasks[index - 1];
        tasks[index - 1] = temp;
        renderTasks();
        saveToLocalStorage();
    }
}

function moveTaskDown(taskId) {
    const index = tasks.findIndex(task => task.id === taskId);
    if (index < tasks.length - 1) {
        const temp = tasks[index];
        tasks[index] = tasks[index + 1];
        tasks[index + 1] = temp;
        renderTasks();
        saveToLocalStorage();
    }
} 