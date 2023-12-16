<?php
include("config.php");
session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $roomId = $_POST['roomId'] ?? '';
    $adultQty = $_POST['adultQty'] ?? 0;
    $childrenQty = $_POST['childrenQty'] ?? 0;
    $checkinModal = date('Y-m-d', strtotime($_POST['checkinModal']));
    $checkoutModal = date('Y-m-d', strtotime($_POST['checkoutModal']));
    $guestId = $_SESSION['guest_id'] ?? '';

    // Fetch the maximum stay duration for the room
    $maxStayQuery = "SELECT max_stay FROM room WHERE room_id = ?";
    $stmtMaxStay = mysqli_prepare($db, $maxStayQuery);
    mysqli_stmt_bind_param($stmtMaxStay, 's', $roomId);
    mysqli_stmt_execute($stmtMaxStay);
    mysqli_stmt_bind_result($stmtMaxStay, $maxStay);
    mysqli_stmt_fetch($stmtMaxStay);
    mysqli_stmt_close($stmtMaxStay);

    // Calculate the duration of the stay
    $checkinDate = new DateTime($checkinModal);
    $checkoutDate = new DateTime($checkoutModal);
    $stayDuration = $checkinDate->diff($checkoutDate)->days;

    // Check if the stay duration exceeds the maximum stay
    if ($stayDuration > $maxStay) {
        echo json_encode(["success" => false, "message" => "Booking failed. Maximum stay duration exceeded for this room (Max Stay: $maxStay days)."]);
    } else {
        // Perform the booking
        $insertQuery = "INSERT INTO booking (room_id, guest_id, adultQty, childQty, checkin, checkout)
                        VALUES (?, ?, ?, ?, ?, ?)";

        $stmt = mysqli_prepare($db, $insertQuery);
        mysqli_stmt_bind_param($stmt, 'ssssss', $roomId, $guestId, $adultQty, $childrenQty, $checkinModal, $checkoutModal);

        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(["success" => true, "message" => "Booking successful!"]);
        } else {
            echo json_encode(["success" => false, "message" => "Booking failed. Please try again.", "maxStay" => $maxStay]);
        }

        mysqli_stmt_close($stmt);

        // Fetch customer email and room details
        $customerEmailQuery = "SELECT email FROM guest WHERE guest_id = ?";
        $stmtCustomerEmail = mysqli_prepare($db, $customerEmailQuery);
        mysqli_stmt_bind_param($stmtCustomerEmail, 's', $guestId);
        mysqli_stmt_execute($stmtCustomerEmail);
        mysqli_stmt_bind_result($stmtCustomerEmail, $customerEmail);
        mysqli_stmt_fetch($stmtCustomerEmail);
        mysqli_stmt_close($stmtCustomerEmail);

        $roomDetailsQuery = "SELECT room_name, property.property_name, property.location
                             FROM room
                             INNER JOIN property ON room.house_id = property.house_id
                             WHERE room.room_id = ?";
        $stmtRoomDetails = mysqli_prepare($db, $roomDetailsQuery);
        mysqli_stmt_bind_param($stmtRoomDetails, 's', $roomId);
        mysqli_stmt_execute($stmtRoomDetails);
        mysqli_stmt_bind_result($stmtRoomDetails, $roomName, $propertyName, $location);
        mysqli_stmt_fetch($stmtRoomDetails);
        mysqli_stmt_close($stmtRoomDetails);

        // Send booking confirmation email
        sendMail($customerEmail, $roomName, $propertyName, $checkinModal, $checkoutModal, $location);
    }
} else {
    // Handle case where form data is not received
    echo json_encode(["success" => false, "message" => "Invalid request."]);
}

function sendMail($customerEmail, $roomName, $propertyName, $checkinModal, $checkoutModal, $location)
{
    // Send booking confirmation email
    $subject = 'Room Booking Confirmation';
    $message = "
                <html>
                <head>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            margin: 0;
                            padding: 0;
                            background-color: #f4f4f4;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                        }
                        .container {
                            max-width: 600px;
                            background-color: #fff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            text-align: center;
                        }
                        h3 {
                            color: #3c8c74;
                        }
                        p {
                            font-size: 16px;
                            line-height: 1.5;
                            color: #333;
                        }
                        strong {
                            color: #3c8c74;
                        }
                        a {
                            color: #007bff;
                            text-decoration: none;
                        }
                        .logo {
                            width: 100px;
                            height: 100px;
                            margin: 0 auto 20px;
                            display: block;
                        }
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <img src='https://img.freepik.com/free-photo/3d-render-calendar-page-with-green-tick-icon_107791-15944.jpg?t=st=1702763828~exp=1702764428~hmac=7c90312d8c6a2a4203f645e92b18cfae0c866cc4f1c6b0e7f751257a7e08a31d' class='logo' alt='Logo'/>
                        <h3>Booking Confirmation</h3>
                        <p>Thank you for booking a room with us. Below are the details of your booking:</p>
                        <p><strong>Room:</strong> {$roomName}</p>
                        <p><strong>Property:</strong> {$propertyName}</p>
                        <p><strong>Check-in:</strong> $checkinModal</p>
                        <p><strong>Check-out:</strong> $checkoutModal</p>
                        <p><strong>Location:</strong> <a href='$location' target='_blank'>$location</a></p>
                        <p>We look forward to hosting you!</p>
                    </div>
                </body>
                </html>
            ";

    // Set content-type header for sending HTML email
    try {
        $mail = require __DIR__ . "/mailer.php";
        $mail->addAddress($customerEmail);
        $mail->Subject = $subject;
        $mail->Body = $message;

        $mail->send();
        // You can also log the success message for further investigation
        // error_log("Email sent successfully to $customerEmail");
    } catch (Exception $e) {
        // You can also log the error message for further investigation
        // error_log("Email error: " . $mail->ErrorInfo);
    }
}
