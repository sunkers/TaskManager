document.addEventListener('DOMContentLoaded', function() {
    // Get the task container
    var taskContainer = document.getElementById('task-container');

    // Function to fetch tasks for a folder and update the task container
    var fetchTasks = function(folder) {
        // Fetch the tasks data
        fetch('/tasks?folder=' + encodeURIComponent(folder))
            .then(function(response) {
                return response.json();
            })
            .then(function(tasks) {
                // Clear the task container
                taskContainer.innerHTML = '';

                // Iterate over each task
                tasks.forEach(function(task) {
                    // Create an element for the task
                    var taskElement = document.createElement('div');
                    taskElement.textContent = task.name;

                    // Add the task element to the task container
                    taskContainer.appendChild(taskElement);
                });
            });
    };


    // Add click event handlers to the folder elements
    document.querySelectorAll('.folder-element').forEach(function(folderElement) {
        folderElement.addEventListener('click', function() {
            var folder = this.dataset.folder;

            // Update the current folder in the session
            fetch('/change-folder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'folder=' + encodeURIComponent(folder)
            })
            .then(function() {
                // Fetch the tasks for the new folder
                fetchTasks(folder);
            });
        });
    });
});