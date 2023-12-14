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
          alert(res.message);
        } else if (res.status == 409) {
          alert(res.message);
        } else {
          alert("Error: " + res.message);
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
          alert(res.message);
          document.cookie = "guest_id=" + res.guest_id;
          window.location.href = "rooms.html";
          console.log(res);
        } else if (res.status == 401) {
          alert(res.message);
        } else {
          alert("Error: " + res.message);
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
          alert(res.message);
          window.location.href = "index.html";
        } else {
          alert("Error: " + res.message);
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
// Function to check login status
