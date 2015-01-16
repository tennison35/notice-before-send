var App = function() {
  var _this = {};
  var _internal = 'alphasights';
  var _timeout = null;
  var _id_list = [];
  var _g = {
    'recipientWrapActive':'.wO.nr.l1',
    'recipientWrap':'.wO.nr',
    'recipientInput':'textarea.vO',
    'lightboxWrap':'.ah.aiv.aJS',
    'lightboxWrapClass':'ah aiv aJS',
    'contactHighlighted': '.Jd-Je.Je',
    'contactHighlightedClass': 'Jd-Je Je',
    'contact':'.Jd-axF',
    'contactLowerText':'.Sr',
    'contactUpperText':'.am',
    'messageSendingBox': '.fX.aXjCH'
  }

  function init () {
    console.log('app.init');

    // detect the blur of the textbox
    setTimeout(function(){
      $(_g.recipientWrap).focusout(onBlurTextbox);
      $(_g.recipientWrap)[0].addEventListener('DOMNodeInserted', onBlurTextbox, false);
      $('.aoI').append(
         $('<div/>', {
            id: 'noticebox',
            class: 'alert alert-danger'
          })
          .hide()
      );
    }, 10*1000);
  }

  function onBlurTextbox(e){
    console.log('onBlurTextbox');
    var $wrap = $(_g.activedRecipientWrap)
    var $els = $wrap.find('[email]');
    var isExtenal = false;

    if(!$els.length) hideAlert();;

    $els.each(function(i, el){
      var $el = $(el);
      var email = $el.attr('email');
      isExtenal = isExtenal || (email.indexOf(_internal) === -1);
    });

    if(isExtenal){
      popupAlert({
        email: 'email'
      });
    } else {
      hideAlert();
    }
  }

  function popupAlert(data) {
    $('#noticebox').show().text('Do you really want to include '+data.email+' ?');
  }

  function hideAlert() {
    $('#noticebox').hide();
  }

  init();

  return _this;
};

$(document).ready(function(){
  window.noticeBeforeSend = new App();
});