// Function to handle task checkbox change events
function onTaskCheckboxChange(e) {
    var taskId = this.dataset.taskId;
    var status = this.checked ? 1 : 0;
    updateTaskStatus(taskId, status);
}

// Function to handle task delete button click events
function onDeleteTaskBtnClick(e) {
    var taskId = this.dataset.taskId;
    deleteTask(taskId);
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
export function bindTaskCheckboxChangeEvents() {
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.removeEventListener('change', onTaskCheckboxChange);
        checkbox.addEventListener('change', onTaskCheckboxChange);
    });
}

// Function to update tasks
export function updateTasks() {
    console.log("update tasks");
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
                <div class="checkbox-wrapper" id="myCheckbox">
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
                <input class="star" type="checkbox" id="star_${task.id}" data-task-id="${task.id}" ${task.importance ? 'checked' : ''}>
                <label for="star_${task.id}" style="cursor: pointer;">
                <svg viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                </svg>
                </label>
                <button data-task-id="${task.id}" class="delete-task-btn ml-2 p-1 rounded text-gray-600 hover:text-gray-800"><i class="fa fa-trash"></i></button>
            `;
            taskList.appendChild(taskItem);
        });
        bindTaskCheckboxChangeEvents();
        bindStarInputChangeEvents();
        bindDeleteTaskBtnClickEvents();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function onStarInputChange(e) {
    var taskId = this.dataset.taskId;
    var importance = this.checked ? 1 : 0;
    updateTaskImportance(taskId, importance);
}

// Function to delete task
function deleteTask(taskId) {
    var url = `/delete_task/${taskId}`;

    fetch(url, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error("Couldn't delete task");
        updateTasks();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

export function bindDeleteTaskBtnClickEvents() {
    document.querySelectorAll('.delete-task-btn').forEach(deleteBtn => {
        deleteBtn.removeEventListener('click', onDeleteTaskBtnClick);
        deleteBtn.addEventListener('click', onDeleteTaskBtnClick);
    });
}


// Function to update task importance
function updateTaskImportance(taskId, importance) {
    var url = `/update_task_importance/${taskId}`;

    fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'importance': importance })
    })
    .then(response => {
        if (!response.ok) throw new Error("Couldn't update task importance");
        updateTasks();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to bind star input change events
export function bindStarInputChangeEvents() {
    document.querySelectorAll('.star').forEach(starInput => {
        starInput.removeEventListener('change', onStarInputChange);
        starInput.addEventListener('change', onStarInputChange);
    });
}


document.addEventListener('DOMContentLoaded', function() {
    bindTaskCheckboxChangeEvents();
    bindStarInputChangeEvents();
    bindDeleteTaskBtnClickEvents();
});

// Ajouter une fonction pour vider les champs du formulaire
function resetFormFields() {
    document.getElementById("taskName").value = '';
    document.getElementById("taskDescription").value = '';
}

document.getElementById("createTask").addEventListener('click', function(event) {
    console.log("create task button clicked");
    event.preventDefault(); 

    let name = document.getElementById("taskName").value;
    let description = document.getElementById("taskDescription").value;
    let goalDate = document.getElementById("goalDate").value;
    let goalTime = document.getElementById("goalTime").value;
    let location = document.getElementById("location").value;

    if(name == "" ) {
        alert("Please give a name to your task!");
        return;
    }

    let combinedDateTime = goalDate + ' ' + goalTime;

    let data = {
        taskName: name,
        taskDescription: description,
        goalDate: combinedDateTime,
        location: location,
    };

    fetch('/task/new', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Server response wasn't OK");
        }
    })
    .then(taskData => {
        document.getElementById('createTaskModal').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
        updateTasks();
        resetFormFields();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    
});
