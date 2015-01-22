var NBS = function() {
  var _this = {};
  var _internal = 'alphasights';
  var _status = null;
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
    // message page
    'replyActive':'.gA.gt',
    'noReply':'.amn',
    'replyBox': '.fX.aXjCH', // under .gA.gt // check display for activation
    'wrapContact': '.vR', // the contact block when user confirm emails
    'replyBoxPresented':'.oL.aDm.az9',
    // popup page
    'popupNewMessage':'.AD',
    'popupMessageRightTopMinimizeButton': '.Hl', // check data-tooltip = Minimize || Maximize (oposite to status)
    'popupNewMessageMaximized':'', // check display for activation
    'popupReplyBox':'.fX.aXjCH', // under .AD // check display for activation
    'presentReplyBox': '.aoD.hl' // oposite to .fX.aXjCH, check display for activation
  };

  function init () {
    console.log('NBS.init');

    setInterval(function(){
      console.log('setTimeout');
      setupListener();
    }, 5*1000);

    window.onhashchange = onHashChange;
  }

  function onHashChange() {
      console.log('hashchange');
      setupListener();
  }

  function appendNoticBox() {
    console.log('NBS.appendNoticBox');

    $('.aoI').each(function(i, el){
      var $el = $(el);
      if($el.find('.noticebox').length === 0){
        var $popupNewMessage,popupNewMessage,isPopupNotice,noticeClass,$noticebox;
        $popupNewMessage = $(_g.popupNewMessage);
        popupNewMessage = $popupNewMessage.length && $popupNewMessage[0];
        isPopupNotice = $.contains(popupNewMessage, $el[0]);
        noticeClass = isPopupNotice? 'popupNotice' : 'onPageNotice';
        $noticebox =
          $('<div/>', {
            class: ['noticebox','alert','alert-warning',noticeClass].join(' ')
          })
            .hide();

        $el.append( $noticebox );
      }
    });
  }


  function setupListener() {
    console.log('setupListener');

    appendNoticBox();

    $(_g.recipientInput).off().focus(function(e){
      console.log('NBS.focus');
      setTimeout(function(){
        setupListener();
        checkRecipients(e);
      });
    });
    $(_g.recipientInput).off().keydown(function(e){
      console.log('NBS.keypress');
      setTimeout(function(){
        setupListener();
        checkRecipients(e);
      });
    });


    var status = checkStatus();
    if(status.msgPage.isReply && !status.msgPage.isReplyBoxActive ||
       status.popup.isMaximized
      ){

      checkRecipients();
    } else if(status.popup.isReplyBoxActive ||
       status.msgPage.isReplyBoxActive
       ){
      checkRecipients();
    }
  }

  function isElementContrain(parent, children) {
    return $.contains(parent, children);
  }

  function checkRecipients(e, isRemoveEmail) {
    console.log('checkRecipients', e);

    var target = e && $(e.target).parents(_g.recipientWrap) || _g.recipientWrap;
    var $wraps = $(target);

    $wraps.each(function(i, wrap){
      var $wrap, $email_els, $el, email, extenalEmails;
      extenalEmails = [];
      $wrap = $(wrap);
      $email_els = $wrap.find('[email]');

      var $popupNewMessage = $(_g.popupNewMessage);
      var popupNewMessage = $popupNewMessage.length && $popupNewMessage[0];
      var isWrapInPopup = isElementContrain(popupNewMessage, $wrap[0]);

      if($email_els.length){

        $email_els.each(function(i, el){
          $el = $(el);
          email = $el.attr('email');
          if(email.indexOf(_internal) === -1){
            if(extenalEmails.indexOf(email) === -1){
              extenalEmails.push(email);

              $el.find('.vM').off().on('click', function(e){
                console.log('contact-cross.click');
                checkRecipients(e, true);
              });
            }
          }
        });

        if(e && isRemoveEmail){
          var removeEmail = $(e.target).parents('.vN.Y7BVp[email]').attr('email');
          extenalEmails.splice(extenalEmails.indexOf(removeEmail), 1);
        }

        if(extenalEmails.length){
          showAlert({
            email: extenalEmails.join(', '),
            isPopup: isWrapInPopup
          });
        } else {
          hideAlert(isWrapInPopup);
        }
      } else {
        if(e && e.target){
          hideAlert(isWrapInPopup);
        }
      }
    });
  }

  function checkOnPageStatus(hash_arr) {
    var $noReply, $replyBox, isReply, isNoReplyFound, isNoReplyDisplay, isReplyBoxFound, isReplyBoxDisplay, messageID;
    $noReply = $(_g.noReply);
    $replyBox = $(_g.replyBox);
    isNoReplyFound = !!$noReply.length;
    isNoReplyDisplay = $noReply.css('display') !== "none";
    isReplyBoxFound = !!$replyBox.length;
    isReplyBoxDisplay = ($replyBox.css('display') !== "none");
    messageID = hash_arr[2] || ''; // 14aea826eba93d4e
    isReply = (!!messageID && !isNoReplyFound && !!isNoReplyDisplay) || false;

    return {
      id: messageID || '',
      isActive: !!messageID || false,
      isReply: isReply,
      isReplyBoxActive: (isReply && isReplyBoxFound && isReplyBoxDisplay) || false
    };
  }

  function checkPopupStatus(hash_arr){
    var isMaximized, popupStatus_arr, topRightMiniBtn, popupMessageReplyBox, isPopupMessageReplyBoxDisplay, isTopRightMinimizeButton, isPopupMessage, popupMessageID;

    topRightMiniBtn = $(_g.popupMessageRightTopMinimizeButton);
    popupMessageReplyBox = $(_g.popupNewMessage).find(_g.replyBox);
    isPopupMessageReplyBoxDisplay = (popupMessageReplyBox.css('display') !== "none");
    isTopRightMinimizeButton = (topRightMiniBtn.data('tooltip') === "Minimize");
    popupStatus_arr = hash_arr[3] && hash_arr[3].split('=') || [];
    isPopupMessage = (popupStatus_arr[0] === 'compose');
    popupMessageID = popupStatus_arr[1] || '';
    isMaximized = isTopRightMinimizeButton || false;

    return {
      id: popupMessageID || '',
      isActive: isPopupMessage || false,
      isMaximized: isMaximized,
      isReplyBoxActive: isMaximized && popupMessageReplyBox && isPopupMessageReplyBoxDisplay || false
    };
  }

  function checkStatus() {
    // inbox page: https://mail.google.com/mail/u/0/#inbox
    // message page: https://mail.google.com/mail/u/0/#inbox/14aea826eba93d4e
    // popup message: https://mail.google.com/mail/u/0/#inbox/14aea826eba93d4e?compose=new
    // drafts page: https://mail.google.com/mail/u/0/#drafts?compose=14af2e2e6fe7deae
    var hash, hash_arr, page, messageID, popupStatus, popupStatus_arr, status, msgPage, popup;

    hash = window.location.hash;
    hash_arr = hash.split(/#([^?/]+)?\/?([^/?]+)?\??([^&]+)?/);

    page = hash_arr[1]; // #inbox

    msgPage = checkOnPageStatus( hash_arr );
    popup = checkPopupStatus( hash_arr );

    status = {
      hash_arr: hash_arr,
      page: page,
      popupStatus: popupStatus,
      msgPage: msgPage,
      popup: popup
    };

    console.log('status:', status);
    return status;
  }

  function showAlert(data) {
    console.log('noticebox:show');
    var noticebox = data.isPopup? $('.noticebox.popupNotice') : $('.noticebox.onPageNotice');
    noticebox
      .show()
      .text('External Recipients: '+data.email);
  }

  function hideAlert(isPopup) {
    console.log('noticebox:hide');
    var noticebox = isPopup? $('.noticebox.popupNotice') : $('.noticebox.onPageNotice');
    noticebox
      .hide();
  }

  init();

  return _this;
};

$(document).ready(function(){
  window.noticeBeforeSend = new NBS();
});