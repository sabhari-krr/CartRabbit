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

        case 'displayProperty';
            displayProperty();
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
        return;
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
// Need to call this in html for displaying the properties for now called manually
displayProperty();
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
