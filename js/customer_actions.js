$(document).ready(function () {
  $("#cust_reg_form").submit(function (event) {
    event.preventDefault();
    $.ajax({
      type: "POST",
      url: "php/authentication.php",
      data: $(this).serialize() + "&action=registerCustomer",
      success: function (response) {
        let res = JSON.parse(response);
        $("#cust_reg_form")[0].reset();
        if (res.status == 200) {
          // alert(res.message);
          Swal.fire({
            title: "Success!",
            text: "Registered!",
            icon: "success",
          });
          $("#customer_login_trigger").trigger("click");
        } else if (res.status == 409 || res.status == 422) {
          // alert(res.message);
          Swal.fire({
            title: "Oops!",
            text: res.message,
            icon: "warning",
          });
        } else {
          // alert("Error: " + res.message);
          Swal.fire({
            title: "Oh uh!",
            text: res.message,
            icon: "error",
          });
        }
      },
      error: function (error) {
        console.error(error);
      },
    });
  });
  //   Customer login Ajax
  $("#cust_login_form").submit(function (event) {
    event.preventDefault();
    $.ajax({
      type: "POST",
      url: "php/authentication.php",
      data: $(this).serialize() + "&action=loginCustomer",
      success: function (response) {
        let res = JSON.parse(response);
        $("#owner_login_form")[0].reset();
        if (res.status == 200) {
          // alert(res.message);
          // document.cookie = "guest_id=" + res.guest_id;
          // window.location.href = "rooms.html";
          // console.log(res);
          Swal.fire({
            title: "Success!",
            text: "Logged In!",
            icon: "success",
            didClose: () => {
              window.location.href = "booking.html";
            },
          });
        } else if (res.status == 404) {
          // alert(res.message);
          Swal.fire({
            title: "Oh uh!",
            text: "User not found!",
            icon: "warning",
          });
        } else {
          Swal.fire({
            title: "Oops!",
            text: "Wrong Password!",
            icon: "warning",
          });
        }
      },
      error: function (error) {
        console.error(error);
      },
    });
  });
  // Lotout Ajax
  $("#logoutButton").click(function () {
    $.ajax({
      type: "POST",
      url: "php/authentication.php",
      data: { action: "logout" },
      success: function (response) {
        let res = JSON.parse(response);
        if (res.status == 200) {
          Swal.fire({
            title: "Success!",
            text: "Logged out!",
            icon: "success",
            didClose: () => {
              window.location.href = "index.html";
            },
          });
        } else {
          Swal.fire({
            title: "Oops!",
            text: res.message,
            icon: "warning",
          });
        }
      },
      error: function (error) {
        console.error(error);
      },
    });
  });
  //end of document ready
});

//out of document ready
