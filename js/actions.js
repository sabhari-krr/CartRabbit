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
  // Lotout Ajax
  $("#logoutButton").click(function () {
    $.ajax({
      type: "POST",
      url: "php/authentication.php",
      data: { action: "logout" },
      success: function (response) {
        var res = JSON.parse(response);
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
        if (res.status == 200) {
          $("#add_property_form")[0].reset();
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
  // Room Adding form ajax
  $("#room_add_form").submit(function (event) {
    event.preventDefault();
    console.log("Room adding script logged");
    $.ajax({
      type: "POST",
      url: "php/actions.php",
      data: $(this).serialize() + "&action=addRoomRequest",
      success: function (response) {
        var res = JSON.parse(response);
        if (res.status == 200) {
          $("#room_add_form")[0].reset();
          alert(res.message);
          // Refresh the displayed properties after updating
          // $("#displayPropertiesBtn").trigger("click");
        } else {
          alert("Error: " + res.message);
        }
      },
      error: function (error) {
        console.error(error);
      },
    });
  });

  // Fetch the property names for adding rooms
  $.ajax({
    type: "POST",
    url: "php/actions.php",
    data: { action: "getPropertyNames" },
    success: function (response) {
      var res = JSON.parse(response);
      if (res.status == 200) {
        // Populate the dropdown with property names
        var propertyDropdown = $("#property_name");
        propertyDropdown.empty();
        $.each(res.data, function (index, property) {
          propertyDropdown.append(
            $("<option></option>").val(property).html(property)
          );
        });
      } else {
        alert("Error fetching property names: " + res.message);
      }
    },
    error: function (error) {
      console.error(error);
    },
  });
  // Room display and edits section
  $("#displayRoomBtn").click(function () {
    // Send an AJAX request to fetch and display properties
    $.ajax({
      url: "php/actions.php",
      type: "POST",
      dataType: "json",
      data: { action: "displayRoom" },
      success: function (response) {
        if (response.status === 200) {
          // Properties fetched successfully
          displayRoomCards(response.data);
        } else {
          displayNoRoomMessage();
        }
      },
      error: function (error) {
        console.error("Error fetching properties:", error);
      },
    });
  });
  function displayRoomCards(properties) {
    console.log(properties); // Log the received response

    var container = $("#roomContainer");
    container.empty();

    properties.forEach(function (room) {
      var amenities = room.amenities.split(",");
      var badgesHtml = amenities
        .map(
          (facility) =>
            `<span class="badge bg-secondary">${facility.trim()}</span>`
        )
        .join(" ");
      console.log(badgesHtml);
      var cardHtml = `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${room.room_name}</h5>
                            <p class="card-text">Property ID is${room.room_id}</p>
                            <p class="card-text">${room.rent_per_day}</p>
                            <p class="card-text">${room.min_stay}</p>
                            <p class="card-text">${room.max_stay}</p>
                            <p class="card-text">${room.floor_size}</p>
                            <p class="card-text">${room.bedQty}</p>
                            <p class="card-text">${badgesHtml}</p>
              <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#editRoom" onclick="editRoom(${room.room_id})">Edit</button>
                            <button class="btn btn-outline-danger" onclick="confirmRoomDelete(${room.room_id})">Delete</button>
                        </div>
                    </div>
                </div>
            `;

      container.append(cardHtml);
    });
  }
  function displayNoRoomMessage() {
    var container = $("#roomContainer");
    container.empty();

    var messageHtml = `<p class="lead text-center">No room available</p>`;
    container.append(messageHtml);
  }
  // Save changes button inside the modal
  $("#editRoom").on("hidden.bs.modal", function () {
    // Clear the form when the modal is closed
    $("#edit_room_form")[0].reset();
  });

  $("#edit_room_form").submit(function (event) {
    event.preventDefault();

    $.ajax({
      type: "POST",
      url: "php/actions.php",
      data: $(this).serialize() + "&action=updateRoom",
      success: function (response) {
        console.log(response); // Log the response to the console

        var res = JSON.parse(response);

        if (res.status == 200) {
          alert(res.message);
          // Refresh the displayed properties after updating
          $("#displayRoomBtn").trigger("click");
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
// Edit Room
function editRoom(roomId) {
  // Fetch property details using AJAX
  $.ajax({
    type: "POST",
    url: "php/actions.php",
    data: { action: "getRoomDetails", room_id: roomId },
    success: function (response) {
      var res = JSON.parse(response);
      if (res.status === 200) {
        var property = res.data;
        console.log("Property data from API:", property); // debug ku
        $("#edit_room_form input[name='room_id']").val(property.room_id);
        $("#edit_room_form input[name='room_name']").val(property.room_name);
        $("#edit_room_form input[name='floor_size']").val(property.floor_size);
        $("#edit_room_form input[name='bedQty']").val(property.bedQty);
        $("#edit_room_form input[name='amenities']").val(property.amenities);
        $("#edit_room_form input[name='min_stay']").val(property.min_stay);
        $("#edit_room_form input[name='max_stay']").val(property.max_stay);
        $("#edit_room_form input[name='rent_per_day']").val(
          property.rent_per_day
        );
        $("#editRoom").modal("show");
      } else {
        alert("Error fetching property details: " + res.message);
      }
    },
    error: function (error) {
      console.error("Error fetching property details:", error);
    },
  });
}
function confirmRoomDelete(roomID) {
  if (confirm("Are you sure you want to delete this room?")) {
    // If the user confirms, delete the property
    deleteRoom(roomID);
  }
}

function deleteRoom(roomId) {
  $.ajax({
    type: "POST",
    url: "php/actions.php",
    data: { action: "deleteRoom", room_id: roomId },
    success: function (response) {
      var res = JSON.parse(response);
      if (res.status == 200) {
        alert(res.message);
        // Refresh the displayed properties after updating
        $("#displayRoomBtn").trigger("click");
      } else {
        alert("Error: " + res.message);
      }
    },
    error: function (error) {
      console.error(error);
    },
  });
}