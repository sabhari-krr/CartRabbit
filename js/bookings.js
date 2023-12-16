$(document).ready(function () {
    $.ajax({
      type: "POST",
      url: "php/bookings.php",
      
      success: function (data) {
        // Display the received HTML
        $("#test").html(data);
      },
      error: function (err) {
        console.log(err);
      },
    });
});
