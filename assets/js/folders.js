import { updateTasks, bindTaskCheckboxChangeEvents, bindStarInputChangeEvents, bindDeleteTaskBtnClickEvents } from './tasks.js';

// Function to handle folder item click events
function onFolderItemClick(e) {
    e.preventDefault();
    var folderId = this.dataset.id;
    updateCurrentFolder(folderId);
}

function onDeleteFolderClick(e) {
    e.preventDefault();
    var id = this.dataset.id;
    var url = `/delete_folder/${id}`;

    // Get current folder ID from session
    var currentFolderId = document.getElementById('currentFolder').dataset.id;
    // var currentFolderId = JSON.parse(document.getElementById('currentFolder').dataset.id);

    fetch(url, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) { throw response; }
            updateCollections();

            // If the deleted folder is the current folder, redirect to the first folder
            if (id == currentFolderId) {
                fetch('/getFolders')
                    .then(response => response.json())
                    .then(folders => {
                        if (folders.length > 0) {
                            updateCurrentFolder(folders[0].id);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function bindDeleteFolderEvents() {
    document.querySelectorAll('.delete-folder').forEach(deleteLink => {
        deleteLink.removeEventListener('click', onDeleteFolderClick);
        deleteLink.addEventListener('click', onDeleteFolderClick);
    });
}

function bindFolderItemClickEvents() {
    document.querySelectorAll('.folder-item').forEach(folderItem => {
        folderItem.removeEventListener('click', onFolderItemClick);
        folderItem.addEventListener('click', onFolderItemClick);
    });
}

function updateCollections() {
    fetch('/getFolders')
        .then(response => response.json())
        .then(data => {
            let collectionsContainer = document.getElementById('myFoldersContainer');
            collectionsContainer.innerHTML = '';
            data.forEach(folder => {
                collectionsContainer.innerHTML += `
                <div class="flex justify-between items-center pl-8 pr-6 hover:bg-primary py-3">
                    <a class="folder-item" data-id="${ folder.id }" href="#">${ folder.name }</a>
                    <a href="#" data-id="${folder.id}" class="delete-folder text-gray-400 hover:text-white transition-colors duration-200">
                        <i class="fa fa-trash"></i>
                    </a>
                </div>
                `;
            });
            bindDeleteFolderEvents();
            bindFolderItemClickEvents();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function updateCurrentFolder(folderId) {
    fetch('/changeFolder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'folderId': folderId })
    })
    .then(response => {
        if (!response.ok) throw new Error("Couldn't change the folder");
        return fetch('/getCurrentFolder');
    })
    .then(response => response.json())
    .then(folder => {
        document.getElementById('currentFolder').textContent = folder.name;
        document.getElementById('currentFolder').setAttribute('data-id', folder.id);
        document.getElementById('descriptionElement').textContent = folder.description;
        
        fetch('/getTasksForFolder/' + folder.id)
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
                    <label for="star_${task.id}">
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
        .catch(error => {
            console.error('Error:', error);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}



document.getElementById("createFolder").addEventListener('click', function(event) {
    event.preventDefault(); 
    console.log("create folder button clicked");

    let name = document.getElementById("collectionName").value;
    let description = document.getElementById("collectionDescription").value;

    if(name == "" ) {
        alert("Please give a name to your collection!");
        return;
    }

    let data = {
        collectionName: name,
        collectionDescription: description
    };

    fetch('/folder/new', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('createCollectionModal').style.display = 'none';
            document.getElementById('overlay').style.display = 'none';
            updateCollections();
        } else {
            alert("An error occurred: " + response.status);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    bindDeleteFolderEvents();
    bindFolderItemClickEvents();
});


