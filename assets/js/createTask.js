// document.getElementById("createTask").addEventListener('click', function(event) {
//     console.log("create task button clicked");
//     event.preventDefault(); 

//     let name = document.getElementById("taskName").value;
//     let description = document.getElementById("taskDescription").value;

//     if(name == "" ) {
//         alert("Please give a name to your task!");
//         return;
//     }

//     let data = {
//         taskName: name,
//         taskDescription: description
//     };

//     fetch('/task/new', {
//         method: 'POST', 
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     })
//     .then(response => {
//         if (response.ok) {
//             return response.json();
//         } else {
//             throw new Error("Server response wasn't OK");
//         }
//     })
//     .then(taskData => {
//         document.getElementById('createTaskModal').style.display = 'none';
//         document.getElementById('overlay').style.display = 'none';
//         refreshTaskList(taskData);
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });
    
// });

// function refreshTaskList(tasks) {
//     var taskList = document.getElementById('taskList');
//     taskList.innerHTML = '';
//     for (var i = 0; i < tasks.length; i++) {
//         var task = tasks[i];
//         var taskItem = document.createElement('div');
//         taskItem.className = "task-item mb-4 p-4 bg-gray-200 rounded shadow";
//         taskItem.innerHTML =
//             '<h3 class="task-title font-bold mb-2">' + task.name + '</h3>' +
//             '<p class="task-description mb-2">' + task.description + '</p>';
//         taskList.appendChild(taskItem);
//     }
// }