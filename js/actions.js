$(document).ready(function () {
  // ------------------------------
  // START OF OWNER REG & LOGIN
  // ------------------------------
  // Owner Registration Ajax
  $("#owner_reg_form").submit(function (event) {
    event.preventDefault();
    $.ajax({
      type: "POST",
      url: "php/authentication.php",
      data: $(this).serialize() + "&action=registerOwner",
      success: function (response) {
        let res = JSON.parse(response);
        $("#owner_reg_form")[0].reset();
        if (res.status == 200) {
          // alert(res.message);
          Swal.fire({
            title: "Success!",
            text: "Registered!",
            icon: "success",
          });
          $("#owner_login_trigger").trigger("click");
        } else if (res.status == 409) {
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
  //   Owner login Ajax
  $("#owner_login_form").submit(function (event) {
    event.preventDefault();
    $.ajax({
      type: "POST",
      url: "php/authentication.php",
      data: $(this).serialize() + "&action=loginOwner",
      success: function (response) {
        let res = JSON.parse(response);
        $("#owner_login_form")[0].reset();
        if (res.status == 200) {
          // alert(res.message);
          Swal.fire({
            title: "Success!",
            text: "Logged In!",
            icon: "success",
            didClose: () => {
              window.location.href = "dashboard.html";
            },
          });

          // console.log(res);
        } else if (res.status == 401) {
          Swal.fire({
            title: "Oops!",
            text: "Wrong Password",
            icon: "warning",
          });
        } else if (res.status == 404) {
          Swal.fire({
            title: "Oh uh!",
            text: "User not found!",
            icon: "error",
          });

          // alert("Error: " + res.message);
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
        let res = JSON.parse(response);
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
  // Owner Logout Ajax
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
  // ------------------------------
  // END OF OWNER REG & LOGIN
  // ------------------------------
  // ------------------------------
  // NAVIGATION BEHAVIOUR START
  // ------------------------------
  $("#tab-1").show();
  $("#tab-2,#tab-3,#tab-4,#tab-5").hide();

  $("#tab-trigger-1").click(function () {
    $("#tab-1").show("slow");
    $("#tab-2,#tab-3,#tab-4,#tab-5").hide("slow");

    $(".navbar-toggler").click();
  });
  $("#tab-trigger-2").click(function () {
    $("#tab-2").show("slow");
    $("#tab-1,#tab-3,#tab-4,#tab-5").hide("slow");

    $(".navbar-toggler").click();
    $("#displayPropertiesBtn").trigger("click");
  });
  $("#tab-trigger-3").click(function () {
    $("#tab-3").show("slow");
    $("#tab-1,#tab-2,#tab-4,#tab-5").hide("slow");
    $(".navbar-toggler").click();
  });
  $("#tab-trigger-4").click(function () {
    $("#tab-4").show("slow");
    $("#tab-1,#tab-2,#tab-3,#tab-5").hide("slow");
    $(".navbar-toggler").click();
    refreshList();
    $("#displayRoomBtn").trigger("click");
  });
  $("#tab-trigger-5").click(function () {
    $("#tab-5").show("slow");
    $("#tab-1,#tab-2,#tab-3,#tab-4").hide("slow");
    $(".navbar-toggler").click();
    refreshList();
  });
  // ------------------------------
  // NAVIGATION BEHAVIOUR END
  // ------------------------------
  // Propertry Registration Form
  $("#add_property_form").submit(function (event) {
    event.preventDefault();
    console.log("Came inside jquery");
    $.ajax({
      type: "POST",
      url: "php/actions.php",
      data: $(this).serialize() + "&action=addPropertyRequest",
      success: function (response) {
        let res = JSON.parse(response);
        if (res.status == 200) {
          $("#add_property_form")[0].reset();
          alert(res.message);
          // Refresh the displayed properties after updating
          $("#displayPropertiesBtn").trigger("click");
          refreshList();
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
          displayNoPropertiesMessage();
        }
      },
      error: function (error) {
        console.error("Error fetching properties:", error);
      },
    });
  });
  function displayPropertyCards(properties) {
    let container = $("#propertyContainer");
    container.empty();

    properties.forEach(function (property) {
      let facilities = property.facilities.split(",");
      let badgesHtml = facilities
        .map(
          (facility) =>
            `<span class="badge bg-secondary">${facility.trim()}</span>`
        )
        .join(" ");
      // console.log(badgesHtml);
      let cardHtml = `
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
    let container = $("#propertyContainer");
    container.empty();

    let messageHtml = `<p class="lead text-center">No properties available</p>`;
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
        let res = JSON.parse(response);

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
  // Function to refresh thelist after adding the property
  function refreshList() {
    console.log("Called for refreshing list");
    $.ajax({
      type: "POST",
      url: "php/actions.php",
      data: { action: "getPropertyNames" },
      success: function (response) {
        let res = JSON.parse(response);
        if (res.status == 200) {
          // Populate the dropdown with property names
          let propertyDropdown = $("#property_name");
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
    $.ajax({
      type: "POST",
      url: "php/actions.php",
      data: { action: "getHouseNames" },
      success: function (response) {
        let res = JSON.parse(response);
        if (res.status == 200) {
          // Populate the dropdown with property names
          let propertyDropdown = $("#house_name");
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
    $.ajax({
      type: "POST",
      url: "php/fetchdata.php",
      data: {
        action: "fetchRooms", // Specify the action
      },
      success: function (data) {
        // Populate the dropdown with fetched room names
        $("#propertySelect").html(data);
      },
      error: function (err) {
        console.log(err);
      },
    });
  }
  // Room Adding form ajax
  $("#room_add_form").submit(function (event) {
    event.preventDefault();
    console.log("Room adding script logged");
    var formData = new FormData(this);
    formData.append("action", "addRoomRequest");
    $.ajax({
      type: "POST",
      url: "php/actions.php",
      // data: $(this).serialize() + "&action=addRoomRequest",
      data: formData,
      processData: false, // Important: Don't process the files
      contentType: false,
      success: function (response) {
        let res = JSON.parse(response);
        if (res.status == 200) {
          $("#room_add_form")[0].reset();
          alert(res.message);
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

  // Fetch the property names for adding rooms
  $.ajax({
    type: "POST",
    url: "php/actions.php",
    data: { action: "getPropertyNames" },
    success: function (response) {
      let res = JSON.parse(response);
      if (res.status == 200) {
        // Populate the dropdown with property names
        let propertyDropdown = $("#property_name");
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

    let container = $("#roomContainer");
    container.empty();

    properties.forEach(function (room) {
      let amenities = room.amenities.split(",");
      let badgesHtml = amenities
        .map(
          (facility) =>
            `<span class="badge bg-secondary">${facility.trim()}</span>`
        )
        .join(" ");
      // let images = room.images.split(",");
      // let imagesHtml = images
      //   .map(
      //     (image) =>
      //       `<img src="assets/room_images/${image}" alt="Room Image" class="img-fluid shadow  h-100"  />`
      //   )
      //   .join(" ");
      console.log(badgesHtml);
      let cardHtml = `
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
                            <p class="card-text">Property Name: ${room.property_name}</p>
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
    let container = $("#roomContainer");
    container.empty();

    let messageHtml = `<p class="lead text-center">No room available</p>`;
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

        let res = JSON.parse(response);

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
  // Getting the house names
  $.ajax({
    type: "POST",
    url: "php/actions.php",
    data: { action: "getHouseNames" },
    success: function (response) {
      let res = JSON.parse(response);
      if (res.status == 200) {
        // Populate the dropdown with property names
        let propertyDropdown = $("#house_name");
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
  // Event listener for house dropdown change
  $("#house_name").on("change", function () {
    // Trigger the displayRoomBtn click event when the house selection changes
    $("#displayRoomBtn").trigger("click");
  });
  $("#displayRoomBtn").click(function () {
    // Get the selected property and house
    let selectedProperty = $("#property_name").val();
    let selectedHouse = $("#house_name").val();

    // Send an AJAX request to fetch and display rooms for the selected property and house
    $.ajax({
      url: "php/actions.php",
      type: "POST",
      dataType: "json",
      data: {
        action: "displayRoom",
        // property_name: selectedProperty,
        house_name: selectedHouse,
      },
      success: function (response) {
        if (response.status === 200) {
          // Rooms fetched successfully
          displayRoomCards(response.data);
        } else {
          displayNoRoomMessage();
        }
      },
      error: function (error) {
        console.error("Error fetching rooms:", error);
      },
    });
  });

  // $.ajax({
  //   type: "GET",
  //   url: "php/imageactions.php", // Replace with the correct path to your PHP file
  //   success: function (data) {
  //     // Inject the fetched content into the tab
  //     $("#tab-5").html(data);
  //   },
  //   error: function (err) {
  //     console.log(err);
  //   },
  // });
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
      let res = JSON.parse(response);
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
      let res = JSON.parse(response);
      if (res.status === 200) {
        let property = res.data;
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
      let res = JSON.parse(response);
      if (res.status === 200) {
        let property = res.data;
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
        displayRoomImages(room.images);

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
      let res = JSON.parse(response);
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
