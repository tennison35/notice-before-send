function save_options() {
  chrome.storage.sync.set({
    disableSuggestion: $('#disableSuggestion').prop('checked'),
    includeDomain: $('#includeDomain').val()
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  chrome.storage.sync.get({
    disableSuggestion: false,
    includeDomain: 'gmail.com'
  }, function(items) {
    debugger;
    $('#disableSuggestion').prop('checked', items.disableSuggestion);
    $('#includeDomain').val(items.includeDomain);
  });
}

restore_options();

$('#save').on('click', save_options);
