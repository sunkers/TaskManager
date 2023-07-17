document.addEventListener('DOMContentLoaded', function() {
    // Get the task container
    var taskContainer = document.getElementById('task-container');

    // Function to fetch tasks for a collection and update the task container
    var fetchTasks = function(collection) {
        // Fetch the tasks data
        fetch('/tasks?collection=' + encodeURIComponent(collection))
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

    // Fetch the tasks for the current collection
    fetchTasks(app.session.get('currentCollection'));

    // Add click event handlers to the collection elements
    document.querySelectorAll('.collection-element').forEach(function(collectionElement) {
        collectionElement.addEventListener('click', function() {
            var collection = this.dataset.collection;

            // Update the current collection in the session
            fetch('/change-collection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'collection=' + encodeURIComponent(collection)
            })
            .then(function() {
                // Fetch the tasks for the new collection
                fetchTasks(collection);
            });
        });
    });
});
