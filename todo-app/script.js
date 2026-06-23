// ========== TASK MANAGER CLASS ==========
class TaskManager {
    constructor() {
        this.tasks = this.loadFromStorage() || [];
        this.currentFilter = 'todas';
        this.currentSort = 'data-desc';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.render();
        this.updateStats();
    }

    // ========== STORAGE FUNCTIONS ==========
    saveToStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadFromStorage() {
        const data = localStorage.getItem('tasks');
        return data ? JSON.parse(data) : null;
    }

    // ========== TASK OPERATIONS ==========
    addTask(text, priority = 'média', category = 'pessoal') {
        if (!text.trim()) {
            alert('Por favor, insira uma tarefa!');
            return;
        }

        const task = {
            id: Date.now(),
            text: text.trim(),
            completed: false,
            priority: priority,
            category: category,
            createdAt: new Date().toISOString(),
        };

        this.tasks.unshift(task);
        this.saveToStorage();
        this.render();
        this.updateStats();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveToStorage();
        this.render();
        this.updateStats();
    }

    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveToStorage();
            this.render();
            this.updateStats();
        }
    }

    editTask(id, newText) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.text = newText.trim();
            this.saveToStorage();
            this.render();
        }
    }

    clearCompleted() {
        if (confirm('Tem certeza que deseja limpar todas as tarefas concluídas?')) {
            this.tasks = this.tasks.filter(task => !task.completed);
            this.saveToStorage();
            this.render();
            this.updateStats();
        }
    }

    clearAll() {
        if (confirm('⚠️ Tem certeza? Todas as tarefas serão deletadas!')) {
            if (confirm('Esta ação é irreversível. Tem certeza?')) {
                this.tasks = [];
                this.saveToStorage();
                this.render();
                this.updateStats();
            }
        }
    }

    // ========== FILTERING & SORTING ==========
    getFilteredTasks() {
        let filtered = this.tasks;

        // Aplicar filtro
        if (this.currentFilter === 'ativas') {
            filtered = filtered.filter(task => !task.completed);
        } else if (this.currentFilter === 'concluídas') {
            filtered = filtered.filter(task => task.completed);
        }

        // Aplicar ordenação
        filtered = this.sortTasks(filtered);

        return filtered;
    }

    sortTasks(tasks) {
        const sortedTasks = [...tasks];

        switch (this.currentSort) {
            case 'data-asc':
                return sortedTasks.sort((a, b) => 
                    new Date(a.createdAt) - new Date(b.createdAt)
                );
            case 'data-desc':
                return sortedTasks.sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
            case 'prioridade':
                const priorityOrder = { alta: 1, média: 2, baixa: 3 };
                return sortedTasks.sort((a, b) => 
                    priorityOrder[a.priority] - priorityOrder[b.priority]
                );
            case 'categoria':
                return sortedTasks.sort((a, b) => 
                    a.category.localeCompare(b.category)
                );
            default:
                return sortedTasks;
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.render();
    }

    setSort(sort) {
        this.currentSort = sort;
        this.render();
    }

    // ========== RENDERING ==========
    render() {
        const tasksList = document.getElementById('tasksList');
        const emptyState = document.getElementById('emptyState');
        const filteredTasks = this.getFilteredTasks();

        tasksList.innerHTML = '';

        if (filteredTasks.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            filteredTasks.forEach(task => {
                tasksList.appendChild(this.createTaskElement(task));
            });
        }

        // Atualizar botões
        this.updateActionButtons();
    }

    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.id = `task-${task.id}`;

        const createdDate = new Date(task.createdAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        li.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''} 
                onchange="taskManager.toggleTask(${task.id})"
            >
            <div class="task-content">
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                <div class="task-meta">
                    <span class="task-priority priority-${task.priority}">${task.priority}</span>
                    <span class="task-category">${task.category}</span>
                    <span class="task-date">${createdDate}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-edit" onclick="taskManager.requestEditTask(${task.id})">✏️ Editar</button>
                <button class="btn-delete" onclick="taskManager.deleteTask(${task.id})">🗑️ Deletar</button>
            </div>
        `;

        return li;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    requestEditTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        const newText = prompt('Editar tarefa:', task.text);
        if (newText !== null) {
            this.editTask(id, newText);
        }
    }

    // ========== STATISTICS ==========
    updateStats() {
        const total = this.tasks.length;
        const active = this.tasks.filter(t => !t.completed).length;
        const completed = this.tasks.filter(t => t.completed).length;
        const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('activeTasks').textContent = active;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('completionRate').textContent = `${rate}%`;
    }

    updateActionButtons() {
        const clearCompletedBtn = document.getElementById('clearCompleted');
        const clearAllBtn = document.getElementById('clearAll');
        
        const hasCompleted = this.tasks.some(t => t.completed);
        clearCompletedBtn.disabled = !hasCompleted;

        const hasAny = this.tasks.length > 0;
        clearAllBtn.disabled = !hasAny;
    }

    // ========== EXPORT FUNCTIONALITY ==========
    exportTasks() {
        if (this.tasks.length === 0) {
            alert('Nenhuma tarefa para exportar!');
            return;
        }

        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tarefas-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    // ========== EVENT LISTENERS SETUP ==========
    setupEventListeners() {
        // Form submission
        const taskForm = document.getElementById('taskForm');
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const taskInput = document.getElementById('taskInput');
            const prioritySelect = document.getElementById('prioritySelect');
            const categorySelect = document.getElementById('categorySelect');

            this.addTask(
                taskInput.value,
                prioritySelect.value,
                categorySelect.value
            );

            taskInput.value = '';
            taskInput.focus();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Sort select
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.setSort(e.target.value);
        });

        // Action buttons
        document.getElementById('clearCompleted').addEventListener('click', () => {
            this.clearCompleted();
        });

        document.getElementById('clearAll').addEventListener('click', () => {
            this.clearAll();
        });

        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportTasks();
        });

        // Focus on input
        document.getElementById('taskInput').focus();
    }
}

// ========== INITIALIZATION ==========
let taskManager;

document.addEventListener('DOMContentLoaded', () => {
    taskManager = new TaskManager();
    console.log('✓ TaskFlow inicializado com sucesso!');
});
