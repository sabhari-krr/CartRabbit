<?php
include("config.php");
$getPropertiesQuery = "SELECT house_id, property_name FROM property";
$result = mysqli_query($db, $getPropertiesQuery);

if (!$result) {
    // Handle the error
    die("Error fetching properties: " . mysqli_error($db));
}

// Start building the HTML content
$html = '<option value="all">All Properties</option>';

// Loop through the properties and append options to the HTML
while ($property = mysqli_fetch_assoc($result)) {
    $html .= '<option value="' . $property['house_id'] . '">' . $property['property_name'] . '</option>';
}

// Return the HTML content
echo $html;

// Close the database connection
mysqli_close($db);
