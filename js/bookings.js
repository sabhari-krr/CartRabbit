let selectedRoomId;
let selectedCheckin;
let selectedCheckout;

$(document).ready(function () {
  // Fetch city from db and display as options
  $.ajax({
    type: "POST",
    url: "php/fetch_cities.php",
    success: function (data) {
      $("#cityOptions").html(data);
    },
    error: function (err) {
      console.log(err);
    },
  });
  //   // Search rooms when the "Search Rooms" button is clicked
  $("#searchRooms").on("click", function () {
    // Get input values
    var checkin = $("input[name='checkin']").val();
    var checkout = $("input[name='checkout']").val();
    var city = $("#cityOptions").val();
    selectedCheckin = checkin;
    selectedCheckout = checkout;
    // Perform room search
    $.ajax({
      type: "POST",
      url: "php/search_rooms.php", // Replace with the actual PHP script for room search
      data: { checkin: checkin, checkout: checkout, city: city },
      success: function (data) {
        $("#roomResults").html(data);
      },
      error: function (err) {
        console.log(err);
      },
    });
  });
  //   Booking
  $(document).on("click", ".book-btn", function () {
    // Get room ID from data attribute
    selectedRoomId = $(this).data("room-id");
    $("#checkinModal").val(selectedCheckin);
    $("#checkoutModal").val(selectedCheckout);
    // var roomId = $(this).data("room-id");

    $("#roomIdInput").val(selectedRoomId);
    $("#bookModal").modal("show");
  });

  // Handle book form submission
  $("#bookRoomForm").submit(function (e) {
    e.preventDefault();

    // Ensure that selectedRoomId is defined before proceeding
    if (typeof selectedRoomId !== "undefined") {
      var roomId = selectedRoomId;
      var formData = $(this).serialize() + "&roomId=" + roomId;

      // Make an AJAX request to handle the booking process
      $.ajax({
        type: "POST",
        url: "php/book_room.php", // Replace with the actual PHP file to handle the booking
        data: formData,
        dataType: "json", // Expect JSON response
        success: function (response) {
          // Handle the response (success or error)
          if (response.success) {
            // Booking successful
            Swal.fire({
              title: "Success!",
              text: response.message,
              icon: "success",
            });
          } else {
            // Booking failed
            Swal.fire({
              title: "Error!",
              text: response.message,
              icon: "error",
            });
          }
        },
        error: function (err) {
          console.log(err);
        },
      });

      // Close the modal
      $("#bookModal").modal("hide");
    } else {
      console.error("selectedRoomId is not defined.");
    }
  });
});
