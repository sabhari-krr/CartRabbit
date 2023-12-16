$(document).ready(function () {
  // Viewing image
  $("#propertySelect").change(function () {
    var selectedRoom = $(this).val();
    console.log("Reached Image");
    // Fetch and display images for the selected room
    $.ajax({
      type: "POST",
      url: "php/fetchdata.php",
      data: {
        action: "fetchImages",
        room_id: selectedRoom,
      },
      success: function (data) {
        // Display the received HTML
        $("#imageContainer").html(data);
      },
      error: function (err) {
        console.log(err);
      },
    });
  });
});
$(document).ready(function () {
  // Fetch room names using AJAX
  $.ajax({
    type: "POST",
    url: "php/fetchdata.php",
    data: {
      action: "fetchRooms", // Specify the action
    },
    success: function (data) {
      // Populate the dropdown with fetched room names
      $("#propertySelect").html(data);
    },
    error: function (err) {
      console.log(err);
    },
  });
  // Handle delete image button click
  $("#imageContainer").on("click", ".delete-image", function () {
    var filename = $(this).data("filename");
    var selectedRoom = $("#propertySelect").val();

    // Send AJAX request to delete the image
    $.ajax({
      type: "POST",
      url: "php/fetchdata.php",
      data: {
        action: "deleteImage",
        room_id: selectedRoom,
        filename: filename,
      },
      success: function (response) {
        Swal.fire({
          title: "Image deleted!",
          icon: "success",
        });
        $("#propertySelect").change();
      },
      error: function (err) {
        console.log(err);
      },
    });
  });
  // Handle form submission
  $("#addPics").submit(function (event) {
    event.preventDefault();
    // Specify the action
    var formData = new FormData(this);
    formData.append("action", "uploadImages");
    formData.append("room_id", $("#propertySelect").val());
    $.ajax({
      type: "POST",
      url: "php/fetchdata.php",
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        let res = JSON.parse(response);

        if (res.status == 200) {
          Swal.fire({
            title: "Image uploaded!",
            icon: "success",
          });
          $("#propertySelect").change();
          $("#addPics")[0].reset();
        } else {
          alert("Error: " + res.message);
        }
      },
      error: function (error) {
        console.error(error);
      },
    });
  });
});
