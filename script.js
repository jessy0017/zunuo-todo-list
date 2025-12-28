// ===================================
// STATE MANAGEMENT
// ===================================

let tasks = [];
let currentFilter = 'all';
let notificationInterval = null;

// ===================================
// DOM ELEMENTS
// ===================================

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

// Time inputs
const toggleTimeBtn = document.getElementById('toggle-time-btn');
const timeOptions = document.getElementById('time-options');
const taskDateInput = document.getElementById('task-date');
const taskTimeInput = document.getElementById('task-time');
const taskReminderInput = document.getElementById('task-reminder');

// Stats elements
const totalTasksEl = document.getElementById('total-tasks');
const overdueTasksEl = document.getElementById('overdue-tasks');
const completedTasksEl = document.getElementById('completed-tasks');

// Filter buttons
const filterBtns = document.querySelectorAll('.filter-btn');

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromStorage();
    renderTasks();
    updateStats();
    setupEventListeners();
    requestNotificationPermission();
    startNotificationChecker();
});

// ===================================
// EVENT LISTENERS
// ===================================

function setupEventListeners() {
    // Form submission
    taskForm.addEventListener('submit', handleAddTask);

    // Toggle time options
    toggleTimeBtn.addEventListener('click', toggleTimeOptions);

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
// TIME OPTIONS TOGGLE
// ===================================

function toggleTimeOptions() {
    timeOptions.classList.toggle('hidden');
    toggleTimeBtn.classList.toggle('active');
}

// ===================================
// TASK MANAGEMENT FUNCTIONS
// ===================================

function handleAddTask(e) {
    e.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === '') {
        taskInput.classList.add('shake');
        setTimeout(() => taskInput.classList.remove('shake'), 500);
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString(),
        dueDate: taskDateInput.value || null,
        dueTime: taskTimeInput.value || null,
        reminder: taskReminderInput.value || 'none',
        notified: false
    };

    tasks.unshift(newTask);
    taskInput.value = '';
    taskDateInput.value = '';
    taskTimeInput.value = '';
    taskReminderInput.value = 'none';

    // Hide time options after adding
    timeOptions.classList.add('hidden');
    toggleTimeBtn.classList.remove('active');

    saveTasksToStorage();
    sortTasksByDueDate();
    renderTasks();
    updateStats();

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
        taskElement.classList.add('removing');

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

    completedTasks.forEach(task => {
        const taskElement = document.querySelector(`[data-task-id="${task.id}"]`);
        if (taskElement) {
            taskElement.classList.add('removing');
        }
    });

    setTimeout(() => {
        tasks = tasks.filter(t => !t.completed);
        saveTasksToStorage();
        renderTasks();
        updateStats();
    }, 300);
}

// ===================================
// TIME & DATE FUNCTIONS
// ===================================

function sortTasksByDueDate() {
    tasks.sort((a, b) => {
        // Completed tasks go to bottom
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;

        // Tasks without due dates go to bottom
        if (!a.dueDate && b.dueDate) return 1;
        if (a.dueDate && !b.dueDate) return -1;
        if (!a.dueDate && !b.dueDate) return 0;

        // Sort by due date/time
        const aDateTime = new Date(`${a.dueDate}T${a.dueTime || '23:59'}`);
        const bDateTime = new Date(`${b.dueDate}T${b.dueTime || '23:59'}`);

        return aDateTime - bDateTime;
    });
}

function isOverdue(task) {
    if (!task.dueDate || task.completed) return false;

    const now = new Date();
    const dueDateTime = new Date(`${task.dueDate}T${task.dueTime || '23:59'}`);

    return now > dueDateTime;
}

function getTimeRemaining(task) {
    if (!task.dueDate) return null;

    const now = new Date();
    const dueDateTime = new Date(`${task.dueDate}T${task.dueTime || '23:59'}`);
    const diff = dueDateTime - now;

    if (diff < 0) return { text: 'Overdue', class: 'overdue' };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) {
        const mins = Math.floor(diff / (1000 * 60));
        return { text: `${mins}m left`, class: 'due-urgent' };
    } else if (hours < 24) {
        return { text: `${hours}h left`, class: 'due-today' };
    } else if (days < 7) {
        return { text: `${days}d left`, class: 'due-soon' };
    } else {
        return { text: `${days}d left`, class: 'due-soon' };
    }
}

