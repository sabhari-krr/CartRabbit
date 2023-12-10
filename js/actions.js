$(document).ready(function () {
  $("#owner_reg_form").submit(function (event) {
    event.preventDefault();
    $.ajax({
      type: "POST",
      url: "php/actions.php",
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
      url: "php/authentication.php",
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
      url: "php/authentication.php",
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
      url: "php/actions.php",
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
  // fetchProperties();
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
          displayNoPropertiesMessage();
        }
      },
      error: function (error) {
        console.error("Error fetching properties:", error);
      },
    });
  });

  // function fetchProperties() {
  //   $.ajax({
  //     url: "php/actions.php",
  //     type: "GET",
  //     dataType: "json",
  //     data: { action: "displayProperty" },
  //     success: function (response) {
  //       if (response.status === 200) {
  //         // Properties fetched successfully
  //         displayPropertyCards(response.data);
  //       } else {
  //         console.error(response.message);
  //       }
  //     },
  //     error: function (error) {
  //       console.error("Error fetching properties:", error);
  //     },
  //   });
  // }

  function displayPropertyCards(properties) {
    var container = $("#propertyContainer");
    container.empty();

    properties.forEach(function (property) {
      var facilities = property.facilities.split(",");
      var badgesHtml = facilities
        .map(
          (facility) =>
            `<span class="badge bg-secondary">${facility.trim()}</span>`
        )
        .join(" ");
      // console.log(badgesHtml);
      var cardHtml = `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${property.property_name}</h5>
                            <p class="card-text">Property ID is${property.house_id}</p>
                            <p class="card-text">${property.address_line}</p>
                            <p class="card-text">${property.country}</p>
                            <p class="card-text">${property.state}</p>
                            <p class="card-text">${property.city}</p>
                            <p class="card-text">${property.postalZip}</p>
                            <p class="card-text">${badgesHtml}</p>
              <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="editProperty(${property.house_id})">Edit</button>

                            <button class="btn btn-outline-danger" onclick="confirmDelete(${property.house_id})">Delete</button>
                        </div>
                    </div>
                </div>
            `;

      container.append(cardHtml);
    });
  }
  // Function to display a message when no properties are found
  function displayNoPropertiesMessage() {
    var container = $("#propertyContainer");
    container.empty();

    var messageHtml = `<p class="lead text-center">No properties available</p>`;
    container.append(messageHtml);
  }
  // Save changes button inside the modal
  $("#staticBackdrop").on("hidden.bs.modal", function () {
    // Clear the form when the modal is closed
    $("#edit_property_form")[0].reset();
  });

  $("#edit_property_form").submit(function (event) {
    event.preventDefault();

    $.ajax({
      type: "POST",
      url: "php/actions.php",
      data: $(this).serialize() + "&action=updateProperty",
      success: function (response) {
        var res = JSON.parse(response);

        if (res.status == 200) {
          alert(res.message);
          // Refresh the displayed properties after updating
          $("#displayPropertiesBtn").trigger("click");
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
//outside document ready
function confirmDelete(houseId) {
  if (confirm("Are you sure you want to delete this property?")) {
    // If the user confirms, delete the property
    deleteProperty(houseId);
  }
}

function deleteProperty(houseId) {
  $.ajax({
    type: "POST",
    url: "php/actions.php",
    data: { action: "deleteProperty", house_id: houseId },
    success: function (response) {
      var res = JSON.parse(response);
      if (res.status == 200) {
        alert(res.message);
        // Refresh the displayed properties after deletion
        displayPropertyCards();
      } else {
        alert("Error: " + res.message);
      }
    },
    error: function (error) {
      console.error(error);
    },
  });
}

function editProperty(houseId) {
  // Fetch property details using AJAX
  $.ajax({
    type: "POST",
    url: "php/actions.php",
    data: { action: "getPropertyDetails", house_id: houseId },
    success: function (response) {
      var res = JSON.parse(response);
      if (res.status === 200) {
        var property = res.data;
        console.log("Property data from API:", property); // debug ku
        $("#edit_property_form input[name='house_id']").val(property.house_id);
        $("#edit_property_form input[name='property_name']").val(
          property.property_name
        );
        $("#edit_property_form input[name='address_line']").val(
          property.address_line
        );
        $("#edit_property_form input[name='country']").val(property.country);
        $("#edit_property_form input[name='state']").val(property.state);
        $("#edit_property_form input[name='city']").val(property.city);
        $("#edit_property_form input[name='postalZip']").val(
          property.postalZip
        );
        $("#edit_property_form input[name='location']").val(property.location);
        $("#edit_property_form input[name='facilities']").val(
          property.facilities
        );
        $("#staticBackdrop").modal("show");
      } else {
        alert("Error fetching property details: " + res.message);
      }
    },
    error: function (error) {
      console.error("Error fetching property details:", error);
    },
  });
}
