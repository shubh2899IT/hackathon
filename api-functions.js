function displayInbox() {
  var request = gapi.client.gmail.users.messages.list({
    'userId': 'me',
    'labelIds': 'INBOX',
    'maxResults': 10
  });

  request.execute(function (response) {
    $.each(response.messages, function () {
      var messageRequest = gapi.client.gmail.users.messages.get({
        'userId': 'me',
        'id': this.id
      });

      messageRequest.execute(appendMessageRow);
    });
  });
}

function getMessage(id) {
  var messageRequest = gapi.client.gmail.users.messages.get({
    'userId': 'me',
    'id': id
  });

  messageRequest.execute(showMessage);

}

function showMessage(message) {
  console.log(message);
}


function displayOutbox() {
  var request = gapi.client.gmail.users.messages.list({
    'userId': 'me',
    'labelIds': 'SENT',
    'maxResults': 10
  });
  request.execute(function (response) {
    $.each(response.messages, function () {
      var messageRequest = gapi.client.gmail.users.messages.get({
        'userId': 'me',
        'id': this.id
      });

      messageRequest.execute(appendOutboxMessageRow);
    });
  });
}


function displayDraft() {
  var request = gapi.client.gmail.users.drafts.list({
    'userId': 'me',
    'maxResults': 10
  });

  request.execute(function (response) {
    $.each(response.drafts, function () {
      var messageRequest = gapi.client.gmail.users.messages.get({
        'userId': 'me',
        'id': this.message.id
      });
      messageRequest.execute(appendDraftMessageRow);
    });
  });
};



function getHeader(headers, index) {
  var header = '';

  $.each(headers, function () {
    if (this.name === index) {
      header = this.value;
    }
  });
  return header;
}

function sendEmail() {
  sendMessage(
    {
      'To': document.getElementById('mailto').value,
      'Subject': document.getElementById("mailsubject").value
    },
    document.getElementById("mailbody").value,
    alertReset()
  )
}

function alertReset(){
  document.getElementById("composeform").reset();
  document.getElementById("output_message").style.display="block";
}

function sendMessage(headers_object, message, callback) {
  var email = '';

  for (var header in headers_object)
    email += header += ": " + headers_object[header] + "\r\n";

  email += "\r\n" + message;

  var sendRequest = gapi.client.gmail.users.messages.send({
    'userId': 'me',
    'resource': {
      'raw': window.btoa(email).replace(/\+/g, '-').replace(/\//g, '_')
    }
  });

  return sendRequest.execute(callback);
}

function appendOutboxMessageRow(message) {
  console.log(message.payload);
  $('#outbox_table').append(
    '<tr>\
            <td>'+ getHeader(message.payload.headers, 'From') + '</td>\
            <td>\
              <a href="#message-modal-' + message.id +
    '" data-toggle="modal" id="message-link-' + message.id + '">' +
    getHeader(message.payload.headers, 'Subject') +
    '</a>\
            </td>\
            <td>'+ getHeader(message.payload.headers, 'Date') + '</td>\
          </tr>'
  );
}

function appendDraftMessageRow(message) {
  console.log(message.payload);
  $('#draft_table').append(
    '<tr>\
            <td>'+ getHeader(message.payload.headers, 'From') + '</td>\
            <td>\
              <a href="#message-modal-' + message.id +
    '" data-toggle="modal" id="message-link-' + message.id + '">' +
    getHeader(message.payload.headers, 'Subject') +
    '</a>\
            </td>\
            <td>'+ getHeader(message.payload.headers, 'Date') + '</td>\
          </tr>'
  );
}

function appendMessageRow(message) {
  console.log(message.payload.headers);
  $('#inbox_table').append(
    '<tr>\
        <td>'+ getHeader(message.payload.headers, 'From') + '</td>\
        <td>\
          <a href="#message-modal-' + message.id +
    '" data-toggle="modal" id="message-link-' + message.id + '">' +
    getHeader(message.payload.headers, 'Subject') +
    '</a>\
        </td>\
        <td>'+ getHeader(message.payload.headers, 'Date') + '</td>\
      </tr>'
  );
}