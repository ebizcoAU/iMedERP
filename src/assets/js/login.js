
  var currLoc = $(location).attr('href'); 
  let pattern2 = /^(https:\/\/)[a-z]{0,16}(.antifake.vn\/)/;
  let result2 = pattern2.test(currLoc);
  if ((!result2) && (!currLoc.includes("localhost")) 
    && (!currLoc.includes("vitamax.ddns.net"))
    && (!currLoc.includes("adminvitamax.ddns.net")) 
    && (!currLoc.includes("admin.vitamax.antifake.vn")) 
    && (!currLoc.includes("vitamax.antifake.vn")) 
    && (!currLoc.includes("antifake.ddns.net")) ) {
    $('body').addClass("invisible")
  } 


function checkSubmit(e, formx) {
    if (e && e.keyCode == 13) {
        $('.login2').trigger( "click" )   
    }
}
$('.login2').click(function(){
  $.post(`/login2`, $('form#loginForm2').serialize(), function(data) {
    console.log("data:" + JSON.stringify(data, false, 4))
    if (data.status == 1) window.location.href = '/index';
    else $('#logintxt2').html(data.message);
  }, "json");

});

$('.reset_pwd2').click(function(){
  $('#logintxt2').html(`<p>Kiểm tra Email..</p>`);
  let timer = setTimeout(function(){window.location.href = '/';}, 5000);
  $.post(`/resetpwd2`, $('form#loginForm2').serialize(), function(data) {
    $('#logintxt2').html(`<p class='text-danger'>${data.title}</p>`);
    if (data.status==0) {
      clearTimeout(timer);
    }
  }, "json");
});

$('.newacc').click(function(){
  $('#registertxt').html(`<p><%= pleasewait %></p>`);
  let timer = setTimeout(function(){
    window.location.href = '/';
  }, 10000);
  $.post(`/newacc`, $('form#createForm').serialize(), function(data) {
    if (data.status == 0) {
      clearTimeout(timer);
      $('#registertxt').html(`<p class='text-danger'>${data.title}</p>`);
    }
  }, "json");
});
$('.newacc2').click(function(){
  $('#registertxt').html(`<p><%= pleasewait %></p>`);
  let timer = setTimeout(function(){
    window.location.href = '/';
  }, 10000);
  $.post(`/newacc2`, $('form#createForm2').serialize(), function(data) {
    if (data.status == 0) {
      clearTimeout(timer);
      $('#registertxt2').html(`<p class='text-danger'>${data.title}</p>`);
    }
  }, "json");
});

$('#logout').click(function(){
  $.get(`/logout`, function(data) {
      setTimeout(function() { window.location.href = '/login'; }, 200);
  });
});
