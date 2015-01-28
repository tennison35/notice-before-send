var _g = {
  'recipientWrapActive': '.wO.nr.l1',
  'recipientWrap': '.wO.nr',
  'recipientInput': 'textarea.vO',
  'lightboxWrap': '.ah.aiv.aJS',
  'lightboxWrapClass': 'ah aiv aJS',
  'contactHighlighted': '.Jd-Je.Je',
  'contactHighlightedClass': 'Jd-Je Je',
  'contact': '.Jd-axF',
  'contactLowerText': '.Sr',
  'contactUpperText': '.am',
  'contactCloseButton': '.vM',
  'replyArea': '.aoI',
  // message page
  'replyActive': '.gA.gt',
  'noReply': '.amn',
  'replyBox': '.fX.aXjCH', // under .gA.gt // check display for activation
  'wrapContact': '.vR', // the contact block when user confirm emails
  'replyBoxPresented': '.oL.aDm.az9',
  // popup page
  'popupNewMessage': '.AD',
  'popupMessageRightTopMinimizeButton': '.Hl', // check data-tooltip = Minimize || Maximize (oposite to status)
  'popupNewMessageMaximized': '', // check display for activation
  'popupReplyBox': '.fX.aXjCH', // under .AD // check display for activation
  'presentReplyBox': '.aoD.hl' // oposite to .fX.aXjCH, check display for activation
};

var Util = {
  list: [],
  isElementContrain: function (parent, children) {
    return $.contains(parent, children);
  },
  genId: function (digit) {
    digit = digit || 10;
    var text = "", i, len, possible;
    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    do {
      for (i = 0, len = possible.length; i < digit; i ++ ){
        text += possible.charAt(Math.floor(Math.random() * len));
      }
    } while (this.list.indexOf(text) !== -1);

    this.list.push(text);

    return text;
  }
};

var NoticeBox = function (parent, isPopup) {
  this.classes = ['noticebox', 'alert', 'alert-danger'];

  this.create();
  this.setType(isPopup);
  this.appendTo(parent);
  this.hide();
};

NoticeBox.prototype.appendTo = function (parent) {
  this.parent = parent;
  parent.attr('data-noticeBox-id', this.id);
  parent.append(this.$el);
};

NoticeBox.prototype.create = function () {
  this.id = Util.genId(10);

  this.$el = $('<div/>', {
    id: this.id,
    class: this.classes.join(' ')
  });

  return this.$el;
};

NoticeBox.prototype.setType = function(isPopup){
  this.isPopup = isPopup;
  this.$el.addClass(isPopup? 'popupNotice' : 'onPageNotice');
  this.$el.attr('data-isPopup', isPopup);
};
NoticeBox.prototype.hide = function(){
  console.log('noticebox id: '+this.id+' is hidden.');
  this.$el.hide();
};
NoticeBox.prototype.updateAndShow = function(data){
  this.updateText(data);
  this.show();
};

NoticeBox.prototype.show = function(){
  console.log('noticebox id: '+this.id+' is shown.');
  this.$el.show();
};
NoticeBox.prototype.updateText = function(data){
  this.$el.text('External Recipients: ' + data.email.join(', '));
};

