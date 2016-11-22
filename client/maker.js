$(document).ready(function() {

  const handleError = (message) => {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({width:'toggle'},350);
  }

  const formEntry = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if($("#newNickname").val() == '') {
        handleError("Must enter a new nickname");
        return false;
    }

    sendAjax($("#domoForm").attr("action"), $("#domoForm").serialize());

    return false;
  }

  const sendAjax = (action, data) => {
    $.ajax({
      cache: false,
      type: "POST",
      url: action,
      data: data,
      dataType: "json",
      success: (result, status, xhr) => {
          $("#domoMessage").animate({width:'hide'},350);

          window.location = result.redirect;
      },
      error: (xhr, status, error) => {
          const messageObj = JSON.parse(xhr.responseText);

          handleError(messageObj.error);
      }
    });        
  }

  $("#makeDomoSubmit").on("click", (e) => {
    formEntry(e);
  });
  $("#newNickname").on("keypress", (e) => {
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13'){
      formEntry(e);
    }
  });
    
});