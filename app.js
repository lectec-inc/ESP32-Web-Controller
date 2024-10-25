document.addEventListener("DOMContentLoaded", function() {
    var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        mode: "text/x-common-lisp",
        lineNumbers: true,
        theme: "default"
    });

    var connectBtn = document.getElementById('connectBtn');
    var disconnectBtn = document.getElementById('disconnectBtn');
    var status = document.getElementById('status');
    var consoleOutput = document.getElementById('console');
    var selectedDevice = null;

    function logToConsole(message, isError) {
        const msgElement = document.createElement('div');
        msgElement.textContent = message;
        msgElement.style.color = isError ? 'red' : 'lime';
        consoleOutput.appendChild(msgElement);
        consoleOutput.scrollTop = consoleOutput.scrollHeight; // Auto-scroll to the latest entry
    }

    connectBtn.addEventListener('click', function() {
        navigator.bluetooth.requestDevice({
            filters: [{ namePrefix: 'Express' }]
        })
        .then(device => {
            logToConsole('Device selected: ' + device.name);
            selectedDevice = device;
            return device.gatt.connect();
        })
        .then(server => {
            status.textContent = 'Success: Connected to ' + selectedDevice.name;
            disconnectBtn.disabled = false;
            connectBtn.disabled = true;
            logToConsole('Connected successfully to ' + selectedDevice.name);
        })
        .catch(error => {
            console.error('Connection failed:', error);
            status.textContent = 'Failed to connect: ' + error;
            logToConsole('Connection failed: ' + error, true);
        });
    });

    disconnectBtn.addEventListener('click', function() {
        if (selectedDevice && selectedDevice.gatt.connected) {
            selectedDevice.gatt.disconnect();
            logToConsole('Disconnected from: ' + selectedDevice.name);
            status.textContent = 'Disconnected from ' + selectedDevice.name;
            connectBtn.disabled = false;
            disconnectBtn.disabled = true;
            selectedDevice = null;
        }
    });
});
