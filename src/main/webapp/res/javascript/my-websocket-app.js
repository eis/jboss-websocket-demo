var ws = undefined;

$(function() {
    if (window.WebSocket) {
        ws = new WebSocket(socketPath);
        $(window).unload(function () {
                ws.close();
                ws = null
            }
        );      
    
        // listen for messages from server using standard syntax
        ws.onmessage = function (event) {
           var messageFromServer = jQuery.parseJSON(event.data);
           addMessage(messageFromServer.timeMillis, messageFromServer.content);
        };
        ws.onerror = function (event) {
                $('#error_msg').html('Error: WebSocket not supported by the server');
        };
    } else {
        $('#error_msg').html('Error: WebSocket not supported by the browser');
    }
    var tabs = $( "#tabs" ).tabs();

    $('#input input').keydown(inputKeyDownHandler);
    $('#input input').focus();
});


function inputKeyDownHandler(event) {
    if (event.which != 13) {
        return true;
    }
    event.preventDefault();
    var textToSend = $('#input input').val();
    ws.send(textToSend);
    setTimeout(clearInput, 150);
}

function clearInput() {
    $('#input input').val("");
}

function addMessage(timeMillis, content) {
    var time = getTimeFromMillis(timeMillis);
    $("#messages").append(time + ' ' + content + '<br />');
};

function getTimeFromMillis(timeMillis) {
    
    var time            = timeMillis / 1000;
    var dateTime        = new Date(time);
    var hours           = dateTime.getHours();
    var minutes         = dateTime.getMinutes();
    var seconds         = dateTime.getSeconds();
    
    return hours + ':' + minutes + ':' + seconds;
}