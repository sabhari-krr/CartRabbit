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
  // Search rooms when the "Search Rooms" button is clicked
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
      url: "php/search_rooms.php", 
      data: { checkin: checkin, checkout: checkout, city: city },
      success: function (data) {
        $("#roomResults").html(data);
      },
      error: function (err) {
        console.log(err);
      },
    });
  });
  //   BOOKING SECTION
  $(document).on("click", ".book-btn", function () {
    // Get room ID from data attribute
    selectedRoomId = $(this).data("room-id");
    $("#checkinModal").val(selectedCheckin);
    $("#checkoutModal").val(selectedCheckout);

    $("#roomIdInput").val(selectedRoomId);
    $("#bookModal").modal("show");
  });

  // Handle book form submission
  $("#bookRoomForm").submit(function (e) {
    e.preventDefault();

    if (typeof selectedRoomId !== "undefined") {
      var roomId = selectedRoomId;
      var formData = $(this).serialize() + "&roomId=" + roomId;

      $.ajax({
        type: "POST",
        url: "php/book_room.php", 
        data: formData,
        dataType: "json", 
        success: function (response) {
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
