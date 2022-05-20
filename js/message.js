function submitMessage() {
    let userfrom = document.getElementById('userfrom').value;
    let userto = document.getElementById('userto').value;
    let usermsg = document.getElementById('usermsg').value;
    let timestamp = new Date().toTimeString();

    if (!usermsg) return;

    postMessage(userfrom, userto, usermsg, timestamp);

    appendMessage(userfrom, "right", usermsg, timestamp);
    document.getElementById('usermsg').value = "";
}

/*global WildRydes _config*/
function postMessage(userfrom, userto, usermsg, timestamp) {
    console.log('postMessage');
    console.log('userfrom: ' + userfrom);
    console.log('userto: ' + userto);
    console.log('usermsg: ' + usermsg);
    console.log('timestamp: ' + timestamp);
    $.ajax({
        method: 'POST',
        url: _config.api.invokeUrl,
        data: JSON.stringify({
            message: {
                user_from: userfrom,
                user_to: userto,
                user_msg: usermsg,
                timestamp: timestamp
            }
        }),
        contentType: 'application/json',
        success: completeRequest,
        error: function ajaxError(jqXHR, textStatus, errorThrown) {
            console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
            console.error('Response: ', jqXHR.responseText);
            alert('An error occured when requesting your unicorn:\n' + jqXHR.responseText);
            return false;
        }
    });
    return false;
}

function completeRequest(result) {
    console.log('completeRequest');
    var unicorn;
    var pronoun;
    console.log('Response received from API: ', result);
    unicorn = result.Unicorn;
    pronoun = unicorn.Gender === 'Male' ? 'his' : 'her';
    displayUpdate(unicorn.Name + ', your ' + unicorn.Color + ' unicorn, is on ' + pronoun + ' way.');
}

function displayUpdate(text) {
    console.log('displayUpdate');
    $('#updates').append($('<li>' + text + '</li>'));
}

function appendMessage(name, side, text, time) {
    //   Simple solution for small apps
    const msgHTML = `
      <div class="msg ${side}-msg">  
        <div class="msg-bubble">
          <div class="msg-info">
            <div class="msg-info-name">${name}</div>
            <div class="msg-info-time">${time}</div>
          </div>
  
          <div class="msg-text">${text}</div>
        </div>
      </div>
    `;
    let msgerChat = $("#msger-chat");
    msgerChat[0].insertAdjacentHTML("beforeend", msgHTML);
    msgerChat[0].scrollTop += 500;
}