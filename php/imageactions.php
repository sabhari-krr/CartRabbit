<?php
include("config.php");
session_start();

global $db;
$owner_id = $_SESSION['owner_id'];

$query = "SELECT room_id, images FROM room WHERE owner_id = '$owner_id' AND house_id = 18";
$query_result = mysqli_query($db, $query);

if ($query_result) {
    if (mysqli_num_rows($query_result) == 0) {
        echo 'No Images Found';
    } else {
        while ($row = mysqli_fetch_assoc($query_result)) {
            $roomId = $row['room_id'];
            $images = explode(',', $row['images']);

            foreach ($images as $image) {
                $trimmedImage = trim($image);

                // Check if the trimmed image is not empty
                if (!empty($trimmedImage)) {
                    echo "<div>";
                    echo "<img src='../assets/room_images/$trimmedImage' alt='Room Image' height='200'><br>";
                    echo "<a href='delete_image.php?house_id=18&room_id=$roomId&image=$trimmedImage'>Delete</a>";
                    echo "</div>";
                }
            }
        }
    }
} else {
    echo 'Query Error';
}