function formatDueDate(task) {
    if (!task.dueDate) return '';

    const date = new Date(task.dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    let dateStr = '';
    if (isToday) {
        dateStr = 'Today';
    } else if (isTomorrow) {
        dateStr = 'Tomorrow';
    } else {
        dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    if (task.dueTime) {
        const time = task.dueTime.substring(0, 5); // HH:MM
        dateStr += ` ${time}`;
    }

    return dateStr;
}

// ===================================
// NOTIFICATION FUNCTIONS
// ===================================

function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function startNotificationChecker() {
    // Check every minute
    notificationInterval = setInterval(checkForDueTasksAndNotify, 60000);
    // Also check immediately
    checkForDueTasksAndNotify();
}

function checkForDueTasksAndNotify() {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        return;
    }

    const now = new Date();

    tasks.forEach(task => {
        if (task.completed || task.notified || !task.dueDate || task.reminder === 'none') {
            return;
        }

        const dueDateTime = new Date(`${task.dueDate}T${task.dueTime || '23:59'}`);
        let notifyTime = new Date(dueDateTime);

        // Calculate notification time based on reminder setting
        switch (task.reminder) {
            case '5min':
                notifyTime.setMinutes(notifyTime.getMinutes() - 5);
                break;
            case '15min':
                notifyTime.setMinutes(notifyTime.getMinutes() - 15);
                break;
            case '30min':
                notifyTime.setMinutes(notifyTime.getMinutes() - 30);
                break;
            case 'at-time':
            default:
                // Notify at the exact time
                break;
        }

        // Check if it's time to notify (within the last minute)
        const timeDiff = now - notifyTime;
        if (timeDiff >= 0 && timeDiff < 60000) {
            sendNotification(task);
            task.notified = true;
            saveTasksToStorage();
        }
    });
}

function sendNotification(task) {
    const notification = new Notification('Zunuo - Task Reminder', {
        body: task.text,
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%234F46E5"/></svg>',
        tag: `task-${task.id}`,
        requireInteraction: false
    });

    notification.onclick = function () {
        window.focus();
        this.close();
    };
}

// ===================================
// FILTER FUNCTIONS
// ===================================

function handleFilterChange(e) {
    const filter = e.target.dataset.filter;
    currentFilter = filter;

    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    renderTasks();
}

function getFilteredTasks() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    switch (currentFilter) {
        case 'completed':
            return tasks.filter(t => t.completed);
        case 'overdue':
            return tasks.filter(t => !t.completed && isOverdue(t));
        case 'today':
            return tasks.filter(t => {
                if (!t.dueDate || t.completed) return false;
                const taskDate = new Date(t.dueDate);
                return taskDate.toDateString() === today.toDateString();
            });
        case 'week':
            return tasks.filter(t => {
                if (!t.dueDate || t.completed) return false;
                const taskDate = new Date(t.dueDate);
                return taskDate >= today && taskDate < weekFromNow;
            });
        default:
            return tasks;
    }
}

// ===================================
// RENDER FUNCTIONS
// ===================================

function renderTasks() {
    const filteredTasks = getFilteredTasks();

    taskList.innerHTML = '';

    if (filteredTasks.length === 0) {
        emptyState.classList.add('show');
        return;
    } else {
        emptyState.classList.remove('show');
    }

    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''} ${isOverdue(task) ? 'overdue' : ''}`;
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

    // Due date badge
    let dueBadge = null;
    if (task.dueDate) {
        dueBadge = document.createElement('div');
        const timeInfo = getTimeRemaining(task);
        dueBadge.className = `task-due-badge ${timeInfo.class}`;
        dueBadge.innerHTML = `
            <svg class="due-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" stroke-width="2"/>
                <path d="M10 6V10L13 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>${formatDueDate(task)} • ${timeInfo.text}</span>
        `;
    }

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
    if (dueBadge) li.appendChild(dueBadge);
    li.appendChild(deleteBtn);

    return li;
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const overdue = tasks.filter(t => !t.completed && isOverdue(t)).length;

    animateValue(totalTasksEl, parseInt(totalTasksEl.textContent) || 0, total, 300);
    animateValue(overdueTasksEl, parseInt(overdueTasksEl.textContent) || 0, overdue, 300);
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
            sortTasksByDueDate();
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
    const increment = range / (duration / 16);
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
    if (e.key === 'Escape' && document.activeElement === taskInput) {
        taskInput.value = '';
        taskInput.blur();
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        taskInput.focus();
    }
}

// ===================================
// ADDITIONAL FEATURES
// ===================================

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
