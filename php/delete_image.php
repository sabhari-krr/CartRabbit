<?php
include("config.php");

if (isset($_GET['house_id']) && isset($_GET['room_id']) && isset($_GET['image'])) {
    $houseId = $_GET['house_id'];
    $roomIdToDelete = $_GET['room_id'];
    $imageToDelete = $_GET['image'];

    // Replace the image name along with any preceding or trailing commas
    if(mysqli_query($db, "UPDATE room SET images = REPLACE(images, '$imageToDelete', '') WHERE room_id = $roomIdToDelete AND house_id = $houseId")){

        echo "Image deleted successfully.";
    }
    else if(mysqli_query($db, "UPDATE room SET images = REPLACE(images, '$imageToDelete,', '') WHERE room_id = $roomIdToDelete AND house_id = $houseId")){
        echo "Image deleted successfully.";

    }
    

} else {
    echo "Invalid request.";
}
