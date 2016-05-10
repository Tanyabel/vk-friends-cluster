$(document).ready(function() {
  
  function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;    
      }
    }
  };

  var showAlert = function(message, type){
    $('.alert').hide();
    $('.alert-'+ type + ' span').html(message);
    $('.alert-'+ type).show();
  };

  var hideAlerts = function(){
    $('.alert').hide();
  };

  var showProgress = function(){
    $('.progress').show();
  };

  var hideProgress = function(){
    $('.progress').hide();
  };

  $('#login').click(function() {
    var link = 'https://oauth.vk.com/authorize?client_id=' + $('#clientId').val() + '&scope=friends,offline&redirect_uri=https://oauth.vk.com/blank.html&display=page&v=5.50&response_type=token';
    window.open(link);
  });

  var friends;
  $('#findFriends').click(function() {
    hideAlerts();
    showProgress();
    findFriends($('#token').val())
      .done(function (data){
        friends = $.grep(data.response, function(item, i) {
          return !item.deactivated;
        });

        var uids = $.map(friends, function(friend) {return friend.uid; });
        $.each(friends, function(index, friend) {
          if(index > 0 && (index % 2 === 0))
            sleep(1000);

          findCommonFriends($('#token').val(),friend.uid)
            .done(function(data){
              if(data.error) {
                showAlert(data.error.error_msg, 'error');
              }
              friend.friends = $.grep(data.response, function(item, i) {
                return _.contains(uids, item);
              });
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
              showAlert(jqXHR.responseText, 'error');
            });
        });

        showAlert('Найдено друзей: <strong>' + friends.length + '</strong>.', 'success');
        hideProgress();
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        showAlert(jqXHR.responseText, 'error');
        hideProgress();
      });
  });

  $('#getRelations').click(function() {
    hideAlerts();    
    if(!friends || friends.length == 0) {
      showAlert('Не удалось определить друзей.', 'error');
      return;
    }

    showProgress();
     var delta = parseFloat($('#delta').val());
     var groups = Algorithms.oldAlgorithm(friends, delta);
     showCirclePacking(groups);

    $('.progress').hide();
  });

  $('#graphTypes li a').click(function(){
    $('#graphs div').hide();
    var type = $(this).data('type');
    var navItem = $('#' + type);
    navItem.show();
    $('#graphTypes li').removeClass('active');
    $(this).parent().addClass('active');
  });
});
