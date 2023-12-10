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
        case 'loginOwner':
            loginOwner();
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
function loginOwner                                                                                                                                                                              (){
    global $db;
    $email = mysqli_real_escape_string($db, $_POST['email']);
    $password = mysqli_real_escape_string($db, $_POST['password']);
    $emailCheckQuery = "SELECT * FROM owner WHERE email = ?";
    $emailCheck = mysqli_prepare($db, $emailCheckQuery);
    mysqli_stmt_bind_param($emailCheck, 's', $email);
    mysqli_stmt_execute($emailCheck);
    $resultCheckEmail = mysqli_stmt_get_result($emailCheck);
    if (mysqli_num_rows($resultCheckEmail) == 0) {
        // Email already exists
        $response = [
            'status' => 404,
            'message' => 'User not found, please register'
        ];
        echo json_encode($response);
    }
    else{


    }
}