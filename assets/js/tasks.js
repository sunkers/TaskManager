// Function to handle task checkbox change events
function onTaskCheckboxChange(e) {
    var taskId = this.dataset.taskId;
    var status = this.checked ? 1 : 0;
    updateTaskStatus(taskId, status);
}

// Function to update task status
function updateTaskStatus(taskId, status) {
    var url = `/update_task_status/${taskId}`;

    fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'status': status })
    })
    .then(response => {
        if (!response.ok) throw new Error("Couldn't update task status");
        updateTasks();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to bind task checkbox change events
function bindTaskCheckboxChangeEvents() {
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.removeEventListener('change', onTaskCheckboxChange);
        checkbox.addEventListener('change', onTaskCheckboxChange);
    });
}

// Function to update tasks
function updateTasks() {
    var currentFolderId = JSON.parse(document.getElementById('currentFolder').dataset.id);

    fetch('/getTasksForFolder/' + currentFolderId)
    .then(response => response.json())
    .then(tasks => {
        var taskList = document.getElementById('taskList');
        taskList.innerHTML = '';
        tasks.forEach(task => {
            var taskItem = document.createElement('div');
            taskItem.className = `task-item mb-4 p-4 rounded shadow flex items-center ${task.status == 1 ? 'bg-gray-400' : 'bg-gray-200'}`;
            taskItem.innerHTML = `
                <div class="checkbox-wrapper">
                    <input id="_checkbox-${task.id}" data-task-id="${task.id}" class="task-checkbox" type="checkbox" ${task.status == 1 ? 'checked' : ''}>
                    <label for="_checkbox-${task.id}">
                    <div class="tick_mark"></div>
                    </label>
                </div>
                <div class="flex-grow ml-10 mt-1">
                    <h3 class="task-title font-bold mb-1 ${task.status == 1 ? 'line-through' : ''}">${task.name}</h3>
                    <p class="task-description mb-1 ${task.status == 1 ? 'line-through' : ''}">${task.description}</p>
                </div>
                <button class="ml-2 mr-2 p-1 rounded text-gray-600 hover:text-gray-800"><i class="fas fa-ellipsis-h"></i></button>
                <input class="star" type="checkbox" id="star_${task.id}">
                <label for="star_${task.id}">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                  </svg>
                </label>
                <button class="ml-2 p-1 rounded text-gray-600 hover:text-gray-800"><i class="fa fa-trash"></i></button>
            `;
            taskList.appendChild(taskItem);
        });
        bindTaskCheckboxChangeEvents();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    bindTaskCheckboxChangeEvents();
});
