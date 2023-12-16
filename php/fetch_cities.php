<?php
include("config.php");
session_start();
$query = "SELECT DISTINCT city FROM property";
$result = mysqli_query($db, $query);
$options = "<option>Select a City</option>";
while ($row = mysqli_fetch_assoc($result)) {
    $options .= "<option value='" . $row["city"] . "'>" . $row["city"] . "</option>";
}

mysqli_free_result($result);

echo $options;
