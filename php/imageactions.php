<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Images</title>
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
    <!-- Bootstrap CDN's -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous" />
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
</head>

<body>
    <form id="addPics" enctype="multipart/form-data" class="p-4 bg-danger-subtle">
        <label for="propertySelect " class="form-label">Select Room:</label>
        <select id="propertySelect" name="room_id" class="form-control">
            <!-- Options will be dynamically loaded using AJAX -->
        </select>
        <div class="mb-3">
            <label for="images" class="form-label">Images</label>
            <input type="file" class="form-control" name="images[]" id="images" multiple accept="image/*" />
        </div>
        <button type="submit" class="btn btn-success">Submit</button>
    </form>
    <div id="imageContainer"></div>

    <script>
        $(document).ready(function() {
            // Viewing image
            $("#propertySelect").change(function() {
                var selectedRoom = $(this).val();
                console.log("Reached Image");
                // Fetch and display images for the selected room
                $.ajax({
                    type: "POST",
                    url: "fetchdata.php",
                    data: {
                        action: 'fetchImages',
                        room_id: selectedRoom
                    },
                    success: function(data) {
                        // Display the received HTML
                        $("#imageContainer").html(data);
                    },
                    error: function(err) {
                        console.log(err);
                    }
                });
            });
        });
        $(document).ready(function() {
            // Fetch room names using AJAX
            $.ajax({
                type: "POST",
                url: "fetchdata.php",
                data: {
                    action: 'fetchRooms' // Specify the action
                },
                success: function(data) {
                    // Populate the dropdown with fetched room names
                    $("#propertySelect").html(data);
                },
                error: function(err) {
                    console.log(err);
                }
            });
            // Handle delete image button click
            $("#imageContainer").on("click", ".delete-image", function() {
                var filename = $(this).data("filename");
                var selectedRoom = $("#propertySelect").val();

                // Send AJAX request to delete the image
                $.ajax({
                    type: "POST",
                    url: "fetchdata.php",
                    data: {
                        action: 'deleteImage',
                        room_id: selectedRoom,
                        filename: filename
                    },
                    success: function(response) {
                        console.log(response);
                        // Update the displayed images after deletion
                        $("#propertySelect").change();
                    },
                    error: function(err) {
                        console.log(err);
                    }
                });
            });
            // Handle form submission
            $("#addPics").submit(function(event) {
                event.preventDefault();
                // Specify the action
                var formData = new FormData(this);
                formData.append('action', 'uploadImages');
                formData.append('room_id', $("#propertySelect").val());
                $.ajax({
                    type: "POST",
                    url: "fetchdata.php",
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function(response) {
                        console.log(response);

                        let res = JSON.parse(response);

                        if (res.status == 200) {
                            alert(res.message);
                            // You can refresh the room names here if needed
                        } else {
                            alert("Error: " + res.message);
                        }
                    },
                    error: function(error) {
                        console.error(error);
                    },
                });
            });
        });
    </script>
</body>

</html>