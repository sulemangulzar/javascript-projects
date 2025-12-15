 let draggedTask = null;
        let tasks = {};

        // Load tasks from memory
        function loadTasks() {
            const columns = document.querySelectorAll('.column');
            
            columns.forEach(column => {
                const status = column.dataset.status;
                const container = column.querySelector('.task-container');
                
                if (tasks[status]) {
                    tasks[status].forEach(taskData => {
                        const task = createTaskElement(taskData.id, taskData.title, taskData.desc, status);
                        container.appendChild(task);
                    });
                }
            });
            
            updateAllCounts();
        }

        // Save tasks to memory
        function saveTasks() {
            tasks = { todo: [], progress: [], done: [] };
            
            const columns = document.querySelectorAll('.column');
            columns.forEach(column => {
                const status = column.dataset.status;
                const taskElements = column.querySelectorAll('.task');
                
                taskElements.forEach(taskEl => {
                    const title = taskEl.querySelector('.task-title').textContent;
                    const desc = taskEl.querySelector('.task-desc').textContent;
                    tasks[status].push({
                        id: taskEl.dataset.id,
                        title: title,
                        desc: desc
                    });
                });
            });
        }

        // Popup functions
        function addPopup() {
            const popup = document.querySelector('.popup');
            popup.classList.remove('hidden');
            setTimeout(() => popup.classList.add('show'), 10);
            document.querySelector('.taskTitle').focus();
        }

        function closePopup() {
            const popup = document.querySelector('.popup');
            popup.classList.remove('show');
            setTimeout(() => {
                popup.classList.add('hidden');
                document.querySelector('.taskTitle').value = '';
                document.querySelector('.taskDesc').value = '';
            }, 300);
        }

        // Move task to next status
        function moveTask(btn, direction) {
            const task = btn.closest('.task');
            const currentColumn = task.closest('.column');
            const currentStatus = currentColumn.dataset.status;
            
            let nextColumn;
            let newStatus;
            
            if (direction === 'next') {
                if (currentStatus === 'todo') {
                    nextColumn = document.querySelector('[data-status="progress"]');
                    newStatus = 'progress';
                } else if (currentStatus === 'progress') {
                    nextColumn = document.querySelector('[data-status="done"]');
                    newStatus = 'done';
                }
            } else if (direction === 'prev') {
                if (currentStatus === 'progress') {
                    nextColumn = document.querySelector('[data-status="todo"]');
                    newStatus = 'todo';
                } else if (currentStatus === 'done') {
                    nextColumn = document.querySelector('[data-status="progress"]');
                    newStatus = 'progress';
                }
            }
            
            if (nextColumn) {
                task.style.transform = 'scale(0.9)';
                task.style.opacity = '0.5';
                
                setTimeout(() => {
                    const title = task.querySelector('.task-title').textContent;
                    const desc = task.querySelector('.task-desc').textContent;
                    const id = task.dataset.id;
                    
                    task.remove();
                    
                    const newTask = createTaskElement(id, title, desc, newStatus);
                    const container = nextColumn.querySelector('.task-container');
                    container.appendChild(newTask);
                    
                    updateAllCounts();
                    saveTasks();
                }, 200);
            }
        }

        // Create task element
        function createTaskElement(id, title, desc, status) {
            const task = document.createElement('div');
            task.className = 'task group relative glass rounded-2xl p-5 cursor-grab active:cursor-grabbing transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/10';
            task.draggable = true;
            task.dataset.id = id;

            const gradients = {
                todo: 'from-purple-500 via-pink-500 to-purple-500',
                progress: 'from-blue-500 via-cyan-500 to-blue-500',
                done: 'from-green-500 via-emerald-500 to-green-500'
            };

            // Determine button text based on status
            let nextButtonText = '';
            if (status === 'todo') {
                nextButtonText = 'Start →';
            } else if (status === 'progress') {
                nextButtonText = 'Complete ✓';
            }

            task.innerHTML = `
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradients[status]} rounded-t-2xl"></div>
                <div class="space-y-3">
                    <div class="flex items-start justify-between gap-3">
                        <div class="flex-1 min-w-0">
                            <p class="task-title text-white font-bold text-base sm:text-lg break-words leading-tight">${title}</p>
                            <p class="task-desc text-slate-300 text-xs sm:text-sm mt-2 break-words leading-relaxed">${desc}</p>
                        </div>
                        <button onclick="deleteTask(this)" class="flex-shrink-0 p-2 hover:bg-red-500/30 rounded-xl transition-all duration-300 text-slate-400 hover:text-red-400 group-hover:scale-110">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="status-btn flex gap-2 pt-3 border-t border-white/10">
                        ${status !== 'todo' ? `
                        <button onclick="moveTask(this, 'prev')" class="flex-1 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-white text-xs font-semibold rounded-lg transition-all duration-300 hover:scale-105">
                            ← Back
                        </button>` : ''}
                        ${status !== 'done' ? `
                        <button onclick="moveTask(this, 'next')" class="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-semibold rounded-lg transition-all duration-300 hover:scale-105">
                            ${nextButtonText}
                        </button>` : ''}
                    </div>
                </div>
            `;

            task.addEventListener('dragstart', () => {
                draggedTask = task;
                task.classList.add('dragging');
            });

            task.addEventListener('dragend', () => {
                draggedTask = null;
                task.classList.remove('dragging');
                saveTasks();
            });

            return task;
        }

        // Add task
        function addTaskToColumn() {
            const title = document.querySelector('.taskTitle').value.trim();
            const desc = document.querySelector('.taskDesc').value.trim();

            if (!title) {
                const titleInput = document.querySelector('.taskTitle');
                titleInput.classList.add('border-red-500', 'animate-pulse');
                setTimeout(() => titleInput.classList.remove('border-red-500', 'animate-pulse'), 500);
                return;
            }

            const id = Date.now().toString();
            const task = createTaskElement(id, title, desc, 'todo');

            const todoColumn = document.querySelector('.toDo-box .task-container');
            todoColumn.appendChild(task);

            closePopup();
            updateAllCounts();
            saveTasks();
        }

        // Delete task
        function deleteTask(btn) {
            const task = btn.closest('.task');
            task.style.transform = 'scale(0) rotate(180deg)';
            task.style.opacity = '0';
            
            setTimeout(() => {
                task.remove();
                updateAllCounts();
                saveTasks();
            }, 300);
        }

        // Update counts
        function updateAllCounts() {
            const columns = document.querySelectorAll('.column');
            columns.forEach(column => {
                const count = column.querySelectorAll('.task').length;
                column.querySelector('.count').textContent = count;
            });
        }

        // Drag and drop for columns
        const columns = document.querySelectorAll('.column');

        columns.forEach(column => {
            column.addEventListener('dragover', (e) => {
                e.preventDefault();
                column.classList.add('drag-over', 'scale-105');
            });

            column.addEventListener('dragleave', () => {
                column.classList.remove('drag-over', 'scale-105');
            });

            column.addEventListener('drop', (e) => {
                e.preventDefault();
                column.classList.remove('drag-over', 'scale-105');

                if (draggedTask) {
                    const newStatus = column.dataset.status;
                    const title = draggedTask.querySelector('.task-title').textContent;
                    const desc = draggedTask.querySelector('.task-desc').textContent;
                    const id = draggedTask.dataset.id;
                    
                    draggedTask.remove();
                    
                    const newTask = createTaskElement(id, title, desc, newStatus);
                    const container = column.querySelector('.task-container');
                    container.appendChild(newTask);
                    
                    updateAllCounts();
                    saveTasks();
                }
            });
        });

        // Enter key to add task
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && document.querySelector('.popup').classList.contains('show')) {
                if (e.target.classList.contains('taskTitle')) {
                    document.querySelector('.taskDesc').focus();
                } else if (!e.shiftKey && e.target.classList.contains('taskDesc')) {
                    addTaskToColumn();
                }
            }
            if (e.key === 'Escape' && document.querySelector('.popup').classList.contains('show')) {
                closePopup();
            }
        });

        // Load tasks on page load
        loadTasks();