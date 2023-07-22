import { getDateString } from "./dateManager";
import { openEditTaskModal } from "./modal";

// Function to handle task checkbox change events
function onTaskCheckboxChange(e) {
    const taskId = this.dataset.taskId;
    const status = this.checked ? 1 : 0;
    updateTaskStatus(taskId, status);
}

// Function to handle task delete button click events
function onDeleteTaskBtnClick(e) {
    const taskId = this.dataset.taskId;
    deleteTask(taskId);
}


// Function to update task status
function updateTaskStatus(taskId, status) {
    const url = `/update_task_status/${taskId}`;

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
        checkbox.addEventListener('change', onTaskCheckboxChange);
    });
}

// Function to update tasks
export function updateTasks() {
    console.log("update tasks");
    const currentFolderId = JSON.parse(document.getElementById('currentFolder').dataset.id);

    fetch('/getTasksForFolder/' + currentFolderId)
    .then(response => response.json())
    .then(tasks => {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';
        tasks.forEach(task => {
            let goalDateString = '';
            if(task.goalDate !== null) {
                let goalDateObj = new Date(task.goalDate.timestamp * 1000);
                goalDateString = getDateString(goalDateObj);
            }else{
                goalDateString = '';
            }


            const taskItem = document.createElement('div');
            taskItem.className = `task-item mb-4 p-4 rounded shadow flex justify-between ${task.status == 1 ? 'bg-gray-400' : 'bg-gray-200'}`;
            taskItem.innerHTML = `
                <div class="checkbox-wrapper flex items-center" style="flex: 0 5%;">
                    <input id="_checkbox-${task.id}" data-task-id="${task.id}" class="task-checkbox" type="checkbox" ${task.status == 1 ? 'checked' : ''}>
                    <label for="_checkbox-${task.id}">
                        <div class="tick_mark"></div>
                    </label>
                </div>
                <div class="content ml-4 mt-1 flex flex-col" style="flex: 0 55%;">
                    <div class="task-header mr-4">
                        <h3 class="task-title font-bold mb-1 ${task.status == 1 ? 'line-through' : ''}">${task.name}</h3>
                    </div>
                    <div class="description-container">
                        <p class="task-description mb-1 ${task.status == 1 ? 'line-through' : ''}">${task.description}</p>
                    </div>
                </div>
                <div class="date-location-container flex flex-col justify-center items-end" style="flex: 0 25%;">
                    <div class="text-right" style="width: 100%;">
                        <p class="task-goaldate text-gray-600 text-sm">
                            ${goalDateString}
                        </p>
                    </div>
                    ${task.location ? `
                        <div class="text-right" style="width: 100%;">
                            <p class="task-location text-gray-600 text-sm">
                                <i class="fas fa-map-marker-alt mr-2"></i>
                                ${task.location}
                            </p>
                        </div>` : ''}
                </div>
                <div class="right-side flex items-center" style="flex: 0 15%;">
                    <div class="dropdownMenu relative inline-block">
                        <button class="ml-2 mr-2 p-1 rounded text-gray-600 hover:text-gray-800" onclick="toggleDropdownMenu(event)">
                            <i class="fas fa-ellipsis-h"></i>
                        </button>
                        <div class="dropdownItems absolute left-0 mt-0 w-40 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 overflow-hidden z-10 invisible">
                            <a href="#" class="duplicate-task block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-task-id="${task.id}"><i class="fa fa-copy"></i><span class="ml-2">Duplicate</span></a>
                            <a href="#" class="edit-task block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-task-id="${task.id}"><i class="fa fa-edit"></i><span class="ml-2">Edit</span></a>
                        </div>
                    </div>
                    <input class="star" type="checkbox" id="star_${task.id}" data-task-id="${task.id}" ${task.importance ? 'checked' : ''}>
                    <label for="star_${task.id}" style="cursor: pointer;">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                        </svg>
                    </label>
                    <button data-task-id="${task.id}" class="delete-task-btn ml-2 p-1 rounded text-gray-600 hover:text-gray-800"><i class="fa fa-trash"></i></button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
        bindTaskCheckboxChangeEvents();
        bindStarInputChangeEvents();
        bindDeleteTaskBtnClickEvents();
        bindEditTaskBtnClickEvents();
        bindEditTaskEvents();
        bindDuplicateTaskBtnClickEvents();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}



function onStarInputChange(e) {
    const taskId = this.dataset.taskId;
    const importance = this.checked ? 1 : 0;
    updateTaskImportance(taskId, importance);
}

// Function to delete task
function deleteTask(taskId) {
    const url = `/delete_task/${taskId}`;

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
        deleteBtn.addEventListener('click', onDeleteTaskBtnClick);
    });
}

export function bindEditTaskBtnClickEvents() {
    document.querySelectorAll('.edit-task').forEach(editBtn => {
        editBtn.addEventListener('click', onEditTaskBtnClick);
        console.log("edit task button binded");
    });
}

// Function to handle edit task button click events
function bindEditTaskEvents() {
    const editTaskButtons = document.querySelectorAll('.edit-task');

    editTaskButtons.forEach(button => {
      button.addEventListener('click', function(event) {
          event.preventDefault();
          const taskId = this.getAttribute("data-task-id");
          openEditTaskModal(taskId);
      });
    });
}




// Function to update task importance
function updateTaskImportance(taskId, importance) {
    const url = `/update_task_importance/${taskId}`;

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
    bindDuplicateTaskBtnClickEvents(); 
    bindEditTaskBtnClickEvents();
});

document.addEventListener('click', function(event) {
    if (event.target.matches('.edit-task')) {
        onEditTaskBtnClick.call(event.target, event);
    } else if (event.target.matches('.delete-task-btn')) {
        onDeleteTaskBtnClick.call(event.target, event);
    } else if (event.target.matches('.duplicate-task')) {
        onDuplicateTaskBtnClick.call(event.target, event);
    } 
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
    console.log(data);

    if (data.goalDate === " ") {
        data.goalDate = null;
      }

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

// Fonction pour gérer le clic sur le bouton de duplication de tâche
function onDuplicateTaskBtnClick(e) {
    const taskId = this.dataset.taskId;
    duplicateTask(taskId);
}

// Fonction pour dupliquer une tâche
function duplicateTask(taskId) {
    const url = `/duplicate_task/${taskId}`;

    fetch(url, {
        method: 'POST'
    })
    .then(response => {
        if (!response.ok) throw new Error("Couldn't duplicate task");
        updateTasks();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Fonction pour lier les événements de clic sur le bouton de duplication de tâche
export function bindDuplicateTaskBtnClickEvents() {
    document.querySelectorAll('.duplicate-task').forEach(duplicateBtn => {
        duplicateBtn.addEventListener('click', onDuplicateTaskBtnClick);
    });
}

function onEditTaskBtnClick(e) {
    const taskId = this.dataset.taskId;
    editTask(taskId);
}

function editTask(taskId) {
    document.getElementById('editTask').addEventListener('click', function() {
        let taskId = document.getElementById('editTaskId').value;
        if (taskId === '') {
        console.error('Task ID is missing');
        return;
        }
    
        let taskData = {
        taskName: document.getElementById('editTaskName').value,
        taskDescription: document.getElementById('editTaskDescription').value,
        goalDate: document.getElementById('editGoalDate').value + "T" + document.getElementById('editGoalTime').value,
        location: document.getElementById('editLocation').value
        };

        if (taskData.goalDate === "T") {
        taskData.goalDate = null;
        }
        
    
        fetch('/update_task/' + taskId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
        })
        .then(response => response.json())
        .then(data => {
        if (data.status === 'success') {
            // ferme la fenetre modal et updateTasks
            document.getElementById('editTaskModal').style.display = 'none';
            document.getElementById('overlay').style.display = 'none';

            updateTasks();
        } else {
            console.error(data.error);
        }
        })
        .catch(error => {
        console.error('Error:', error);
        });
    });
}