import { updateTasks } from './updateTasks.js';
import Splide from '@splidejs/splide';

let splide;

function updateCarousel() {
    fetch('/getFoldersAll')
        .then(response => response.json())
        .then(folders => {
            let carousel = document.querySelector('.splide__list');
            carousel.innerHTML = '';
            folders.forEach(folder => {
                carousel.innerHTML += `
                <li class="splide__slide flex justify-center items-center" data-id="${folder.id}">
                    ${folder.name}
                </li>
                `;
            });

            // Remount the Splide after updating the carousel.
            if(splide) {
                splide.destroy();
            }
            
            splide = new Splide('#folderCarousel', {
                type: 'loop',
                perPage: 1,
                autoplay: false,
            });
            
            splide.on('moved', function(newIndex) {
                if (splide.Components.Elements.slides.length > 0) {
                    let newSlide = splide.Components.Elements.slides[newIndex];
                    let newFolderId = newSlide.getAttribute('data-id');
                    updateCurrentFolder(newFolderId);
                }
            });
            
            splide.mount();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

document.addEventListener('DOMContentLoaded', updateCarousel);

  

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

    var currentFolderId = document.getElementById('currentFolderName').dataset.id;

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
    if (folderId == 'important') {
        document.getElementById('currentFolderName').textContent = '⭐ Important';
        document.getElementById('currentFolderName').setAttribute('data-id', folderId);
        document.getElementById('currentFolderDescription').textContent = 'All your important tasks in one place';

        updateTasks();
    } else {
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
            document.getElementById('currentFolderName').textContent = folder.name;
            document.getElementById('currentFolderName').setAttribute('data-id', folder.id);
            document.getElementById('currentFolderDescription').textContent = folder.description;
            document.getElementById('currentFolderName').setAttribute('contenteditable', !folder.isDefault);
            document.getElementById('currentFolderDescription').setAttribute('contenteditable', !folder.isDefault);

            bindEditableEvents();
            updateTasks();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

document.getElementById("createFolder").addEventListener('click', function(event) {
    event.preventDefault(); 

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

let previousTitle;

function bindEditableEvents() {
        const currentFolderNameEl = document.getElementById('currentFolderName');
        const currentFolderDescriptionEl = document.getElementById('currentFolderDescription');

        currentFolderNameEl.addEventListener('focus', function() {
            previousTitle = this.innerText;
        });

        currentFolderNameEl.addEventListener('blur', function() {

            const newTitle = this.innerText.trim();
            const id = this.getAttribute('data-id');

            let data = { collectionName: newTitle };

            if (newTitle === '') {
                this.innerText = previousTitle;
                alert('Title cannot be empty');
            } else {
                fetch(`/updateFolderTitle/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error updating folder title");
                    } else {
                        console.log("Folder title successfully updated");
                    }
                    updateCollections();
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            }
        });

        currentFolderDescriptionEl.addEventListener('blur', function() {

            const newDescription = this.innerText;
            const id = currentFolderNameEl.getAttribute('data-id');

            let data = { collectionDescription: newDescription };

            fetch(`/updateFolderDescription/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error updating folder description");
                } else {
                    console.log("Folder description successfully updated");
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        });
}






document.addEventListener('DOMContentLoaded', function() {
    bindDeleteFolderEvents();
    bindFolderItemClickEvents();
});

