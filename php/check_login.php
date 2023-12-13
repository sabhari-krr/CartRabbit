<?php
session_start();

if (isset($_SESSION['guest_id']) || isset($_SESSION['owner_id'])) {
    $response = [
        'status' => 200,
        'message' => 'User is logged in.',
    ];
    echo json_encode($response);

} else {
    $response = [
        'status' => 401,
        'message' => 'User is not logged in.',
    ];

    header("Location: ../index.html"); 
    echo json_encode($response);
    exit;
}

