<?php
include("config.php");

// Check if the form data is received
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $checkin = date('Y-m-d', strtotime($_POST['checkin']));
    $checkout = date('Y-m-d', strtotime($_POST['checkout']));
    $city = $_POST['city'] ?? '';

    // Validate input
    if (empty($checkin) || empty($checkout) || empty($city)) {
        echo "Invalid input. Please provide check-in date, check-out date, and city.";
        exit;
    }

    $sql = "SELECT room.room_id, room.room_name, property.property_name
        FROM room
        INNER JOIN property ON room.house_id = property.house_id
        WHERE room.room_id NOT IN (
            SELECT room_id
            FROM booking
            WHERE (
                ('$checkin' BETWEEN checkin AND checkout)
                OR ('$checkout' BETWEEN checkin AND checkout)
                OR (checkin BETWEEN '$checkin' AND '$checkout')
            )
        ) AND property.city = ?";

    // Prepare and execute the query
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt, 's', $city);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    // Fetch and display results
    $rooms = mysqli_fetch_all($result, MYSQLI_ASSOC);
    mysqli_free_result($result);
    mysqli_stmt_close($stmt);

    // Display results for "No rooms available" message
    if (empty($rooms)) {
        echo "<div class='text-center fw-bolder'>
        <p>No rooms available for the selected dates in $city.</p>
        </div>";
    } else {
        foreach ($rooms as $room) {
            $roomDetailsQuery = "SELECT amenities, rent_per_day, property.location
                         FROM room
                         INNER JOIN property ON room.house_id = property.house_id
                         WHERE room.room_id = ?";

            $stmtRoomDetails = mysqli_prepare($db, $roomDetailsQuery);
            mysqli_stmt_bind_param($stmtRoomDetails, 's', $room['room_id']);
            mysqli_stmt_execute($stmtRoomDetails);
            mysqli_stmt_bind_result($stmtRoomDetails, $amenities, $rentPerDay, $location);
            mysqli_stmt_fetch($stmtRoomDetails);
            mysqli_stmt_close($stmtRoomDetails);

            // Fetch images for the room
            $imagesQuery = "SELECT images FROM images WHERE room_id = ?";
            $stmtImages = mysqli_prepare($db, $imagesQuery);
            mysqli_stmt_bind_param($stmtImages, 's', $room['room_id']);
            mysqli_stmt_execute($stmtImages);
            $imagesResult = mysqli_stmt_get_result($stmtImages);
            $roomImages = mysqli_fetch_all($imagesResult, MYSQLI_ASSOC);
            mysqli_free_result($imagesResult);
            mysqli_stmt_close($stmtImages);

            // Calculate total rent based on the selected dates
            $checkinDate = new DateTime($checkin);
            $checkoutDate = new DateTime($checkout);
            $stayDuration = $checkinDate->diff($checkoutDate)->days;
            $totalRent = $rentPerDay * ($stayDuration+1);
            $amenitiesArray = explode(',', $amenities);

            // Create HTML for badges
            $amenitiesBadges = implode(' ', array_map(
                function ($facility) {
                    return "<span class='badge bg-secondary py-2 px-3 m-1 rounded-pill'>" . trim($facility) . "</span>";
                },
                $amenitiesArray
            ));

            // Display room card with additional details, including carousel
            echo "<div class='card shadow  col-sm-12 col-md-6 mx-auto mb-4 card-deck'>";
            echo "<div id='carouselExample' class='carousel slide' data-bs-ride='carousel'>";
            echo "<div class='carousel-inner'>";

            // Display carousel items for each image
            foreach ($roomImages as $index => $image) {
                $activeClass = ($index === 0) ? 'active' : '';
                echo "<div class='carousel-item $activeClass'>";
                echo "<img src='assets/room_images/{$image['images']}' class='card-img-top' alt='Room Image'>";
                echo "</div>";
            }

            echo "</div>";
            echo "<button class='carousel-control-prev' type='button' data-bs-target='#carouselExample' data-bs-slide='prev'>";
            echo "<span class='carousel-control-prev-icon' aria-hidden='true'></span>";
            echo "<span class='visually-hidden'>Previous</span>";
            echo "</button>";
            echo "<button class='carousel-control-next' type='button' data-bs-target='#carouselExample' data-bs-slide='next'>";
            echo "<span class='carousel-control-next-icon' aria-hidden='true'></span>";
            echo "<span class='visually-hidden'>Next</span>";
            echo "</button>";
            echo "</div>";
            echo "<div class='card-body'>";
            echo "<h5 class='card-title fw-bolder text-center' style='color: #3c8c74;'>{$room['room_name']}</h5>";
            echo "<p class='card-text'><i class='fa-solid fa-hotel pe-2' style='color: #448c74;'></i>{$room['property_name']}</p>";
            echo "<p class='card-text fw-bolder'><i class='fa-solid fa-house-circle-exclamation pe-2' style='color: #3c8c74;'></i>Amenities:</p>";
            echo "<span class='ps-2'>$amenitiesBadges</span>";
            echo "<p class='mt-1 card-text fw-bolder'><i class='fa-solid fa-coins pe-2' style='color: #3c8c74;'></i>$rentPerDay&nbsp;/day</p>";
            echo "<p class='card- fw-bolder'><i class='fa-solid fa-money-bill-1-wave pe-2' style='color: #3c8c74;'></i>&nbsp;Total: $totalRent</p>";
            echo "<p class='card-text'><i class='fa-solid fa-compass pe-2' style='color: #3c8c74;'></i><a href='$location' target='_blank' class='link-secondary'>$location</a></p>";
            echo "<div class='text-center'>";
            echo "<button class='btn book-btn btn-custom' data-room-id='{$room['room_id']}' data-bs-toggle='modal' data-bs-target='#bookModal'>Book</button>";
            echo "</div>";
            echo "</div>";
            echo "</div>";
        }
    }
} else {
    echo "Invalid request.";
}
