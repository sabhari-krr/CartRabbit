<?php
include("config.php");
session_start();

// Action decider block
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['action'])) {
    $action = $_POST['action'];

    switch ($action) {
        case 'registerOwner':
            registerOwner();
            break;

        case 'addPropertyRequest':
            addPropertyRequest();
            break;

        case 'displayProperty':
            displayProperty();
            break;
        case 'deleteProperty':
            deleteProperty();
            break;
        case 'getPropertyDetails':
            getPropertyDetails();
            break;
        case 'updateProperty':
            updateProperty();
            break;
            // Room start
        case 'addRoomRequest':
            addRoomRequest();
            break;
        case 'getPropertyNames':
            getPropertyNames();
            break;
        case 'displayRoom':
            displayRoom();
            break;
        case 'getRoomDetails':
            getRoomDetails();
            break;
        case 'updateRoom':
            updateRoom();
            break;
        default:
            $res = [
                'status' => 400,
                'message' => 'Invalid action'
            ];
            echo json_encode($res);
            break;
    }
}
function registerOwner()
{
    global $db;
    $name = mysqli_real_escape_string($db, $_POST['name']);
    $email = mysqli_real_escape_string($db, $_POST['email']);
    $mobile = mysqli_real_escape_string($db, $_POST['mobile']);
    $password = password_hash(mysqli_real_escape_string($db, $_POST['password']), PASSWORD_DEFAULT);
    if (empty($name) || empty($email) || empty($mobile) || empty($password)) {
        $res = [
            'status' => 422,
            'message' => 'All fields are mandatory'
        ];
        echo json_encode($res);
        return;
    } else {
        $emailCheckQuery = "SELECT * FROM owner WHERE email = ?";
        $emailCheck = mysqli_prepare($db, $emailCheckQuery);
        mysqli_stmt_bind_param($emailCheck, 's', $email);
        mysqli_stmt_execute($emailCheck);
        $resultCheckEmail = mysqli_stmt_get_result($emailCheck);
        if (mysqli_num_rows($resultCheckEmail) > 0) {
            // Email already exists
            $response = [
                'status' => 409,
                'message' => 'Email already exists, please choose another one.'
            ];
            echo json_encode($response);
        } else {
            // Email doesn't exist, proceed with registration
            $ownerRegQuery = "INSERT INTO owner (name, email, mobile, password) VALUES (?, ?, ?, ?)";
            $ownerReg = mysqli_prepare($db, $ownerRegQuery);
            mysqli_stmt_bind_param($ownerReg, 'ssss', $name, $email, $mobile, $password);

            if (mysqli_stmt_execute($ownerReg)) {
                // Registration successful
                $response = [
                    'status' => 200,
                    'message' => 'Registration successful.'
                ];
                echo json_encode($response);
            } else {
                // Registration failed
                $response = [
                    'status' => 500,
                    'message' => 'Registration failed. Please try again later.'
                ];
                echo json_encode($response);
            }

            // Close the statement
            mysqli_stmt_close($ownerReg);
        }

        // Close the statement
        mysqli_stmt_close($emailCheck);
    }
}
function addPropertyRequest()
{
    // Get the request data
    global $db;
    $owner_id = $_SESSION['owner_id'];
    $property_name = mysqli_real_escape_string($db, $_POST['property_name']);
    $address_line = mysqli_real_escape_string($db, $_POST['address_line']);
    $country = mysqli_real_escape_string($db, $_POST['country']);
    $state = mysqli_real_escape_string($db, $_POST['state']);
    $city = mysqli_real_escape_string($db, $_POST['city']);
    $postalZip = mysqli_real_escape_string($db, $_POST['postalZip']);
    $location = mysqli_real_escape_string($db, $_POST['location']);
    $facilities = mysqli_real_escape_string($db, $_POST['facilities']);
    // Insert query
    $addPropertyQuery = "INSERT INTO property (owner_id, property_name,
    address_line, country, state, city, postalZip, location, facilities) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $addProperty = mysqli_prepare($db, $addPropertyQuery);
    mysqli_stmt_bind_param(
        $addProperty,
        'sssssssss',
        $owner_id,
        $property_name,
        $address_line,
        $country,
        $state,
        $city,
        $postalZip,
        $location,
        $facilities
    );
    if (mysqli_stmt_execute($addProperty)) {
        // Registration successful
        $response = [
            'status' => 200,
            'message' => 'Property added successfully.'
        ];
        echo json_encode($response);
        // return;
    } else {
        // Registration failed
        $response = [
            'status' => 500,
            'message' => 'Property addition failed. Please try again later.'
        ];
        echo json_encode($response);
        return;
    }
    // Close the statement 
    mysqli_stmt_close($addProperty);
}
// Need to call this in html for displaying the properties as of now called manually
// displayProperty();
function displayProperty()
{
    global $db;
    $owner_id = $_SESSION['owner_id'];
    $query = "SELECT * FROM property WHERE owner_id = ?";
    $stmt = mysqli_prepare($db, $query);
    mysqli_stmt_bind_param($stmt, 's', $owner_id);
    if (mysqli_stmt_execute($stmt)) {
        $result = mysqli_stmt_get_result($stmt);
        if (mysqli_num_rows($result) > 0) {
            $response = [
                'status' => 200,
                'message' => 'Property fetched successfully.',
                'data' => mysqli_fetch_all(
                    $result,
                    MYSQLI_ASSOC
                )
            ];
            echo json_encode($response);
            return;
        } else {
            $response = [
                'status' => 404,
                'message' => 'No property found.'
            ];
            echo json_encode($response);
            return;
        }
    } else {
        $response = [
            'status' => 500,
            'message' => 'Property fetch failed. Please try again later.'
        ];
        echo json_encode($response);
        return;
    }
    // Close the statement
    mysqli_stmt_close($stmt);
}
// Deletion of property
function deleteProperty()
{
    global $db;
    $owner_id = $_SESSION['owner_id'];
    $house_id = $_POST['house_id'];

    // Check if the property belongs to the logged-in owner
    $checkOwnershipQuery = "SELECT * FROM property WHERE owner_id = ? AND house_id = ?";
    $checkOwnership = mysqli_prepare($db, $checkOwnershipQuery);
    mysqli_stmt_bind_param($checkOwnership, 'ss', $owner_id, $house_id);

    if (mysqli_stmt_execute($checkOwnership)) {
        $result = mysqli_stmt_get_result($checkOwnership);

        if (mysqli_num_rows($result) > 0) {
            // Property belongs to the owner, proceed with deletion
            $deletePropertyQuery = "DELETE FROM property WHERE house_id = ?";
            $deleteProperty = mysqli_prepare($db, $deletePropertyQuery);
            mysqli_stmt_bind_param($deleteProperty, 's', $house_id);

            if (mysqli_stmt_execute($deleteProperty)) {
                // Deletion successful
                $response = [
                    'status' => 200,
                    'message' => 'Property deleted successfully.'
                ];
                echo json_encode($response);
            } else {
                // Deletion failed
                $response = [
                    'status' => 500,
                    'message' => 'Property deletion failed. Please try again later.'
                ];
                echo json_encode($response);
            }

            // Close the statement
            mysqli_stmt_close($deleteProperty);
        } else {
            // Property doesn't belong to the owner
            $response = [
                'status' => 403,
                'message' => 'You do not have permission to delete this property.'
            ];
            echo json_encode($response);
        }
    } else {
        // Error checking ownership
        $response = [
            'status' => 500,
            'message' => 'Error checking property ownership. Please try again later.'
        ];
        echo json_encode($response);
    }

    // Close the statement
    mysqli_stmt_close($checkOwnership);
}
function getPropertyDetails()
{
    global $db;
    $house_id = $_POST['house_id'];

    // Select query to retrieve property details
    $getPropertyQuery = "SELECT * FROM property WHERE house_id = ?";
    $getProperty = mysqli_prepare($db, $getPropertyQuery);
    mysqli_stmt_bind_param($getProperty, 's', $house_id);

    if (mysqli_stmt_execute($getProperty)) {
        $result = mysqli_stmt_get_result($getProperty);

        if ($property = mysqli_fetch_assoc($result)) {
            // Property details retrieved successfully
            $response = [
                'status' => 200,
                'message' => 'Property details fetched successfully.',
                'data' => $property
            ];
            echo json_encode($response);
        } else {
            // Property not found
            $response = [
                'status' => 404,
                'message' => 'Property not found.'
            ];
            echo json_encode($response);
        }
    } else {
        // Error fetching property details
        $response = [
            'status' => 500,
            'message' => 'Error fetching property details. Please try again later.'
        ];
        echo json_encode($response);
    }

    // Close the statement
    mysqli_stmt_close($getProperty);
}
function updateProperty()
{
    global $db;
    $house_id = mysqli_real_escape_string($db, $_POST['house_id']);
    $property_name = mysqli_real_escape_string($db, $_POST['property_name']);
    $address_line = mysqli_real_escape_string($db, $_POST['address_line']);
    $country = mysqli_real_escape_string($db, $_POST['country']);
    $state = mysqli_real_escape_string($db, $_POST['state']);
    $city = mysqli_real_escape_string($db, $_POST['city']);
    $postalZip = mysqli_real_escape_string($db, $_POST['postalZip']);
    $location = mysqli_real_escape_string($db, $_POST['location']);
    $facilities = mysqli_real_escape_string($db, $_POST['facilities']);

    // Update query
    $updatePropertyQuery = "UPDATE property SET 
        property_name = '$property_name',
        address_line = '$address_line',
        country = '$country',
        state = '$state',
        city = '$city',
        postalZip = '$postalZip',
        location = '$location',
        facilities = '$facilities'
        WHERE house_id = '$house_id'";

    if (mysqli_query($db, $updatePropertyQuery)) {
        // Update successful
        $response = [
            'status' => 200,
            'message' => 'Property updated successfully.'
        ];
        echo json_encode($response);
    } else {
        // Update failed
        $response = [
            'status' => 500,
            'message' => 'Property update failed. Please try again later.'
        ];
        echo json_encode($response);
    }
}
// Adding room
function addRoomRequest()
{
    global $db;
    $owner_id = $_SESSION['owner_id'];
    $property_name = mysqli_real_escape_string($db, $_POST['property_name']);

    // Finding the house_id
    $houseidQuery = "SELECT house_id FROM property WHERE property_name = ?";
    $getHouseId = mysqli_prepare($db, $houseidQuery);
    mysqli_stmt_bind_param($getHouseId, 's', $property_name);
    mysqli_stmt_execute($getHouseId);
    mysqli_stmt_bind_result($getHouseId, $house_id);
    mysqli_stmt_fetch($getHouseId);
    mysqli_stmt_close($getHouseId);

    $room_name = mysqli_real_escape_string($db, $_POST['room_name']);
    $floor_size = mysqli_real_escape_string($db, $_POST['floor_size']);
    $bedQty = mysqli_real_escape_string($db, $_POST['bedQty']);
    $amenities = mysqli_real_escape_string($db, $_POST['amenities']);
    $min_stay = mysqli_real_escape_string($db, $_POST['min_stay']);
    $max_stay = mysqli_real_escape_string($db, $_POST['max_stay']);
    $rent_per_day = mysqli_real_escape_string($db, $_POST['rent_per_day']);

    $addRoomQuery = "INSERT INTO room (owner_id, house_id,
    room_name, floor_size, bedQty, amenities, min_stay, max_stay, rent_per_day) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $addRoom = mysqli_prepare($db, $addRoomQuery);
    mysqli_stmt_bind_param(
        $addRoom,
        'sssssssss',
        $owner_id,
        $house_id,
        $room_name,
        $floor_size,
        $bedQty,
        $amenities,
        $min_stay,
        $max_stay,
        $rent_per_day
    );
    if (mysqli_stmt_execute($addRoom)) {
        // Registration successful
        $updatePropertyQuery = "UPDATE property SET roomQty = roomQty + 1 WHERE house_id = ?";
        $updateProperty = mysqli_prepare(
            $db,
            $updatePropertyQuery
        );
        mysqli_stmt_bind_param($updateProperty, 's', $house_id);
        mysqli_stmt_execute($updateProperty);
        mysqli_stmt_close($updateProperty);
        $response = [
            'status' => 200,
            'message' => 'Room added successfully.'
        ];
        echo json_encode($response);
    } else {
        // Registration failed
        $response = [
            'status' => 500,
            'message' => 'Room addition failed. Please try again later.'
        ];
        echo json_encode($response);
    }

    // Close the statement 
    mysqli_stmt_close($addRoom);
}


