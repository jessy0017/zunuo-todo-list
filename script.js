// ===================================
// STATE MANAGEMENT
// ===================================

let tasks = [];
let currentFilter = 'all';

// ===================================
// DOM ELEMENTS
// ===================================

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

// Stats elements
const totalTasksEl = document.getElementById('total-tasks');
const completedTasksEl = document.getElementById('completed-tasks');

// Filter buttons
const filterBtns = document.querySelectorAll('.filter-btn');
const filterAllBtn = document.getElementById('filter-all');
const filterCompletedBtn = document.getElementById('filter-completed');

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromStorage();
    renderTasks();
    updateStats();
    setupEventListeners();
});

// ===================================
// EVENT LISTENERS
// ===================================

function setupEventListeners() {
    // Form submission
    taskForm.addEventListener('submit', handleAddTask);

    // Clear completed tasks
    clearCompletedBtn.addEventListener('click', handleClearCompleted);

    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', handleFilterChange);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// ===================================
// TASK MANAGEMENT FUNCTIONS
// ===================================

function handleAddTask(e) {
    e.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === '') {
        // Add shake animation to input if empty
        taskInput.classList.add('shake');
        setTimeout(() => taskInput.classList.remove('shake'), 500);
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask); // Add to beginning of array
    taskInput.value = '';

    saveTasksToStorage();
    renderTasks();
    updateStats();

    // Add success feedback
    taskInput.placeholder = 'Task added! Add another?';
    setTimeout(() => {
        taskInput.placeholder = 'What needs to be done?';
    }, 2000);
}

function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasksToStorage();
        renderTasks();
        updateStats();
    }
}

function deleteTask(taskId) {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);

    if (taskElement) {
        // Add removing animation
        taskElement.classList.add('removing');

        // Wait for animation to complete before removing
        setTimeout(() => {
            tasks = tasks.filter(t => t.id !== taskId);
            saveTasksToStorage();
            renderTasks();
            updateStats();
        }, 300);
    }
}

function handleClearCompleted() {
    const completedTasks = tasks.filter(t => t.completed);

    if (completedTasks.length === 0) {
        return;
    }

    // Add removing animation to all completed tasks
    completedTasks.forEach(task => {
        const taskElement = document.querySelector(`[data-task-id="${task.id}"]`);
        if (taskElement) {
            taskElement.classList.add('removing');
        }
    });

    // Wait for animation to complete before removing
    setTimeout(() => {
        tasks = tasks.filter(t => !t.completed);
        saveTasksToStorage();
        renderTasks();
        updateStats();
    }, 300);
}

// ===================================
// FILTER FUNCTIONS
// ===================================

function handleFilterChange(e) {
    const filter = e.target.dataset.filter;
    currentFilter = filter;

    // Update active button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    renderTasks();
}

function getFilteredTasks() {
    switch (currentFilter) {
        case 'active':
            return tasks.filter(t => !t.completed);
        case 'completed':
            return tasks.filter(t => t.completed);
        default:
            return tasks;
    }
}

// ===================================
// RENDER FUNCTIONS
// ===================================

function renderTasks() {
    const filteredTasks = getFilteredTasks();

    // Clear current list
    taskList.innerHTML = '';

    // Show/hide empty state
    if (filteredTasks.length === 0) {
        emptyState.classList.add('show');
        return;
    } else {
        emptyState.classList.remove('show');
    }

    // Render each task
    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.taskId = task.id;

    // Checkbox wrapper
    const checkboxWrapper = document.createElement('div');
    checkboxWrapper.className = 'task-checkbox-wrapper';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.id = `task-${task.id}`;
    checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));

    checkboxWrapper.appendChild(checkbox);

    // Task text
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.innerHTML = `
        <svg class="delete-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6L14 14M6 14L14 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `;
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    // Assemble task item
    li.appendChild(checkboxWrapper);
    li.appendChild(taskText);
    li.appendChild(deleteBtn);

    return li;
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;


    // Animate number changes
    animateValue(totalTasksEl, parseInt(totalTasksEl.textContent) || 0, total, 300);

    animateValue(completedTasksEl, parseInt(completedTasksEl.textContent) || 0, completed, 300);
}

// ===================================
// LOCAL STORAGE FUNCTIONS
// ===================================

function saveTasksToStorage() {
    try {
        localStorage.setItem('zunuoTasks', JSON.stringify(tasks));
    } catch (error) {
        console.error('Error saving tasks to localStorage:', error);
    }
}

function loadTasksFromStorage() {
    try {
        const storedTasks = localStorage.getItem('zunuoTasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
        }
    } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
        tasks = [];
    }
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

function animateValue(element, start, end, duration) {
    if (start === end) return;

    const range = end - start;
    const increment = range / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
        current += increment;

        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }

        element.textContent = Math.round(current);
    }, 16);
}

function handleKeyboardShortcuts(e) {
    // Escape key to clear input
    if (e.key === 'Escape' && document.activeElement === taskInput) {
        taskInput.value = '';
        taskInput.blur();
    }

    // Ctrl/Cmd + K to focus input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        taskInput.focus();
    }
}

// ===================================
// ADDITIONAL FEATURES
// ===================================

// Add shake animation for empty input
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    .shake {
        animation: shake 0.3s ease;
    }
`;
document.head.appendChild(style);

// ===================================
// EXPORT FOR TESTING (Optional)
// ===================================

// Expose functions for testing if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        tasks,
        handleAddTask,
        toggleTaskCompletion,
        deleteTask,
        getFilteredTasks,
        updateStats
    };
}
