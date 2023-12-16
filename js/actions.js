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
          Swal.fire({
            title: "Email delivered",
            text: "Check your mailbox",
            icon: "success",
          });
          $("#pwdresetmodal").modal("hide");

        } else {
          // alert("Error: " + res.message);
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
  // Owner Logout Ajax
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
          // alert("Error: " + res.message);
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
  // ------------------------------
  // PROPERTY SECTION START
  // ------------------------------
  // Propertry Registration Form
  $("#add_property_form").submit(function (event) {
    event.preventDefault();
    $.ajax({
      type: "POST",
      url: "php/actions.php",
      data: $(this).serialize() + "&action=addPropertyRequest",
      success: function (response) {
        let res = JSON.parse(response);
        if (res.status == 200) {
          $("#add_property_form")[0].reset();
          Swal.fire({
            title: "Hurray!",
            text: "Property added!",
            icon: "success",
          });
          $("#displayPropertiesBtn").trigger("click");
          refreshList();
        } else {
          Swal.fire({
            title: "Oops!",
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
  // Propertry Showcase part
  $("#displayPropertiesBtn").click(function () {
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
            `<span class="badge bg-secondary py-2 px-3 m-1 rounded-pill">${facility.trim()}</span>`
        )
        .join(" ");
      let cardHtml = `
                <div class="col-md-4 mb-4">
                    <div class="card shadow">
                        <div class="card-body">
                            <h5 class="card-title fw-bolder text-center" style="color: #3c8c74;">${property.property_name}</h5>
                            <p class="card-text fw-bolder"><i class="fa-solid fa-location-dot pe-2" style="color: #3c8c74;"></i>Address</p>
                            <p class="card-text">${property.address_line}</p>
                            <p class="card-text">${property.city},&nbsp;&nbsp;${property.state},&nbsp;&nbsp;${property.country}</p>
                            <p class="card-text">${property.postalZip}</p>
                            <p class="card-text fw-bolder"><i class="fa-solid fa-house-circle-exclamation pe-2" style="color: #3c8c74;"></i>Facilities</p>
                            <p class="card-text">${badgesHtml}</p>
                            <p class="card-text fw-bolder"><i class="fa-solid fa-compass pe-2" style="color: #3c8c74;"></i>Location</p>
                            <p class="card-text"><a href="${property.location}" target="_blank" class="link-secondary">${property.location}</a></p>
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
  // Updating the property
  $("#edit_property_form").submit(function (event) {
    event.preventDefault();

    $.ajax({
      type: "POST",
      url: "php/actions.php",
      data: $(this).serialize() + "&action=updateProperty",
      success: function (response) {
        let res = JSON.parse(response);

        if (res.status == 200) {
          Swal.fire({
            title: "Changes updated!",
            icon: "success",
          });
          // Refresh the displayed properties after updating
          $("#displayPropertiesBtn").trigger("click");
          $("#staticBackdrop").modal("hide");
        } else {
          Swal.fire({
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
  // Function to refresh thelist after adding the property
  function refreshList() {
    // console.log("Called for refreshing list");
    //This ajax fetches the property list
    $.ajax({
      type: "POST",
      url: "php/actions.php",
      data: { action: "getPropertyNames" },
      success: function (response) {
        let res = JSON.parse(response);
        if (res.status == 200) {
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
    //This ajax fetches the house names list
    $.ajax({
      type: "POST",
      url: "php/actions.php",
      data: { action: "getHouseNames" },
      success: function (response) {
        let res = JSON.parse(response);
        if (res.status == 200) {
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
    //This ajax fetches the house names list for photos section
    $.ajax({
      type: "POST",
      url: "php/fetchdata.php",
      data: {
        action: "fetchRooms",
      },
      success: function (data) {
        $("#propertySelect").html(data);
      },
      error: function (err) {
        console.log(err);
      },
    });
  }
  // ------------------------------
  // PROPERTY SECTION END
  // ------------------------------
  // ------------------------------
  // ROOM SECTION START
  // ------------------------------
  // Room Adding form ajax
  $("#room_add_form").submit(function (event) {
    event.preventDefault();
    console.log("Room adding script logged");
    var formData = new FormData(this);
    formData.append("action", "addRoomRequest");
    $.ajax({
      type: "POST",
      url: "php/actions.php",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        let res = JSON.parse(response);
        if (res.status == 200) {
          $("#room_add_form")[0].reset();
          Swal.fire({
            title: "Room added!",
            icon: "success",
          });
          $("#displayRoomBtn").trigger("click");
        } else {
          Swal.fire({
            title: res.message,
            icon: "error",
          });
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

  // Room display and edits section ajax
  $("#displayRoomBtn").click(function () {
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
    let container = $("#roomContainer");
    container.empty();

    properties.forEach(function (room) {
      let amenities = room.amenities.split(",");
      let badgesHtml = amenities
        .map(
          (facility) =>
            `<span class="badge bg-secondary py-2 px-3 m-1 rounded-pill">${facility.trim()}</span>`
        )
        .join(" ");
      let cardHtml = `
                <div class="col-md-4 mb-4">
                    <div class="card shadow">
                        <div class="card-body">
                        <h5 class="card-title fw-bolder text-center" style="color: #3c8c74;">${room.room_name}</h5>
                        <p class="card-text"><i class="fa-solid fa-hotel pe-2" style="color: #448c74;"></i>${room.property_name}</p>
                            <p class="card-text"><i class="fa-solid fa-rupee-sign pe-2" style="color: #448c74;"></i>${room.rent_per_day}&nbsp;/day</p>
                            <p class="card-text">Mininum Stay:&nbsp;&nbsp;${room.min_stay}</p>
                            <p class="card-text">Maximum Stay:&nbsp;&nbsp;${room.max_stay}</p>
                            <p class="card-text">Floor Size:&nbsp;&nbsp;${room.floor_size}</p>
                            <p class="card-text"><i class="fa-solid fa-bed pe-2" style="color: #448c74;"></i>${room.bedQty}</p>
                            <p class="card-text fw-bolder"><i class="fa-solid fa-house-circle-exclamation pe-2" style="color: #3c8c74;"></i>Amenities</p>
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
    let container = $("#roomContainer");
    container.empty();

    let messageHtml = `<p class="lead text-center">No room available</p>`;
    container.append(messageHtml);
  }
  // Save changes button inside the modal
  $("#editRoom").on("hidden.bs.modal", function () {
    $("#edit_room_form")[0].reset();
  });
  // Updating the Room
  $("#edit_room_form").submit(function (event) {
    event.preventDefault();

    $.ajax({
      type: "POST",
      url: "php/actions.php",
      data: $(this).serialize() + "&action=updateRoom",
      success: function (response) {
        let res = JSON.parse(response);

        if (res.status == 200) {
          Swal.fire({
            title: "Changes updated!",
            icon: "success",
          });
          // Refresh the displayed properties after updating
          $("#editRoom").modal("hide");
          $("#displayRoomBtn").trigger("click");
        } else {
          Swal.fire({
            title: res.message,
            icon: "error",
          });
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
    $("#displayRoomBtn").trigger("click");
  });
  $("#displayRoomBtn").click(function () {
    let selectedProperty = $("#property_name").val();
    let selectedHouse = $("#house_name").val();

    //AJAX request to fetch and display rooms for the selected property and house
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

  //end of document ready
});

//outside document ready
function confirmDelete(houseId) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteProperty(houseId);
    }
  });
}

function deleteProperty(houseId) {
  $.ajax({
    type: "POST",
    url: "php/actions.php",
    data: { action: "deleteProperty", house_id: houseId },
    success: function (response) {
      let res = JSON.parse(response);
      if (res.status == 200) {
        Swal.fire({
          title: "Property deleted!",
          icon: "success",
        });
        // Refresh the displayed properties after updating
        $("#displayPropertiesBtn").trigger("click");
      } else {
        Swal.fire({
          title: res.message,
          icon: "success",
        });
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
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteRoom(roomID);
        }
      });

}

function deleteRoom(roomId) {
  $.ajax({
    type: "POST",
    url: "php/actions.php",
    data: { action: "deleteRoom", room_id: roomId },
    success: function (response) {
      let res = JSON.parse(response);
      if (res.status == 200) {
         Swal.fire({
           title: "Room deleted!",
           icon: "success",
         });
        // Refresh the displayed properties after updating
        $("#displayRoomBtn").trigger("click");
      } else {
        Swal.fire({
          title: "Room deleted!",
          icon: "error",
        });
      }
    },
    error: function (error) {
      console.error(error);
    },
  });
}