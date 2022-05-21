function submitMessage() {
    let userfrom = document.getElementById('userfrom').value;
    let userto = document.getElementById('userto').value;
    let usermsg = document.getElementById('usermsg').value;
    let timestamp = new Date().getTime();
    console.log('try get last');
    let msgerChat = $("#msger-chat")[0];
    console.log(msgerChat);
    let lastChildTime = msgerChat.lastElementChild?.getElementsByClassName("msg-info-time")[0]?.textContent;
    console.log(lastChildTime);
    if (!lastChildTime)
        lastChildTime = 0;

    queryMessage(userfrom, lastChildTime);


    if (!usermsg) return;

    postMessage(userfrom, userto, usermsg, timestamp);

    //appendMessage(userfrom, "right", usermsg, timestamp);
    document.getElementById('usermsg').value = "";
}

function queryMessage(userfrom, lastChildTime) {
    console.log('queryMessage');
    console.log('userfrom: ' + userfrom);
    console.log('timestamp: ' + lastChildTime);
    $.ajax({
        method: 'GET',
        url: _config.api.invokeUrl + `?user_id=${userfrom}&timestamp=${lastChildTime}`,
        success: completeQueryRequest,
        error: function ajaxError(jqXHR, textStatus, errorThrown) {
            console.error('Error Post: ', textStatus, ', Details: ', errorThrown);
            console.error('Response: ', jqXHR);
            alert('An error occured when requesting your unicorn:\n' + JSON.stringify(jqXHR));
            return false;
        }
    });
    return false;
}

function completeQueryRequest(result) {
    console.log('completeQueryRequest');
    console.log(JSON.stringify(result));
    let arr = result.data[0].Items.concat(result.data[1].Items);
    console.log('completeQueryRequest concat');
    console.log(arr);
    console.log('sort');
    arr = arr.sort(function (a, b) {
        var x = a['timestamp']; var y = b['timestamp'];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
    console.log(arr);

    let i = 0;
    let j = 0;
    while (true) {
        let send = result.data[0].Items[i];
        let receive = result.data[1].Items[j];
        console.log(`${i} ${send} ${j} ${receive}`);
        if (!send && !receive)
            break;
        if (!receive) {
            i++;
            appendMessageTo(send);
        } else if (!send) {
            j++;
            appendMessageFrom(receive);
        } else {
            let iTime = send.timestamp;
            let jTime = receive.timestamp;
            if (iTime > jTime) {
                j++;
                appendMessageFrom(receive);
            } else {
                i++;
                appendMessageTo(send);
            }
        }
    }
}

function appendMessageTo(send) {
    let userto = send.user_to;
    let usermsg = send.user_message;
    let timestamp = send.timestamp;
    appendMessage(userto, "right", usermsg, timestamp);
}

function appendMessageFrom(receive) {
    let userfrom = receive.user_id;
    let usermsg = receive.user_message;
    let timestamp = receive.timestamp;
    appendMessage(userfrom, "left", usermsg, timestamp);
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
    console.log(`appendMessage ${name} ${side} ${text} ${time}`);

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