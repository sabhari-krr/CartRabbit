$(document).ready(function () {
  // Check login status on page load
  checkLoginStatus();
});

function checkLoginStatus() {
  console.log("checkLoginStatus called");

  $.ajax({
    type: "POST",
    url: "php/check_login.php",
    success: function (response) {
      let res = JSON.parse(response);
      if (res.status !== 200) {
        // Option 1: Redirect based on AJAX response
        window.location.href = "index.html";

        // Option 2: Replace history with login page URL
        // window.history.replaceState({}, "Login", "login.html");
      }
    },
    error: function (error) {
      console.error(error);
    },
  });
}
