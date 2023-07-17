console.log('tasks.js loaded');

$(document).ready(function() {
    $.get('/tasks', function(data) {
        // `data` is the JSON object returned by your `/tasks` endpoint
        for (var i = 0; i < data.length; i++) {
            var task = data[i];
            $('.task-list').append(
                '<div class="task-item mb-4 p-4 bg-gray-200 rounded shadow">' +
                    '<h3 class="task-title font-bold mb-2">' + task.title + '</h3>' +
                    '<p class="task-description mb-2">' + task.description + '</p>' +
                    '<div class="task-controls">' +
                        '<button class="custom-button bg-blue-500 text-white rounded px-2 py-1">Edit</button>' +
                        '<button class="custom-button bg-red-500 text-white rounded px-2 py-1">Delete</button>' +
                        '<button class="custom-button bg-green-500 text-white rounded px-2 py-1">Complete</button>' +
                    '</div>' +
                '</div>'
            );
        }
    });
});

document.getElementById('addTaskButton').addEventListener('click', function() {
    console.log('add task button clicked');
    var taskName = document.getElementById('taskInput').value;
    if (!taskName) {
        alert('Please enter a task name');
        return;
    }
    fetch('/add-task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: taskName, 
            // collection: app.session.get('currentCollection'), 
            description: 'No description'
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        refreshTaskList(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});


function refreshTaskList(tasks) {
    var taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    for (var i = 0; i < tasks.length; i++) {
        var task = tasks[i];
        var taskItem = document.createElement('div');
        taskItem.className = "task-item mb-4 p-4 bg-gray-200 rounded shadow";
        taskItem.innerHTML =
            '<h3 class="task-title font-bold mb-2">' + task.title + '</h3>' +
            '<p class="task-description mb-2">' + task.description + '</p>' +
            '<div class="task-controls">' +
                '<button class="custom-button bg-blue-500 text-white rounded px-2 py-1">Edit</button>' +
                '<button class="custom-button bg-red-500 text-white rounded px-2 py-1">Delete</button>' +
                '<button class="custom-button bg-green-500 text-white rounded px-2 py-1">Complete</button>' +
            '</div>';
        taskList.appendChild(taskItem);
    }
}
