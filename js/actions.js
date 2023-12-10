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
  // Propertry Showcase part
 $("#displayPropertiesBtn").click(function () {
   // Send an AJAX request to fetch and display properties
   $.ajax({
     url: "php/actions.php",
     type: "POST",
     dataType: "json",
     data: { action: "displayProperty" },
     success: function (response) {
       if (response.status === 200) {
         // Properties fetched successfully
         displayPropertyCards(response.data);
       } else {
         console.error(response.message);
       }
     },
     error: function (error) {
       console.error("Error fetching properties:", error);
     },
   });
 });
  function fetchProperties() {
    $.ajax({
      url: "php/actions.php",
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.status === 200) {
          // Properties fetched successfully
          displayPropertyCards(response.data);
        } else {
          console.error(response.message);
        }
      },
      error: function (error) {
        console.error("Error fetching properties:", error);
      },
    });
  }

  function displayPropertyCards(properties) {
    var container = $("#propertyContainer");
    container.empty();

    properties.forEach(function (property) {
      var facilities = property.facilities.split(",");
      var badgesHtml = facilities
        .map(
          (facility) =>
            `<span class="badge bg-secondary">${facility.trim()}</span>`
        ).join(" ");
        // console.log(badgesHtml);
      var cardHtml = `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${property.property_name}</h5>
                            <p class="card-text">${property.address_line}</p>
                            <p class="card-text">${property.country}</p>
                            <p class="card-text">${property.state}</p>
                            <p class="card-text">${property.city}</p>
                            <p class="card-text">${property.postalZip}</p>
                            <p class="card-text">${badgesHtml}</p>
                        </div>
                    </div>
                </div>
            `;

      container.append(cardHtml);
    });
  }
});
