<?php
include("config.php");
session_start();

$owner_id = $_SESSION['owner_id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        $action = $_POST['action'];

        switch ($action) {
            case 'fetchRooms':
                fetchRooms($owner_id);
                break;
            case 'uploadImages':
                uploadImages($owner_id);
                break;
            case 'fetchImages':
                $room_id = $_POST['room_id'];
                fetchImages($owner_id, $room_id);
                break;
            case 'deleteImage':
                $room_id = $_POST['room_id'];
                $filename = $_POST['filename'];
                deleteImage($owner_id, $room_id, $filename);
                break;
            default:
                respond(400, 'Invalid action.');
        }
    } else {
        respond(400, 'Action parameter missing.');
    }
} else {
    respond(400, 'Invalid request method.');
}

function fetchRooms($owner_id)
{
    global $db;

    $query = "SELECT room_id, room_name FROM room WHERE owner_id='$owner_id'";
    $result = mysqli_query($db, $query);
    $options="<option>Select a House</option>";
    while ($row = mysqli_fetch_assoc($result)) {
        $options .= "<option value='" . $row["room_id"] . "'>" . $row["room_name"] . "</option>";
    }

    echo $options;
    error_log('Reached this point: ' . __LINE__);
}

function uploadImages($owner_id)
{
    global $db;

    $room_id = $_POST['room_id'];

    // Specify your image upload directory
    $targetDir = "../assets/room_images/";

    // Array to store file names
    $images = [];

    if (!empty($_FILES['images']['name'])) {
        foreach ($_FILES['images']['name'] as $key => $value) {
            $tempName = $_FILES['images']['tmp_name'][$key];
            $fileName = time() . '_' . basename($value);
            $targetFilePath = $targetDir . $fileName;

            if (move_uploaded_file($tempName, $targetFilePath)) {
                $images[] = $fileName;
            } else {
                respond(500, 'Failed to upload images.');
            }
        }

        // Insert each image into the database
        foreach ($images as $image) {
            $insertQuery = "INSERT INTO images (owner_id, house_id, room_id, images) VALUES ('$owner_id', '19', '$room_id', '$image')";
            if (!mysqli_query($db, $insertQuery)) {
                respond(500, 'Failed to upload images to the database: ' . mysqli_error($db));
            }
        }

        respond(200, 'Images uploaded successfully.');
    } else {
        respond(400, 'No images selected for upload.');
    }
}



function respond($status, $message)
{
    $response = [
        'status' => $status,
        'message' => $message
    ];
    echo json_encode($response);
    exit();
    error_log('Reached this point: ' . __LINE__);
}
function fetchImages($owner_id, $room_id)
{
    global $db;

    $query = "SELECT images FROM images WHERE owner_id='$owner_id' AND room_id='$room_id'";
    $result = mysqli_query($db, $query);

    $imageHtml = '<div class="container d-flex flex-wrap">'; // Container with flex display

    while ($row = mysqli_fetch_assoc($result)) {
        $imageFilenames = explode(',', $row['images']);

        foreach ($imageFilenames as $filename) {
            $imageUrl = "assets/room_images/" . $filename;
            $imageHtml .= '<div class="card m-2 h-50" style="width: 18rem;">'; // Bootstrap card
            $imageHtml .= '<img src="' . $imageUrl . '" class="card-img-top img-thumbnail h-50" style="object-fit:cover" alt="Image">';
            $imageHtml .= '<div class="card-body">';
            $imageHtml .= '<button class="delete-image btn btn-danger rounded-pill" data-filename="' . $filename . '">Delete</button>';
            $imageHtml .= '</div>';
            $imageHtml .= '</div>';
        }
    }

    $imageHtml .= '</div>'; // Close the container

    echo $imageHtml;
    exit();
}

function deleteImage($owner_id, $room_id, $filename)
{
    global $db;

    // Delete the entire row from the database
    $deleteQuery = "DELETE FROM images WHERE owner_id = '$owner_id' AND room_id = '$room_id' AND images = '$filename'";
    if (!mysqli_query($db, $deleteQuery)) {
        respond(500, 'Failed to delete image from the database: ' . mysqli_error($db));
    }

    // Delete the actual file from the server
    $targetFilePath = "../assets/room_images/" . $filename;
    if (file_exists($targetFilePath) && !unlink($targetFilePath)) {
        respond(500, 'Failed to delete image file from the server.');
    }

    respond(200, 'Image deleted successfully.');
}
