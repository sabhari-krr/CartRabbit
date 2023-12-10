$(document).ready(function () {
  $("#owner_reg_form").submit(function (event) {
    event.preventDefault();
    $.ajax({
      type: "POST",
      url: "php/actions.php", // Replace with your backend endpoint
      data: $(this).serialize() + "&action=registerOwner",
      success: function (response) {
        var res = JSON.parse(response);
        $("#owner_reg_form")[0].reset();
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
  //   Owner login Ajax
  $("#owner_login_form").submit(function (event) {
    event.preventDefault();
    $.ajax({
      type: "POST",
      url: "php/authentication.php", // Replace with your backend endpoint
      data: $(this).serialize() + "&action=loginOwner",
      success: function (response) {
        var res = JSON.parse(response);
        $("#owner_login_form")[0].reset();
        if (res.status == 200) {
          alert(res.message);
          window.location.href = "dashboard.html";
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
  //   Forgot Password Mail - Trigger & hash generation Ajax
  $("#pwd_reset_request_form").submit(function (event) {
    event.preventDefault();
    console.log("Came inside jquery");
    $.ajax({
      type: "POST",
      url: "php/authentication.php", // Replace with your backend endpoint
      data: $(this).serialize() + "&action=resetPasswordRequest",
      success: function (response) {
        var res = JSON.parse(response);
        $("#pwd_reset_request_form")[0].reset();
        if (res.status == 200) {
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
  // Propertry Registration Form
  $("#add_property_form").submit(function (event) {
    event.preventDefault();
    console.log("Came inside jquery");
    $.ajax({
      type: "POST",
      url: "php/actions.php", // Replace with your backend endpoint
      data: $(this).serialize() + "&action=addPropertyRequest",
      success: function (response) {
        var res = JSON.parse(response);
        $("#add_property_form")[0].reset();
        if (res.status == 200) {
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
});
