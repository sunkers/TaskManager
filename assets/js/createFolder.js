// document.getElementById("createFolder").addEventListener('click', function(event) {
//     console.log("create folder button clicked");
//     event.preventDefault(); 

//     let name = document.getElementById("collectionName").value;
//     let description = document.getElementById("collectionDescription").value;

//     if(name == "" ) {
//         alert("Please give a name to your collection!");
//         return;
//     }

//     let data = {
//         collectionName: name,
//         collectionDescription: description
//     };

//     fetch('/folder/new', {
//         method: 'POST', 
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     })
//     .then(response => {
//         if (response.ok) {
//             document.getElementById('createCollectionModal').style.display = 'none';
//             document.getElementById('overlay').style.display = 'none';
//             updateCollections();
//             } else {
//             alert("An error occurred: " + response.status);
//         }
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });
// });

// function updateCollections() {
//     fetch('/getFolders')
//         .then(response => response.json())
//         .then(data => {
//             let collectionsContainer = document.getElementById('myFoldersContainer');
//             collectionsContainer.innerHTML = '';
//             data.forEach(folder => {
//                 collectionsContainer.innerHTML += `
//                 <div class="flex justify-between items-center pl-8 pr-6 hover:bg-primary py-3">
//                     <a class="folder-item" data-id="${ folder.id }" href="#">${ folder.name }</a>
//                     <a href="#" data-id="${folder.id}" class="delete-folder text-gray-400 hover:text-white transition-colors duration-200">
//                         <i class="fa fa-trash"></i>
//                     </a>
//                 </div>
//                 `;
//             });
//             bindDeleteFolderEvents();
//         })
//         .catch((error) => {
//             console.error('Error:', error);
//         });
// }

// function bindDeleteFolderEvents() {
//     document.querySelectorAll('.delete-folder').forEach(deleteLink => {
//         deleteLink.addEventListener('click', function(e) {
//             e.preventDefault();

//             var id = this.dataset.id;
//             var url = `/delete_folder/${id}`;

//             fetch(url, { method: 'DELETE' })
//                 .then(response => {
//                     if (!response.ok) { throw response; }
//                     // Mettez à jour la liste des dossiers
//                     updateCollections();
//                 })
//                 .catch(error => {
//                     console.error('Error:', error);
//                 });
//         });
//     });
// }

// document.addEventListener('DOMContentLoaded', function() {
//     bindDeleteFolderEvents();
// });