// Fetch property names and return as JSON
function getPropertyNames()
{
    global $db;
    $propertyNamesQuery = "SELECT DISTINCT property_name FROM property WHERE owner_id = ?";
    $propertyNamesStatement = mysqli_prepare($db, $propertyNamesQuery);
    mysqli_stmt_bind_param($propertyNamesStatement, 's', $_SESSION['owner_id']);
    mysqli_stmt_execute($propertyNamesStatement);
    $resultPropertyNames = mysqli_stmt_get_result($propertyNamesStatement);
    $propertyNames = [];
    while ($row = mysqli_fetch_assoc($resultPropertyNames)) {
        $propertyNames[] = $row['property_name'];
    }
    mysqli_stmt_close($propertyNamesStatement);

    $res = [
        'status' => 200,
        'data' => $propertyNames,
    ];
    echo json_encode($res);
}
// Displaying rooms
// displayRoom();
function displayRoom()
{
    global $db;
    $owner_id = $_SESSION['owner_id'];
    $query = "SELECT * FROM room WHERE owner_id = ?";
    $stmt = mysqli_prepare($db, $query);
    mysqli_stmt_bind_param($stmt, 's', $owner_id);
    if (mysqli_stmt_execute($stmt)) {
        $result = mysqli_stmt_get_result($stmt);
        if (mysqli_num_rows($result) > 0) {
            $response = [
                'status' => 200,
                'message' => 'Room fetched successfully.',
                'data' => mysqli_fetch_all(
                    $result,
                    MYSQLI_ASSOC
                )
            ];
            echo json_encode($response);
            return;
        } else {
            $response = [
                'status' => 404,
                'message' => 'No property found.'
            ];
            echo json_encode($response);
            return;
        }
    } else {
        $response = [
            'status' => 500,
            'message' => 'Property fetch failed. Please try again later.'
        ];
        echo json_encode($response);
        return;
    }
    // Close the statement
    mysqli_stmt_close($stmt);
}
// Getting room filler details for editing
function getRoomDetails()
{
    global $db;
    $room_id = $_POST['room_id'];

    // Select query to retrieve property details
    $getRoomQuery = "SELECT * FROM room WHERE room_id = ?";
    $getRoom = mysqli_prepare($db, $getRoomQuery);
    mysqli_stmt_bind_param(
        $getRoom,
        's',
        $room_id
    );

    if (mysqli_stmt_execute($getRoom)) {
        $result = mysqli_stmt_get_result($getRoom);

        if ($property = mysqli_fetch_assoc($result)) {
            // Property details retrieved successfully
            $response = [
                'status' => 200,
                'message' => 'Room details fetched successfully.',
                'data' => $property
            ];
            echo json_encode($response);
        } else {
            // Property not found
            $response = [
                'status' => 404,
                'message' => 'Room not found.'
            ];
            echo json_encode($response);
        }
    } else {
        // Error fetching property details
        $response = [
            'status' => 500,
            'message' => 'Error fetching property details. Please try again later.'
        ];
        echo json_encode($response);
    }

    // Close the statement
    mysqli_stmt_close($getRoom);
}
// Update Room
function updateRoom()
{
    global $db;
    $room_id = mysqli_real_escape_string($db, $_POST['room_id']);
    $room_name = mysqli_real_escape_string($db, $_POST['room_name']);
    $floor_size = mysqli_real_escape_string($db, $_POST['floor_size']);
    $bedQty = mysqli_real_escape_string($db, $_POST['bedQty']);
    $amenities = mysqli_real_escape_string($db, $_POST['amenities']);
    $min_stay = mysqli_real_escape_string($db, $_POST['min_stay']);
    $max_stay = mysqli_real_escape_string($db, $_POST['max_stay']);
    $rent_per_day = mysqli_real_escape_string($db, $_POST['rent_per_day']);

    // Update query
    $updateRoomQuery = "UPDATE room SET 
        room_name = '$room_name',
        floor_size = '$floor_size',
        bedQty = '$bedQty',
        amenities = '$amenities',
        min_stay = '$min_stay',
        max_stay = '$max_stay',
        rent_per_day = '$rent_per_day'
        WHERE room_id = '$room_id'";

    if (mysqli_query($db, $updateRoomQuery)) {
        // Update successful
        $response = [
                'status' => 200,
                'message' => 'Room updated successfully.',
            ];
        echo json_encode($response);
        error_log("SQL Query: " . $updateRoomQuery);

    } else {
        // Update failed
        $response = [
                'status' => 500,
                'message' => 'Property update failed. Please try again later.'
            ];
        echo json_encode($response);
    }
}