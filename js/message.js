function submitMessage() {
    let userfrom = document.getElementById('userfrom').value;
    let userto = document.getElementById('userto').value;
    let usermsg = document.getElementById('usermsg').value;
    let timestamp = new Date().toTimeString();
    console.log('try get last');
    let msgerChat = $("#msger-chat")[0];
    console.log(msgerChat);
    let lastChildTime = msgerChat.lastElementChild?.getElementsByClassName("msg-info-time")[0]?.textContent;
    console.log(lastChildTime);
    
    

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
            console.error('Error Post: ', textStatus, ', Details: ', errorThrown);
            console.error('Response: ', jqXHR);
            alert('An error occured when requesting your unicorn:\n' + JSON.stringify(jqXHR));
            return false;
        }
    });
    return false;
}

function completeRequest(result) {
    console.log('completeRequest');
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