$(document).ready(function(){
    $(".collection-item").click(function(){
        var collectionName = $(this).data("name");

        $.ajax({
            url: '/changeCollection', 
            type: 'POST',
            data: {
                'collectionName': collectionName,
            },
            success: function(data){
                // Refresh the index content without reloading the whole page
                // This depends on the structure of your index.html.twig
            }
        });
    });
});

$(".collection-item").click(function(){
    var collectionName = $(this).data("name");

    $.ajax({
        url: '/changeCollection', 
        type: 'POST',
        data: {
            'collectionName': collectionName,
        },
        success: function(data){
            // Get the updated currentCollection and update the header
            $.ajax({
                url: '/getCurrentCollection',
                type: 'GET',
                success: function(collection){
                    // Update the name of the current collection
                    $("#currentCollection").text(collection.name);
                    $("#descriptionElement").text(collection.description);
                }
            });
            
        }
    });
});