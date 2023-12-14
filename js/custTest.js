$(document).ready(function () {
    $(document).ready(function () {
      $.ajax({
        url: "php/booking.php",
        type: "POST",
        data: {
          action: "displayRoom",
        },
        success: function (response) {
          $("#displayContainer").html(response);
        },
        error: function (error) {
          console.error("Error fetching rooms:", error);
        },
      });
    });

});