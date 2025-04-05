// Elementos do DOM
const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');
const deletedTasksSpan = document.getElementById('deletedTasks');

// Elementos de histórico
const showTotalBtn = document.getElementById('showTotalBtn');
const showCompletedBtn = document.getElementById('showCompletedBtn');
const showDeletedBtn = document.getElementById('showDeletedBtn');

const totalHistoryContainer = document.getElementById('totalHistoryContainer');
const completedHistoryContainer = document.getElementById('completedHistoryContainer');
const deletedHistoryContainer = document.getElementById('deletedHistoryContainer');

const totalHistoryList = document.getElementById('totalHistoryList');
const completedHistoryList = document.getElementById('completedHistoryList');
const deletedHistoryList = document.getElementById('deletedHistoryList');

// Carregar tarefas e histórico do localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let deletedTasks = JSON.parse(localStorage.getItem('deletedTasks')) || [];

// Controle de visibilidade dos históricos
function toggleHistory(container, button) {
    const isVisible = container.classList.contains('visible');
    container.classList.toggle('visible');
    button.classList.toggle('active');
    return !isVisible;
}

// Event listeners para os botões de histórico
showTotalBtn.addEventListener('click', () => {
    if (toggleHistory(totalHistoryContainer, showTotalBtn)) {
        updateTotalHistoryList();
    }
});

showCompletedBtn.addEventListener('click', () => {
    if (toggleHistory(completedHistoryContainer, showCompletedBtn)) {
        updateCompletedHistoryList();
    }
});

showDeletedBtn.addEventListener('click', () => {
    if (toggleHistory(deletedHistoryContainer, showDeletedBtn)) {
        updateDeletedHistoryList();
    }
});

// Atualizar histórico de todas as notas
function updateTotalHistoryList() {
    totalHistoryList.innerHTML = '';
    
    if (tasks.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'empty-history';
        emptyMessage.textContent = 'Nenhuma nota';
        totalHistoryList.appendChild(emptyMessage);
        return;
    }
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'history-item';
        
        const taskText = document.createElement('span');
        taskText.className = 'history-text';
        taskText.textContent = task.text;
        
        const taskTime = document.createElement('span');
        taskTime.className = 'history-time';
        const timeAgo = task.createdAt ? getTimeAgo(new Date(task.createdAt).getTime()) : 'data desconhecida';
        taskTime.textContent = `Criada ${timeAgo}`;
        
        li.appendChild(taskText);
        li.appendChild(taskTime);
        
        totalHistoryList.appendChild(li);
    });
}

// Atualizar histórico de notas concluídas
function updateCompletedHistoryList() {
    completedHistoryList.innerHTML = '';
    
    const completedTasks = tasks.filter(task => task.completed);
    
    if (completedTasks.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'empty-history';
        emptyMessage.textContent = 'Nenhuma nota concluída';
        completedHistoryList.appendChild(emptyMessage);
        return;
    }
    
    completedTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'history-item';
        
        const taskText = document.createElement('span');
        taskText.className = 'history-text';
        taskText.textContent = task.text;
        
        const taskTime = document.createElement('span');
        taskTime.className = 'history-time';
        const timeAgo = task.completedAt ? getTimeAgo(new Date(task.completedAt).getTime()) : 'data desconhecida';
        taskTime.textContent = `Concluída ${timeAgo}`;
        
        li.appendChild(taskText);
        li.appendChild(taskTime);
        
        completedHistoryList.appendChild(li);
    });
}

// Atualizar histórico de notas excluídas
function updateDeletedHistoryList() {
    deletedHistoryList.innerHTML = '';
    
    if (deletedTasks.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'empty-history';
        emptyMessage.textContent = 'Nenhuma nota excluída';
        deletedHistoryList.appendChild(emptyMessage);
        return;
    }
    
    deletedTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'history-item';
        
        const taskText = document.createElement('span');
        taskText.className = 'history-text';
        taskText.textContent = task.text;
        
        const taskTime = document.createElement('span');
        taskTime.className = 'history-time';
        const timeAgo = getTimeAgo(new Date(task.deletedAt).getTime());
        taskTime.textContent = `Excluída ${timeAgo}`;
        
        const restoreButton = document.createElement('button');
        restoreButton.className = 'restore-btn';
        restoreButton.setAttribute('aria-label', 'Restaurar nota');
        restoreButton.innerHTML = '<i class="fas fa-undo"></i>';
        restoreButton.addEventListener('click', () => restoreTask(task.id));
        
        li.appendChild(taskText);
        li.appendChild(taskTime);
        li.appendChild(restoreButton);
        
        deletedHistoryList.appendChild(li);
    });
}

