import { updateTasks } from './updateTasks.js';
import { openEditTaskModal } from './modal.js';

// Function to handle task checkbox change events
function onTaskCheckboxChange(e) {
    const taskId = this.dataset.taskId;
    const status = this.checked ? 1 : 0;
    updateTaskStatus(taskId, status);
}

// Function to handle task sorting
function sortTasks(sortBy) {
    let currentFolderId = '';
    document.getElementById('currentFolderName').dataset.id == 'important' ? currentFolderId = '0' : currentFolderId = JSON.parse(document.getElementById('currentFolderName').dataset.id);
    const url = `/getTasksForFolder/${currentFolderId}/${sortBy}`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Couldn't sort tasks");
            return response.json();
        })
        .then(async taskData => {
            await updateTasks(taskData);
            document.getElementById('task-sorting').value = sortBy;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function onSortChangeBtn(e){
    let sortBy = this.value;
    sortTasks(sortBy);
};



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
        document.getElementById('folderCarousel').classList.remove('blur-effect');
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
            document.getElementById('folderCarousel').classList.remove('blur-effect');

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


export function bindDeleteTaskBtnClickEvents() {
    document.querySelectorAll('.delete-task-btn').forEach(deleteBtn => {
        deleteBtn.addEventListener('click', onDeleteTaskBtnClick);
    });
}

export function bindEditTaskBtnClickEvents() {
    document.querySelectorAll('.edit-task').forEach(editBtn => {
        editBtn.addEventListener('click', onEditTaskBtnClick);
    });
}

// Fonction pour lier les événements de clic sur le bouton de duplication de tâche
export function bindDuplicateTaskBtnClickEvents() {
    document.querySelectorAll('.duplicate-task').forEach(duplicateBtn => {
        duplicateBtn.addEventListener('click', onDuplicateTaskBtnClick);
    });
}


// Function to handle edit task button click events
export function bindEditTaskEvents() {
    const editTaskButtons = document.querySelectorAll('.edit-task');

    editTaskButtons.forEach(button => {
      button.addEventListener('click', function(event) {
          event.preventDefault();
          const taskId = this.getAttribute("data-task-id");
          openEditTaskModal(taskId);
      });
    });
}

// Function to bind star input change events
export function bindStarInputChangeEvents() {
    document.querySelectorAll('.star').forEach(starInput => {
        starInput.removeEventListener('change', onStarInputChange);
        starInput.addEventListener('change', onStarInputChange);
    });
}

export function bindSortByChangeEvents() {
    if (document.getElementById('task-sorting') === null) return;
    document.getElementById('task-sorting').addEventListener('change', onSortChangeBtn);
}


document.addEventListener('DOMContentLoaded', function() {
    bindTaskCheckboxChangeEvents();
    bindStarInputChangeEvents();
    bindDeleteTaskBtnClickEvents();
    bindDuplicateTaskBtnClickEvents(); 
    bindEditTaskBtnClickEvents();
    bindSortByChangeEvents();
});