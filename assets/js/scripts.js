$(function() {

  var dropbox = $('#dropbox'),
      secret = window.location.pathname;
  
  if(secret == '/' || secret == ""){
    $('#message').fadeIn(500);
  }
  else {
    $('#dropbox').fadeIn(500);
    $('#files').fadeIn(500);
  }

  dropbox.filedrop({
    paramname: 'files',
    maxfiles: 20,
    maxfilesize: 2000,
    url: secret,
    
    error: function(err, file) {
      switch (err) {
        case 'BrowserNotSupported':
        break;
        case 'TooManyFiles':
        break;
        case 'FileTooLarge':
        break;
        default:
        break;
      }
    },
    
    dragEnter: function(){
      $('#dropbox').css({'background': 'url(/assets/img/blue.png)'});
    },
    
    dragLeave: function(){
      $('#dropbox').css({'background': 'url(/assets/img/dark.jpg)'});
    },
    
    drop: function(){
      $('#dropbox').css({'background': 'url(/assets/img/dark.jpg)'});
    },
    
    beforeEach: function(file) {
      console.log(file);
      var preview = $('<li class="new uploading"=>0%</li>');
      $.data(file, preview);
      $('#files').prepend(preview);
    },
    
    uploadStarted: function(i, file, len) {
      console.log($.data(file));
    },
    
    progressUpdated: function(i, file, progress) {
      if(progress == 100){
        var message = "Processing...";
      }
      else {
        var message = progress + '%'; 
      }
      $.data(file).text(message);
    },
    
    uploadFinished: function(i, file, response) {
      $.data(file).html('<a target="_blank" href="' + s3Url + '/' + response.status.url + '">' + response.status.name + '</a>').removeClass('uploading').attr('id', 'id-' + response.status.id);
    }
    
  });
  
  $('#files li').live("mouseenter", function(){
    if( ! $(this).hasClass("uploading")){
      $(this).append('<a href="#delete" class="delete">x</a>');  
    }  
  }).live("mouseleave", function(){
    $('.delete').remove();
  });
  
  $('.delete').live("click", function(){
    var id = $(this).parent().attr("id").replace('id-', '');
    $(this).parent().fadeOut(function(){
      $(this).remove();
    });
    $.post("/delete", { id: id });
    return false;
  });

});