// Adicionar nova tarefa
function addTask() {
    const text = taskInput.value.trim();
    if (text) {
        const task = {
            id: Date.now().toString(),
            text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        tasks.push(task);
        taskInput.value = '';
        
        renderTasks();
        updateStats();
        updateTotalHistoryList();
        saveToLocalStorage();
    }
}

// Alternar estado de conclusão da tarefa
function toggleTask(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        if (tasks[taskIndex].completed) {
            tasks[taskIndex].completedAt = new Date().toISOString();
        } else {
            delete tasks[taskIndex].completedAt;
        }
        renderTasks();
        updateStats();
        updateCompletedHistoryList();
        saveToLocalStorage();
    }
}

// Atualizar estatísticas
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const deleted = deletedTasks.length;
    
    totalTasksSpan.textContent = `${total} ${total === 1 ? 'nota' : 'notas'}`;
    completedTasksSpan.textContent = `${completed} ${completed === 1 ? 'concluída' : 'concluídas'}`;
    deletedTasksSpan.textContent = deleted === 0 ? '0 excluídas' : `${deleted} ${deleted === 1 ? 'excluída' : 'excluídas'}`;
    
    showDeletedBtn.style.display = 'inline-flex';
    
    if (deleted === 0 && deletedHistoryContainer.classList.contains('visible')) {
        toggleHistory(deletedHistoryContainer, showDeletedBtn);
    }
    
    saveToLocalStorage();
}

// Mover tarefa para cima
function moveTaskUp(id) {
    const index = tasks.findIndex(task => task.id === id);
    if (index > 0) {
        const currentElement = document.querySelector(`[data-id="${id}"]`);
        const targetElement = document.querySelector(`[data-id="${tasks[index - 1].id}"]`);
        
        if (currentElement && targetElement) {
            // Previne múltiplos cliques durante a animação
            if (currentElement.classList.contains('moving-up') || 
                currentElement.classList.contains('moving-down')) {
                return;
            }

            // Adiciona classes de animação
            currentElement.classList.add('moving-up');
            targetElement.classList.add('moving-down');
            
            // Remove event listeners temporariamente
            const clone = currentElement.cloneNode(true);
            currentElement.parentNode.replaceChild(clone, currentElement);
            
            setTimeout(() => {
                // Troca as posições no array
                const temp = tasks[index];
                tasks[index] = tasks[index - 1];
                tasks[index - 1] = temp;
                localStorage.setItem('tasks', JSON.stringify(tasks));
                
                // Renderiza novamente após a animação
                renderTasks(true);
            }, 300);
        }
    }
}

// Mover tarefa para baixo
function moveTaskDown(id) {
    const index = tasks.findIndex(task => task.id === id);
    if (index < tasks.length - 1) {
        const currentElement = document.querySelector(`[data-id="${id}"]`);
        const targetElement = document.querySelector(`[data-id="${tasks[index + 1].id}"]`);
        
        if (currentElement && targetElement) {
            // Previne múltiplos cliques durante a animação
            if (currentElement.classList.contains('moving-up') || 
                currentElement.classList.contains('moving-down')) {
                return;
            }

            // Adiciona classes de animação
            currentElement.classList.add('moving-down');
            targetElement.classList.add('moving-up');
            
            // Remove event listeners temporariamente
            const clone = currentElement.cloneNode(true);
            currentElement.parentNode.replaceChild(clone, currentElement);
            
            setTimeout(() => {
                // Troca as posições no array
                const temp = tasks[index];
                tasks[index] = tasks[index + 1];
                tasks[index + 1] = temp;
                localStorage.setItem('tasks', JSON.stringify(tasks));
                
                // Renderiza novamente após a animação
                renderTasks(true);
            }, 300);
        }
    }
}