function onPageChecker () {
  this.type = "onpage";
  this.hash_arr = window.location.hash.split(/#([^?/]+)?\/?([^/?]+)?\??([^&]+)?/);
  this.$noReply = $(_g.noReply);
  this.$replyBox = $(_g.replyBox);

  this.setID(this.hash_arr[2] || null);
}

onPageChecker.prototype.setID = function(id) {
  this.id = id;
};
onPageChecker.prototype.status  = function() {
  return {
    id: this.id,
    isActive: this.isActive(),
    isReply: this.isReply(),
    isReplyBoxActive: this.isReplyBoxActive()
  };
};
onPageChecker.prototype.isActive = function() {
  return !!this.id || false;
};
onPageChecker.prototype.isReply = function() {
  var isNoReplyFound = !!this.$noReply.length;
  var isNoReplyDisplay = this.$noReply.css('display') !== "none";

  return (!!this.id && !isNoReplyFound && !!isNoReplyDisplay) || false;
};
onPageChecker.prototype.isReplyBoxActive = function() {
  var isReplyBoxFound = !!this.$replyBox.length;
  var isReplyBoxDisplay = (this.$replyBox.css('display') !== "none");

  return (this.isReply() && isReplyBoxFound && isReplyBoxDisplay) || false;
};

function PopupChecker () {
  this.hash_arr = window.location.hash.split(/#([^?/]+)?\/?([^/?]+)?\??([^&]+)?/);
  this.$topRightMiniBtn = $(_g.popupMessageRightTopMinimizeButton);
  this.$popupMessageReplyBox = $(_g.popupNewMessage).find(_g.replyBox);
  this.popupStatus_arr = this.hash_arr[3] && this.hash_arr[3].split('=') || [];

  this.setID(this.popupStatus_arr[1] || null);

  this.type = "popup";
}
PopupChecker.prototype.setID = function(id) {
  this.id = id;
};
PopupChecker.prototype.status  = function() {
  return {
    id: this.id,
    isActive: this.isActive(),
    isMaximized: this.isMaximized(),
    isReplyBoxActive: this.isReplyBoxActive()
  };
};
PopupChecker.prototype.isActive = function() {
  var isPopupMessage = (this.popupStatus_arr[0] === 'compose');
  return !!isPopupMessage || false;
};
PopupChecker.prototype.isMaximized = function() {
  var isTopRightMinimizeButton = (this.$topRightMiniBtn.data('tooltip') === "Minimize");

  return isTopRightMinimizeButton || false;
};
PopupChecker.prototype.isReplyBoxActive = function() {
  var isPopupMessageReplyBoxDisplay = (this.$popupMessageReplyBox.css('display') !== "none");
  return this.isMaximized() && this.$popupMessageReplyBox && isPopupMessageReplyBoxDisplay || false;
};

var App = function() {
  console.log('App.init');
  this.internal_arr = ['alphasights'];
  this.noticeboxes = [];

  window.onhashchange = $.proxy(this.updateStatus, this);

  setInterval($.proxy(function(){
    console.log('App.updateStatus');
    this.updateStatus();
  }, this), 3*1000);
};

App.prototype.getNoticeboxWithId = function(noticeboxId){
  return this.noticeboxes[noticeboxId];
};

App.prototype.isExternal = function(email) {
  return !$(this.internal_arr).filter(function(a, b){return email.indexOf(b) !== -1;}).length;
};

App.prototype.checkRecipients = function(e) {
  console.log('checkRecipients');

  var extenalEmails = [];
  var internal_arr = this.internal_arr;
  var app = this;
  var $recipientFields = $(_g.recipientWrap);
  var noticeboxId = $recipientFields.parents(_g.replyArea).data('noticebox-id');

  $recipientFields.each(function(i, field){
    var $field, $email_els, $el, email;
    $field = $(field);
    $email_els = $field.find('[email]');

    if($email_els.length){
      $email_els.each(function(i, el){
        $el = $(el);
        email = $el.attr('email');
        if(app.isExternal(email)){
          if(extenalEmails.indexOf(email) === -1){
            extenalEmails.push(email);

            $el.find(_g.contactCloseButton).off().on('click', function(e){
              console.log('contact-cross.click');
              app.checkRecipients(e);
            });
          }
        }
      });
    } else {
      if(e && e.target){
        app.getNoticeboxWithId(noticeboxId).hide();
      }
    }
  });

  this.updateNoticeBox(noticeboxId, extenalEmails);
};

App.prototype.updateNoticeBox = function(id, extenalEmails) {
  console.log('updateNoticeBox', extenalEmails);
  if(extenalEmails.length){
    this.getNoticeboxWithId(id)
      .updateAndShow({
        email: extenalEmails
      });
  } else {
    this.getNoticeboxWithId(id).hide();
  }
};

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
};

App.prototype.updateStatus = function() {
  var app = this;
  var pageChecker = new onPageChecker();
  var popupChecker = new PopupChecker();

  this.appendNoticBox();

  $(_g.recipientInput)
    .off()
    .focus(function(e){
      console.log('recipientInput.focus');
      setTimeout(function(){
        app.checkRecipients(e);
      });
    })
    .keydown(function(e){
      console.log('recipientInput.keydown');
      setTimeout(function(){
        app.checkRecipients(e);
      });
    });

  if(pageChecker.isReply() && !pageChecker.isReplyBoxActive() ||
    popupChecker.isMaximized() ){
      this.checkRecipients();
  } else if(popupChecker.isReplyBoxActive() ||
    pageChecker.isReplyBoxActive() ){
      this.checkRecipients();
  }
};

App.prototype.setting = function(opts){
  this.internal_arr = opts.internal_arr && opts.internal_arr.split(',');
};

$(document).ready(function(){
  window.noticeBeforeSend = new App();
});