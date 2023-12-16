<?php
include("config.php");
session_start();
echo  "User is logged in is " . $_SESSION['guest_id'];
$query = "SELECT property.property_name, room.room_name, property.address_line, property.city, property.state, property.facilities
          FROM room
          INNER JOIN property ON room.house_id = property.house_id";
$statement = mysqli_prepare($db, $query);
mysqli_stmt_execute($statement);

if (mysqli_stmt_error($statement) !== "") {
    echo "Error executing the query: " . mysqli_stmt_error($statement);
} else {
    mysqli_stmt_bind_result($statement, $property_name, $room_name, $address_line, $city, $state, $facilities);
    while (mysqli_stmt_fetch($statement)) {
        echo '<div class="card mx-auto my-3">';
        echo '<div class="card-body d-sm-block d-md-flex justify-content-between align-items-center">';
        echo '<div class="">';
        echo "<div class='card-title'>$property_name</div>";
        echo "<div class='card-text'>$room_name</div>";
        echo "<div class='card-text mb-2'>$address_line, $city, $state</div>";
        $facilitiesArray = explode(',', $facilities);
        foreach ($facilitiesArray as $facility) {
            $trimmedFacility = trim($facility);
            if (!empty($trimmedFacility)) {
                echo "<span class='bg-secondary py-1 px-2 mx-1 rounded-2 text-white'>$trimmedFacility</span>";
            }
        }
        echo '</div>';
        echo '<div class="text-center">';
        echo "<button class='btn btn-primary' data-bs-toggle='modal' data-bs-target='#exampleModal'>Check Availability</button>";
        echo '</div>';
        echo '</div>';
        echo '</div>';
    }
    mysqli_stmt_close($statement);
}
