var _g = {
  'excluderClass': 'nbs-excluder',
  'recipientWrapActive': '.wO.nr.l1',
  'recipientWrap': '.wO.nr',
  'recipientInput': 'textarea.vO',
  'recipientInputClass': 'vO',
  'listboxWrap': '.ah.aiv.aJS',
  'listboxWrapClass': 'ah aiv aJS',
  'contactHighlighted': '.Jd-Je.Je',
  'contactHighlightedClass': 'Jd-Je Je',
  'contact': '.Jd-axF',
  'contactClass': 'Jd-axF',
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
  },
  isDisplay: function(el) {
    return el && $(el).css('display') !== "none";
  }
};

$.fn.once = function (id) {
  if(typeof id !== 'string') return false;
  var name = "jquery-once-" + id;

  return this.filter(function() {
    return $(this).data(name) !== true;
  }).data(name, true);
};

$.fn.removeOnce = function (id) {
  if(typeof id !== 'string') return false;
  return this.findOnce(id).removeData("jquery-once-" + id);
};

$.fn.findOnce = function (id) {
  if(typeof id !== 'string') return false;
  var name = "jquery-once-" + id;

  return this.filter(function() {
    return $(this).data(name) === true;
  });
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
  if(Util.isDisplay(this.$el)){
    console.log('noticebox id: '+this.id+' is hidden.');
    this.$el.hide();
  }
};
NoticeBox.prototype.updateAndShow = function(data){
  this.updateText(data);
  this.show();
};

NoticeBox.prototype.show = function(){
  if(!Util.isDisplay(this.$el)){
    console.log('noticebox id: '+this.id+' is shown.');
    this.$el.show();
  }
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
  var app = this;

  console.log('App.init');
  this.internal_arr = ['alphasights'];
  this.noticeboxes = [];

  window.onhashchange = $.proxy(this.updateStatus, this);

  this.observeDOM( document.getElementsByTagName('body')[0] ,function(mutation){
    app.onDOMAddContacts(mutation);
    app.onDOMAddListbox(mutation);
    app.onDOMRecipientInput(mutation);
  });

  setInterval($.proxy(function(){
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
  var app = this;

  $(_g.replyArea).each(function(i, area){
    var extenalEmails, $area, noticeboxId, $recipientFields;

    extenalEmails = [];
    $area = $(area);
    noticeboxId = $area.data('noticebox-id');
    $recipientFields = $area.find(_g.recipientWrap);

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

    app.updateNoticeBox(noticeboxId, extenalEmails);
  });
};

App.prototype.updateNoticeBox = function(id, extenalEmails) {
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

App.prototype.suppressEventOnListbox = function(e) {
  var app = this,
      $contactsHighlighted = $(_g.contactHighlighted);

  $contactsHighlighted.each(function(i, contactHighlighted){
    var $contactHighlighted = $(contactHighlighted),
        $listboxWrap = $contactHighlighted.parents(_g.listboxWrap),
        isDisplay = Util.isDisplay($listboxWrap),
        hasExcluderClass = $contactHighlighted.hasClass(_g.excluderClass);

    if(isDisplay && $contactHighlighted && hasExcluderClass){
      // e.stopImmediatePropagation() does not work, but event.stopImmediatePropagation() works ?!
      event.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
    }
  });
};

App.prototype.onDOMAddContacts = function(mutation) {
  var app = this,
      $target = $(mutation.addedNodes),
      hasClass = $target.hasClass(_g.contactClass);

  if(hasClass){
    var email = $target.find(_g.contactLowerText).text();

    $target
      .once('addEventListener')
      .on({
        click: function(e){
          console.log('User clicked contact in listbox.\nSuppressing the click event.');
          app.suppressEventOnListbox(e);
        },
        dblclick: function(e){
          var $target = $(e.target);
          $target.parents(_g.contact).removeClass(_g.excluderClass);
        }
      });

    if(app.isExternal(email)){
      $target.addClass(_g.excluderClass);
    }
  }
};

App.prototype.onDOMAddListbox = function (mutation) {
  var app = this,
      $target = $(mutation.addedNodes),
      hasClass = $target.hasClass(_g.listboxWrapClass);

  if(hasClass){
    // if user set to disable "Conside Including" features, hide the Listbox
  }
};

App.prototype.onDOMRecipientInput = function (mutation) {
  var app = this,
      $target = $(mutation.addedNodes),
      hasClass = $target.hasClass(_g.recipientInputClass),
      isTextArea = $target.is('textarea');

  if(hasClass && isTextArea){
    console.log('recipientInput:', $target);
    $target
    .once('addEventListener')
    .on({
      keydown: function(e) {
        if(e.keyCode === 13 || e.keyCode === 9){
          app.suppressEventOnListbox(e);
        }

        setTimeout(function(){
          app.checkRecipients(e);
        });
      },
      focus: function(e){
        console.log('recipientInput.focus');
        setTimeout(function(){
          app.checkRecipients(e);
        });
      }
    });
  }
};

App.prototype.updateStatus = function() {
  var app = this,
      pageChecker = new onPageChecker(),
      popupChecker = new PopupChecker();

  this.appendNoticBox();

  if(pageChecker.isReply() && !pageChecker.isReplyBoxActive() || popupChecker.isMaximized() ){
    this.checkRecipients();
  } else if(popupChecker.isReplyBoxActive() || pageChecker.isReplyBoxActive() ){
    this.checkRecipients();
  }
};

App.prototype.observeDOM = (function(){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

    return function(el, callback){
        if( MutationObserver ){
            // define a new observer
            var obs = new MutationObserver(function(mutations, observer){
              mutations.forEach(function(mutation) {
                if( mutation.addedNodes.length)
                  callback(mutation);
              });
            });
            // have the observer observe foo for changes in children
            obs.observe( el, { childList:true, subtree:true });
        }
        else if( eventListenerSupported ){
            el.addEventListener('DOMNodeInserted', callback, false);
            el.addEventListener('DOMNodeRemoved', callback, false);
        }
        else {
          console.error('Both MutationObserver and eventListenerSupported are not supported.');
        }
    };
})();

App.prototype.setting = function(opts){
  this.internal_arr = opts.internal_arr && opts.internal_arr.split(',');
};

$(document).ready(function(){
  window.noticeBeforeSend = new App();
});