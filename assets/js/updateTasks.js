import { getDateString } from "./dateManager";
import { bindDeleteTaskBtnClickEvents, bindDuplicateTaskBtnClickEvents, bindEditTaskBtnClickEvents, bindEditTaskEvents, bindStarInputChangeEvents, bindTaskCheckboxChangeEvents } from "./tasks";

// Function to update tasks
export function updateTasks() {
    let currentFolderId = '';
    // current id is set to 0 if the current folder is the important folder
    document.getElementById('currentFolderName').dataset.id == 'important' ? currentFolderId = '0' : currentFolderId = JSON.parse(document.getElementById('currentFolderName').dataset.id);

    fetch('/getTasksForFolder/' + currentFolderId)
    .then(response => response.json())
    .then(tasks => {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';
        
        const totalTasks = tasks.length;
        const todoTasks = tasks.filter(task => task.status != 1);
        const doneTasks = tasks.filter(task => task.status == 1);
        const doneTasksCount = doneTasks.length;

        // Template for ToDo tasks
        if(todoTasks.length > 0) {
                taskList.insertAdjacentHTML('beforeend', `
                <h1 class="mb-4 lg:text-3xl text-5xl font-extrabold text-gray-900 dark:text-white"><span class="text-transparent bg-clip-text bg-gradient-to-r to-primary from-highlight">To Do: </span></h1>
            `);

            if(doneTasksCount > 0)  {
                taskList.insertAdjacentHTML('beforeend', `
                    <div class="progress-bar border border-black w-full bg-gray-300 rounded mb-4">
                        <div class="bg-gradient-to-r to-primary from-highlight lg:text-xs text-xl leading-none text-center text-white rounded" style="width: ${(doneTasksCount / totalTasks) * 100}%">
                            ${doneTasksCount} / ${totalTasks}
                        </div>
                    </div>
                `);
            }

            todoTasks.forEach(task => {
                taskList.appendChild(createTaskElement(task));
            });
        }

        // Template for Done tasks
        if(doneTasks.length > 0) {
            taskList.insertAdjacentHTML('beforeend', `
                <h1 class="mb-4 lg:text-3xl text-5xl font-extrabold text-gray-900 dark:text-white"><span class="text-transparent bg-clip-text bg-gradient-to-r to-primary from-highlight">Done: </span></h1>
                `);

            doneTasks.forEach(task => {
                taskList.appendChild(createTaskElement(task));
            });
        }

        if(totalTasks == 0) {
            taskList.insertAdjacentHTML('beforeend', `
            <h2 class="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white"><span class="text-transparent bg-clip-text bg-gradient-to-r to-primary from-highlight text-center">No tasks yet</span></h2>
            <p class="mb-4 text-md font-bold text-gray-900 dark:text-white"><span class="text-black text-center">Add a task to get started with the + button at the top of the page</span></p>
            `);
        }

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

// Create task HTML element
function createTaskElement(task) {
    // Create a new task element
    const taskElement = document.createElement('div');
    taskElement.classList.add('task-item', 'border' , 'border-black', 'mb-4', 'p-4', 'bg-gray-200', 'rounded', 'shadow', 'flex', 'justify-between');
    if (task.status == 1) {
        taskElement.classList.add('bg-gray-400');
    }

    let goalDateString = '';
    if(task.goalDate !== null) {
        let goalDateObj = new Date(task.goalDate.timestamp * 1000);
        goalDateString = getDateString(goalDateObj);
    }else{
        goalDateString = '';
    }
    let taskLocation = '';
    if(task.location !== '' && task.location !== null) {
        taskLocation = ` 
        <div class="text-right" style="width: 100%;">
            <p class="task-location text-gray-600 text-xl lg:text-sm">
                <i class="fas fa-map-marker-alt mr-2"></i>
                ${task.location}
            </p>
        </div>
        `;
    }

    
    // Fill in the task's details
    taskElement.innerHTML = `
        <div class="checkbox-wrapper flex items-center" style="flex: 0 5%;">
            <input id="_checkbox-${task.id}" class="task-checkbox" type="checkbox" data-task-id="${task.id}" ${task.status == 1 ? 'checked' : ''}>
            <label for="_checkbox-${task.id}">
                <div class="tick_mark"></div>
            </label>
        </div>

        <div class="content ml-4 mt-1 flex flex-col" style="flex: 0 55%;">
            <div class="task-header mr-4">
                <h3 class="task-title font-bold mb-1 ${task.status == 1 ? 'line-through' : ''} text-3xl lg:text-base" style="word-break: break-word; overflow-wrap: break-word;">${task.name}</h3>
            </div>
            <div class="description-container">
                <p class="task-description mb-1 ${task.status == 1 ? 'line-through' : ''} text-2xl lg:text-base whitespace-pre-line" style="word-break: break-word; overflow-wrap: break-word;">${task.description}</p>
            </div>
        </div>

        <div class="date-location-container flex flex-col justify-center items-end" style="flex: 0 25%;">
            <div class="text-right" style="width: 100%;">
                <p class="task-goaldate text-gray-600 text-xl lg:text-sm">${goalDateString}</p>
            </div>
            ${taskLocation}
        </div>

        <div class="right-side flex items-center" style="flex: 0 15%;">
            <div class="dropdownMenu relative inline-block">
                <button class="ml-2 mr-2 p-1 rounded text-gray-600 hover:text-gray-800 text-2xl lg:text-base" onclick="toggleDropdownMenu(event)">
                    <i class="fas fa-ellipsis-h"></i>
                </button>
                <div class="dropdownItems absolute left-0 mt-0 w-40 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 overflow-hidden z-10 invisible">
                    <a href="#" class="duplicate-task block px-4 py-2 lg:text-sm text-xl text-gray-700 hover:bg-gray-100" data-task-id="${task.id}"><i class="fa fa-copy"></i><span class="ml-2">Duplicate</span></a>
                    <a href="#" class="edit-task block px-4 py-2 lg:text-sm text-xl text-gray-700 hover:bg-gray-100" data-task-id="${task.id}"><i class="fa fa-edit"></i><span class="ml-2">Edit</span></a>
                </div>
            </div>
            <input class="star lg:text-base text-4xl" type="checkbox" id="star_${task.id}" data-task-id="${task.id}" ${task.importance ? 'checked' : ''}>
            <label for="star_${task.id}" style="cursor: pointer;">
                <svg viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                </svg>
            </label>
            <button data-task-id="${task.id}" class="delete-task-btn ml-2 p-1 rounded text-gray-600 hover:text-gray-800 text-3xl lg:text-base"><i class="fa fa-trash"></i></button>
        </div>
    `;


    return taskElement;
}
