<?php
include("config.php");
session_start();

// Action decider block
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['action'])) {
    $action = $_POST['action'];

    switch ($action) {
        case 'loginOwner':
            loginOwner();
            break;
        case 'resetPasswordRequest':
            resetPasswordRequest();
            break;
            // case 'resetPassword':
            //     resetPassword();
            //     break;
            // case 'logout':
            //     logout();
            //     break;

        default:
            $res = [
                'status' => 400,
                'message' => 'Invalid action'
            ];
            echo json_encode($res);
            break;
    }
}

function loginOwner()
{
    global $db;
    $email = mysqli_real_escape_string($db, $_POST['email']);
    $password = mysqli_real_escape_string($db, $_POST['password']);
    $emailCheckQuery = "SELECT * FROM owner WHERE email = ?";
    $emailCheck = mysqli_prepare($db, $emailCheckQuery);
    mysqli_stmt_bind_param($emailCheck, 's', $email);
    mysqli_stmt_execute($emailCheck);
    $resultCheckEmail = mysqli_stmt_get_result($emailCheck);
    if (mysqli_num_rows($resultCheckEmail) == 0) {
        // Account availability checking
        $response = [
            'status' => 404,
            'message' => 'User not found, please register'
        ];
        echo json_encode($response);
    } else {
        $user = mysqli_fetch_assoc($resultCheckEmail);
        $hashedPassword = $user['password'];
        if (password_verify($password, $hashedPassword)) {
            // Passwords match, login successful
            // Set user ID in the session
            $_SESSION['owner_id'] = $user['id'];
            $response = [
                'status' => 200,
                'message' => 'Login successful.....',
                'owner_id' => $user['id']
                // Add additional data if needed
            ];
            echo json_encode($response);
        } else {
            // Passwords do not match
            $response = [
                'status' => 401,
                'message' => 'Incorrect password'
            ];
            echo json_encode($response);
        }
    }
    mysqli_stmt_close($emailCheck);
}
function resetPasswordRequest()
{
    echo 1;
    global $db;
    $email = mysqli_real_escape_string($db, $_POST['email']);
    // $email="sabhari.a.krr@gmail.com";
    $token = bin2hex(random_bytes(16));
    $token_hash = hash("sha256", $token);
    $expiry = date("Y-m-d H:i:s", time() + 60 * 30);
    $hashgenQuery = "UPDATE owner SET reset_pwd_token_hash = ?,reset_pwd_expiry=? WHERE email=?";
    $hashgenStatement = mysqli_prepare($db, $hashgenQuery);
    mysqli_stmt_bind_param($hashgenStatement, 'sss', $token_hash, $expiry, $email);
    if (mysqli_stmt_execute($hashgenStatement)) {
        $affectedRows = mysqli_stmt_affected_rows($hashgenStatement);

        if ($affectedRows > 0) {
            $mail = require __DIR__ . "/mailer.php";
            $mail->setFrom("noreply@example.com");
            $mail->addAddress($email);
            $mail->Subject = "Password Reset";
            $mail->Body = <<<EOT
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      background-image: linear-gradient(to bottom right, #c9d6ff, #e2e8f0);
    }
    .container {
      max-width: 400px;
      width: 100%;
      padding: 20px;
      margin: 0 auto;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    h2 {
      color: #34495e;
      font-weight: 500;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
      margin-bottom: 20px;
    }
    a {
      display: inline-block;
      background-color: #B0CFEE;
      color: #333333;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 12px;
    }
    .logo {
      margin: 20px auto;
      width: 100px;
      height: 100px;
    }
  </style>
</head>
<body>
  <div class="container">
<img src="https://cdn-icons-png.flaticon.com/512/6195/6195699.png" width="100"/>
    <h2>Reset Your Password</h2>
    <p>We received a request to reset your password. Click the link below to choose a new one:</p>
    <a href="http://localhost/cartrabbit/php/reset-password.php?token={$token}">Reset Password</a>
    <p>If you didn't request a password reset, please ignore this email.</p>
  </div>
</body>
</html>

EOT;
            try {
                $mail->send();
                $res = [
                    'status' => 200,
                    'message' => 'Token generated and updated successfully. Message sent, please check your inbox'
                ];
                echo json_encode($res);
            } catch (Exception $e) {
                echo "Message could not be sent. Mailer error:{$mail->ErrorInfo}";
                $res = [
                    'status' => 500,
                    'message' => "Error sending email. Mailer error: {$mail->ErrorInfo}"
                ];
                echo json_encode($res);
            }
            // Query executed successfully and at least one row was affected
            echo "Token generated and updated successfully. Message sent, please check your inbox";
        } elseif ($affectedRows === 0) {
            // No rows were affected (email not found)
            echo "Email not found. No rows were updated.";
        } else {
            // Error occurred
            echo "Error updating token: " . mysqli_error($db);
        }
    } else {
        // Error occurred
        echo "Error updating token: " . mysqli_error($db);
    }

    // Close the statement
    mysqli_stmt_close($hashgenStatement);
}