// Criar elemento de tarefa
function createTaskElement(task, index) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = task.id;
    
    if (task.completed) {
        li.classList.add('completed');
    }

    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;

    const taskActions = document.createElement('div');
    taskActions.className = 'task-actions';

    // Botões de priorização
    const priorityActions = document.createElement('div');
    priorityActions.className = 'priority-actions';

    if (index > 0) {
        const moveUpButton = document.createElement('button');
        moveUpButton.className = 'priority-btn move-up-btn';
        moveUpButton.setAttribute('aria-label', 'Mover nota para cima');
        moveUpButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
        moveUpButton.addEventListener('click', () => moveTaskUp(task.id));
        priorityActions.appendChild(moveUpButton);
    }

    if (index < tasks.length - 1) {
        const moveDownButton = document.createElement('button');
        moveDownButton.className = 'priority-btn move-down-btn';
        moveDownButton.setAttribute('aria-label', 'Mover nota para baixo');
        moveDownButton.innerHTML = '<i class="fas fa-chevron-down"></i>';
        moveDownButton.addEventListener('click', () => moveTaskDown(task.id));
        priorityActions.appendChild(moveDownButton);
    }

    if (priorityActions.children.length > 0) {
        taskActions.appendChild(priorityActions);
    }

    const completeButton = document.createElement('button');
    completeButton.className = 'complete-btn';
    completeButton.setAttribute('aria-label', task.completed ? 'Desfazer nota' : 'Completar nota');
    completeButton.innerHTML = `<i class="fas ${task.completed ? 'fa-undo' : 'fa-check-circle'}"></i>`;
    completeButton.addEventListener('click', () => toggleTask(task.id));

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.setAttribute('aria-label', 'Remover nota');
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteButton.addEventListener('click', () => removeTask(task.id));

    taskActions.appendChild(completeButton);
    taskActions.appendChild(deleteButton);

    li.appendChild(taskText);
    li.appendChild(taskActions);
    
    return li;
}

// Remover tarefa
function removeTask(id) {
    const taskElement = document.querySelector(`[data-id="${id}"]`);
    if (taskElement) {
        const taskIndex = tasks.findIndex(task => task.id === id);
        
        if (taskIndex !== -1) {
            const taskToDelete = {...tasks[taskIndex]};
            taskToDelete.deletedAt = new Date().toISOString();
            
            // Adiciona a tarefa ao início do array de tarefas excluídas
            deletedTasks.unshift(taskToDelete);
            
            // Mantém apenas as últimas 30 tarefas excluídas
            if (deletedTasks.length > 30) {
                deletedTasks.pop();
            }
            
            // Remove a tarefa do array de tarefas ativas
            tasks.splice(taskIndex, 1);
            
            // Remove o elemento do DOM com animação
            taskElement.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                taskElement.remove();
                updateStats();
                updateDeletedHistoryList();
            }, 300);
        }
    }
}

// Restaurar tarefa excluída
function restoreTask(id) {
    const taskIndex = deletedTasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        const taskToRestore = deletedTasks[taskIndex];
        deletedTasks.splice(taskIndex, 1);
        
        // Remove a propriedade deletedAt
        delete taskToRestore.deletedAt;
        
        // Adiciona a tarefa de volta à lista ativa
        tasks.push(taskToRestore);
        
        // Atualiza a interface
        renderTasks();
        updateStats();
        updateDeletedHistoryList();
        
        // Se não houver mais tarefas excluídas, fecha o histórico
        if (deletedTasks.length === 0) {
            deletedHistoryContainer.classList.remove('visible');
        }
    }
}

// Função auxiliar para formatar o tempo
function getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    const intervals = {
        ano: 31536000,
        mês: 2592000,
        semana: 604800,
        dia: 86400,
        hora: 3600,
        minuto: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        
        if (interval >= 1) {
            return `há ${interval} ${unit}${interval > 1 ? (unit === 'mês' ? 'es' : 's') : ''}`;
        }
    }
    
    return 'agora mesmo';
}

// Renderizar todas as tarefas
function renderTasks(skipAnimation = false) {
    taskList.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    tasks.forEach((task, index) => {
        const taskElement = createTaskElement(task, index);
        if (skipAnimation) {
            taskElement.style.animation = 'none';
        }
        fragment.appendChild(taskElement);
    });
    
    taskList.appendChild(fragment);
}

// Salvar no localStorage
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('deletedTasks', JSON.stringify(deletedTasks));
}

// Event Listeners
addButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Renderizar tarefas iniciais
renderTasks();
renderDeletedTasks();
updateStats(); 

function moveTask(taskId, direction) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) return;
    
    if (direction === 'up' && taskIndex > 0) {
        [tasks[taskIndex], tasks[taskIndex - 1]] = [tasks[taskIndex - 1], tasks[taskIndex]];
    } else if (direction === 'down' && taskIndex < tasks.length - 1) {
        [tasks[taskIndex], tasks[taskIndex + 1]] = [tasks[taskIndex + 1], tasks[taskIndex]];
    }
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
} 