window.addEventListener('load', function () {
    $("#submitmsg").on('submit', function(event){
        event.preventDefault();
        postMessage();
     });
});

/*global WildRydes _config*/
function postMessage() {
    console.log('postMessage');
    let userfrom = document.getElementById('userfrom').value;
    let userto = document.getElementById('userto').value;
    let usermsg = document.getElementById('usermsg').value;
    let timestamp = new Date().toTimeString();
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