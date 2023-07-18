$(document).ready(function(){
    $(".folder-item").click(function(){
        var folderName = $(this).data("name");

        $.ajax({
            url: '/changeFolder', 
            type: 'POST',
            data: {
                'folderName': folderName,
            },
            success: function(data){
                // Refresh the index content without reloading the whole page
                // This depends on the structure of your index.html.twig
            }
        });
    });
});

$(".folder-item").click(function(){
    var folderName = $(this).data("name");

    $.ajax({
        url: '/changeFolder', 
        type: 'POST',
        data: {
            'folderName': folderName,
        },
        success: function(data){
            // Get the updated currentFolder and update the header
            $.ajax({
                url: '/getCurrentFolder',
                type: 'GET',
                success: function(folder){
                    // Update the name of the current folder
                    $("#currentFolder").text(folder.name);
                    $("#descriptionElement").text(folder.description);

                    // Now get the tasks for this folder and update the task list
                    $.ajax({
                        url: '/getTasksForFolder/' + folder.name,
                        type: 'GET',
                        success: function(tasks){
                            // Empty the task list
                            $("#taskList").empty();

                            // Loop through the tasks and add each one to the task list
                            tasks.forEach(function(task){
                                var taskItem = '<div class="task-item mb-4 p-4 bg-gray-200 rounded shadow">' +
                                    '<h3 class="task-title font-bold mb-2">' + task.name + '</h3>' +
                                    '<p class="task-description mb-2">' + task.description + '</p>' +
                                    '<div class="task-controls"></div></div>';

                                $("#taskList").append(taskItem);
                            });
                        }
                    });
                }
            });
        }
    });
});
