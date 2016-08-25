window.onload = function () {
    var detectedTransport = null;
    var socket = atmosphere;
    var subSocket;
    function getKeyCode(ev) {
        if (window.event) return window.event.keyCode;
        return ev.keyCode;
    }
    function getElementById(id) {
        return document.getElementById(id);
    }
    function getTransport(t) {
        transport = t.options[t.selectedIndex].value;
        if (transport == 'autodetect') {
            transport = 'websocket';
        }
        return false;
    }
    function getElementByIdValue(id) {
        detectedTransport = null;
        return document.getElementById(id).value;
    }
    function subscribe() {
        var request = {
            // document.location.toString() + 'pubsub/' + getElementByIdValue('topic'),
            url: "http://localhost:8080/pubsub/" + getElementByIdValue('topic'),
            trackMessageLength: true,
            transport: getElementByIdValue('transport'),
            attachHeadersAsQueryString: false
        };
        var ul = document.createElement('ul');
        document.body.appendChild(ul)
        request.onMessage = function (response) {
            detectedTransport = response.transport;
            if (response.status == 200) {
                var data = response.responseBody;
                if (data.length > 0) {
                    var li = document.createElement('li');
                    ul.insertBefore(li, ul.firstChild);
                    li.innerHTML = li.innerHTML + data;
                }
            }
        };
        subSocket = socket.subscribe(request);
    }
    function unsubscribe() {
        callbackAdded = false;
        socket.unsubscribe();
    }
    function connect() {
        unsubscribe();
        getElementById('phrase').value = '';
        getElementById('sendMessage').className = '';
        getElementById('phrase').focus();
        subscribe();
        getElementById('connect').value = "Switch transport";
    }
    getElementById('connect').onclick = function (event) {
        if (getElementById('topic').value == '') {
            alert("Please enter a PubSub topic to subscribe");
            return;
        }
        connect();
    }
    getElementById('topic').onkeyup = function (event) {
        getElementById('sendMessage').className = 'hidden';
        var keyc = getKeyCode(event);
        if (keyc == 13 || keyc == 10) {
            connect();
            return false;
        }
    }
    getElementById('phrase').setAttribute('autocomplete', 'OFF');
    getElementById('phrase').onkeyup = function (event) {
        var keyc = getKeyCode(event);
        if (keyc == 13 || keyc == 10) {
            var m = " sent using " + detectedTransport;
            if (detectedTransport == null) {
                detectedTransport = getElementByIdValue('transport');
                m = " sent trying to use " + detectedTransport;
            }
            subSocket.push({ data: 'message=' + getElementByIdValue('phrase') + m });
            getElementById('phrase').value = '';
            return false;
        }
        return true;
    };
    getElementById('send_message').onclick = function (event) {
        if (getElementById('topic').value == '') {
            alert("Please enter a message to publish");
            return;
        }
        var m = " sent using " + detectedTransport;
        if (detectedTransport == null) {
            detectedTransport = getElementByIdValue('transport');
            m = " sent trying to use " + detectedTransport;
        }
        subSocket.push({ data: 'message=' + getElementByIdValue('phrase') + m });
        getElementById('phrase').value = '';
        return false;
    };
    getElementById('topic').focus();
};