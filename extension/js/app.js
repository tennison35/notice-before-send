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
  'replyArea': '.aoI',
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

var NoticeBox = function(parent, isPopup) {
  this.classes = ['noticebox','alert','alert-danger'];

  this.create();
  this.setType(isPopup);
  this.appendTo(parent);
  this.hide();
}

NoticeBox.prototype.appendTo = function(parent) {
  this.parent = parent;
  parent.attr('data-noticeBox-id', this.id);
  parent.append(this.$el);
}
NoticeBox.prototype.create = function(){
  this.id = Util.genId(10);

  this.$el = $('<div/>', {
    id: this.id,
    class: this.classes.join(' ')
  });

  return this.$el;
}

NoticeBox.prototype.setType = function(isPopup){
  this.isPopup = isPopup;
  this.$el.addClass(isPopup? 'popupNotice' : 'onPageNotice');
  this.$el.attr('data-isPopup', isPopup);
}
NoticeBox.prototype.hide = function(){
  console.log('noticebox id: '+this.id+' is hidden.');
  this.$el.hide();
}
NoticeBox.prototype.updateAndShow = function(data){
  this.updateText(data);
  this.show();
}

NoticeBox.prototype.show = function(){
  console.log('noticebox id: '+this.id+' is shown.');
  this.$el.show();
}
NoticeBox.prototype.updateText = function(data){
  this.$el.text('External Recipients: ' + data.email.join(', '));
}
var Util = {
  list: [],
  isElementContrain: function(parent, children) {
    return $.contains(parent, children);
  },
  genId: function (digit){
    digit = digit || 10;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    do {
      for( var i=0, len = possible.length; i < digit; i++ ){
        text += possible.charAt(Math.floor(Math.random() * len));
      }
    } while (this.list.indexOf(text) !== -1);

    this.list.push(text);

    return text;
  }
}

