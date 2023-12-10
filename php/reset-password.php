<?php
include("config.php");
global $db;

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['action']) && $_POST['action'] === 'resetPassword') {
    $token = $_POST['token'] ?? '';
    $newpassword = $_POST['password'] ?? '';

    if (empty($token) || empty($newpassword)) {
        $response = [
            'status' => 400,
            'message' => 'Token and password are required.'
        ];
        echo json_encode($response);
        exit;
    }

    $token_hash = hash("sha256", $token);
    $sql = "SELECT * FROM owner WHERE reset_pwd_token_hash=?";
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt, 's', $token_hash);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $row = mysqli_fetch_assoc($result);
    $email = $row['email'];

    if ($row === null) {
        $response = [
            'status' => 404,
            'message' => 'Token not found.'
        ];
        echo json_encode($response);
    } elseif (strtotime($row["reset_pwd_expiry"]) <= time()) {
        $response = [
            'status' => 403,
            'message' => 'Token has expired.'
        ];
        echo json_encode($response);
    } else {
        $hashedNewPassword = password_hash($newpassword, PASSWORD_DEFAULT);
        $updateSql = "UPDATE owner SET password = ?, reset_pwd_token_hash = NULL,reset_pwd_expiry = NULL WHERE email = ?";
        $updateStmt = mysqli_prepare($db, $updateSql);

        if ($updateStmt) {
            mysqli_stmt_bind_param($updateStmt, 'ss', $hashedNewPassword, $email);

            if (mysqli_stmt_execute($updateStmt)) {
                $response = [
                    'status' => 200,
                    'message' => 'Password reset successfully.'
                ];
                echo json_encode($response);
            } else {
                $response = [
                    'status' => 500,
                    'message' => 'Error resetting password: ' . mysqli_error($db)
                ];
                echo json_encode($response);
            }

            mysqli_stmt_close($updateStmt);
        } else {
            $response = [
                'status' => 500,
                'message' => 'Error resetting password: ' . mysqli_error($db)
            ];
            echo json_encode($response);
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CartRabbit</title>
    <!-- Bootstrap CDN's -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous" />
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    <!-- Jquery CDN -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
</head>

<body>
    <div class="owner_login w-50 bg-warning p-5">
        <form id="reset_pwd_form">
            <div class="mb-3">
                <label for="password" class="form-label">New Password</label>
                <input type="password" class="form-control" name="password" required />
            </div>
            <input type="hidden" name="token" id="tokenInput" value="<?php echo isset($_GET['token']) ? htmlspecialchars($_GET['token']) : ''; ?>">
            <button type="submit" class="btn btn-success">Submit</button>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#pwdresetmodal">
                Forgot password?
            </button>
        </form>
    </div>
    <script>
        // Password reset ajax
        $("#reset_pwd_form").submit(function(event) {
            event.preventDefault();

            var formData = $(this).serialize();
            var token = $("#tokenInput").val();
            console.log(formData);
            $.ajax({
                type: "POST",
                url: "#", 
                data: formData + "&token=" + token + "&action=resetPassword",
                success: function(response) {
                    var res = JSON.parse(response);
                    $("#message").text(res.message);
                    if (res.status === 200) {
                        console.log(res);
                    } else {
                        console.log(res);
                    }
                },
                error: function(error) {
                    console.error(error);
                },
            });
        });
    </script>
</body>

</html>