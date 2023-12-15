$(document).ready(function () {
  //Animations for Login and Registrations
  $(".owner_login").hide();
  $(".owner_reg").hide();
  $(".customer_login").hide();
  $(".customer_reg").hide();

  $("#owner").click(function () {
    $(".owner_login").show("slow");
    $(".owner_reg").hide();
    $(".customer_login").hide();
    $(".customer_reg").hide();
  });
  $("#owner_reg_trigger").click(function () {
    $(".owner_reg").show("slow");
    $(".owner_login").hide();
    $(".customer_login").hide();
    $(".customer_reg").hide();
  });
  $("#owner_login_trigger").click(function () {
    $(".owner_login").show("slow");
    $(".owner_reg").hide();
    $(".customer_login").hide();
    $(".customer_reg").hide();
  });
  $("#customer").click(function () {
    $(".customer_login").show("slow");
    $(".customer_reg").hide("fast");
    $(".owner_login").hide();
    $(".owner_reg").hide();
  });
  $("#customer_reg_trigger").click(function () {
    $(".customer_reg").show("slow");
    $(".customer_login").hide("fast");
    $(".owner_login").hide();
    $(".owner_reg").hide();
  });
  $("#customer_login_trigger").click(function () {
    $(".customer_login").show("slow");
    $(".customer_reg").hide("fast");
    $(".owner_login").hide();
    $(".owner_reg").hide();
  });
});