function onPageChecker () {
  this.type = "onpage";
  this.hash_arr = window.location.hash.split(/#([^?/]+)?\/?([^/?]+)?\??([^&]+)?/);
  this.$noReply = $(_g.noReply);
  this.$replyBox = $(_g.replyBox);

  this.setID(this.hash_arr[2] || null);

};
onPageChecker.prototype.setID = function(id) {
  this.id = id;
}
onPageChecker.prototype.status  = function() {
  return {
    id: this.id,
    isActive: this.isActive(),
    isReply: this.isReply(),
    isReplyBoxActive: this.isReplyBoxActive()
  };
}
onPageChecker.prototype.isActive = function() {
  return !!this.id || false;
}
onPageChecker.prototype.isReply = function() {
  var isNoReplyFound = !!this.$noReply.length;
  var isNoReplyDisplay = this.$noReply.css('display') !== "none";

  return (!!this.id && !isNoReplyFound && !!isNoReplyDisplay) || false;
}
onPageChecker.prototype.isReplyBoxActive = function() {
  var isReplyBoxFound = !!this.$replyBox.length;
  var isReplyBoxDisplay = (this.$replyBox.css('display') !== "none");

  return (this.isReply() && isReplyBoxFound && isReplyBoxDisplay) || false;
}

function PopupChecker () {
  this.hash_arr = window.location.hash.split(/#([^?/]+)?\/?([^/?]+)?\??([^&]+)?/);
  this.$topRightMiniBtn = $(_g.popupMessageRightTopMinimizeButton);
  this.$popupMessageReplyBox = $(_g.popupNewMessage).find(_g.replyBox);
  this.popupStatus_arr = this.hash_arr[3] && this.hash_arr[3].split('=') || [];

  this.setID(this.popupStatus_arr[1] || null);

  this.type = "popup";
};
PopupChecker.prototype.setID = function(id) {
  this.id = id;
}
PopupChecker.prototype.status  = function() {
  return {
    id: this.id,
    isActive: this.isActive(),
    isMaximized: this.isMaximized(),
    isReplyBoxActive: this.isReplyBoxActive()
  };
}
PopupChecker.prototype.isActive = function() {
  var isPopupMessage = (this.popupStatus_arr[0] === 'compose');
  return !!isPopupMessage || false;
}
PopupChecker.prototype.isMaximized = function() {
  var isTopRightMinimizeButton = (this.$topRightMiniBtn.data('tooltip') === "Minimize");

  return isTopRightMinimizeButton || false;
}
PopupChecker.prototype.isReplyBoxActive = function() {
  var isPopupMessageReplyBoxDisplay = (this.$popupMessageReplyBox.css('display') !== "none");
  return this.isMaximized() && this.$popupMessageReplyBox && isPopupMessageReplyBoxDisplay || false;
}

var App = function() {
  console.log('App.init');
  this.internal = 'alphasights';
  this.noticeboxes = [];

  window.onhashchange = $.proxy(this.updateStatus, this);

  setInterval($.proxy(function(){
    console.log('App.updateStatus');
    this.updateStatus();
  }, this), 3*1000);
}

App.prototype.get = function(noticeboxId){
  return this.noticeboxes[noticeboxId];
}

App.prototype.checkRecipients = function(e) {
  console.log('checkRecipients', e);

  var extenalEmails = [];
  var internal = this.internal;
  var app = this;

  this.$recipientWrap = $(_g.recipientWrap);
  this.replyArea = this.$recipientWrap.parents(_g.replyArea);
  var noticeboxId = this.replyArea.data('noticebox-id');

  console.log('noticeboxId:', noticeboxId);

  $(_g.recipientWrap).each(function(i, wrap){
    var $wrap, $email_els, $el, email;
    $wrap = $(wrap);
    $email_els = $wrap.find('[email]');

    var $popupNewMessage = $(_g.popupNewMessage);
    var popupNewMessage = $popupNewMessage.length && $popupNewMessage[0];
    var isWrapInPopup = Util.isElementContrain(popupNewMessage, $wrap[0]);

    if($email_els.length){

      $email_els.each(function(i, el){
        $el = $(el);
        email = $el.attr('email');
        if(email.indexOf(internal) === -1){
          if(extenalEmails.indexOf(email) === -1){
            extenalEmails.push(email);

            $el.find('.vM').off().on('click', function(e){
              console.log('contact-cross.click');
              app.checkRecipients(e, true);
            });
          }
        }
      });

      if(e){
        var removeEmail = $(e.target).parents('.vN.Y7BVp[email]').attr('email');
        extenalEmails.splice(extenalEmails.indexOf(removeEmail), 1);
      }

    } else {
      if(e && e.target){
        app.get(noticeboxId)
          .hide();
      }
    }
  });

  if(extenalEmails.length){
    this.get(noticeboxId)
      .updateAndShow({
        email: extenalEmails
      });
  } else {
    this.get(noticeboxId)
      .hide();
  }
}

App.prototype.appendNoticBox = function() {
  $(_g.replyArea).each( $.proxy(function(i, el){
    var $el = $(el);
    if(!$el.data('noticebox-id')){
      var $popupNewMessage, popupNewMessage, isPopup, $noticebox;
      $popupNewMessage = $(_g.popupNewMessage);
      popupNewMessage = $popupNewMessage.length && $popupNewMessage[0];
      isPopup = Util.isElementContrain(popupNewMessage, $el[0]);

      $noticebox = new NoticeBox($el, isPopup);
      this.noticeboxes[$noticebox.id] = $noticebox;
    }
  }, this));
}
App.prototype.updateStatus = function() {
  var app = this;

  this.appendNoticBox();

  $(_g.recipientInput)
    .off()
    .focus(function(e){
      console.log('recipientInput.focus');
      setTimeout(function(){
        app.updateStatus();
        app.checkRecipients(e);
      });
    })
    .keydown(function(e){
      console.log('recipientInput.keypress');
      setTimeout(function(){
        app.updateStatus();
        app.checkRecipients(e);
      })
    });


  if(new onPageChecker().isReply() && !new onPageChecker().isReplyBoxActive() ||
    new PopupChecker().isMaximized() ){
      this.checkRecipients();
  } else if(new PopupChecker().isReplyBoxActive() ||
    new onPageChecker().isReplyBoxActive() ){
      this.checkRecipients();
  }
}

App.prototype.setting = function(opts){
  this.internal = opts.internal && opts.internal.split(',');
}

$(document).ready(function(){
  window.noticeBeforeSend = new App();
});