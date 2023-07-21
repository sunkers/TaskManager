// Function to handle folder item click events
function onFolderItemClick(e) {
    e.preventDefault();
    var folderId = this.dataset.id;
    updateCurrentFolder(folderId);
}

// Function to handle delete folder click events
function onDeleteFolderClick(e) {
    e.preventDefault();
    var id = this.dataset.id;
    var url = `/delete_folder/${id}`;
    fetch(url, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) { throw response; }
            updateCollections();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function onDeleteFolderClick(e) {
    e.preventDefault();
    var id = this.dataset.id;
    var url = `/delete_folder/${id}`;

    // Get current folder ID
    var currentFolderId = JSON.parse(document.getElementById('currentFolder').dataset.id);

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
        document.getElementById('descriptionElement').textContent = folder.description;

        fetch('/getTasksForFolder/' + folder.id)
        .then(response => response.json())
        .then(tasks => {
            var taskList = document.getElementById('taskList');
            taskList.innerHTML = '';
            tasks.forEach(task => {
                var taskItem = document.createElement('div');
                taskItem.className = 'task-item mb-4 p-4 bg-gray-200 rounded shadow';
                taskItem.innerHTML = `
                    <h3 class="task-title font-bold mb-2">${task.name}</h3>
                    <p class="task-description mb-2">${task.description}</p>
                    <div class="task-controls"></div>
                `;
                taskList.appendChild(taskItem);
            });
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
