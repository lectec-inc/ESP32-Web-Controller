document.addEventListener("DOMContentLoaded", function() {
    var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        mode: "text/x-common-lisp",
        lineNumbers: true,
        theme: "default"
    });

    var connectBtn = document.getElementById('connectBtn');
    var disconnectBtn = document.getElementById('disconnectBtn');
    var status = document.getElementById('status');
    var terminalOutput = document.getElementById('terminalOutput');
    var terminalInput = document.getElementById('terminalInput');
    var sendBtn = document.getElementById('sendBtn');
    var selectedDevice = null;
    var writeCharacteristic = null;
    var notifyCharacteristic = null;

    function logToTerminal(message, isError = false) {
        const msgElement = document.createElement('div');
        msgElement.textContent = message;
        msgElement.style.color = isError ? 'red' : 'lime';
        terminalOutput.appendChild(msgElement);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function calculateCRC16(buffer) {
        let crc = 0xFFFF;
        for (let i = 0; i < buffer.length; i++) {
            crc ^= buffer[i] << 8;
            for (let j = 0; j < 8; j++) {
                if (crc & 0x8000) {
                    crc = (crc << 1) ^ 0x1021;
                } else {
                    crc = crc << 1;
                }
            }
        }
        return crc & 0xFFFF;
    }

    function sendGetValuesCommand() {
        logToTerminal('Preparing COMM_GET_VALUES command...');
        const payload = new Uint8Array([0x04]);  // COMM_GET_VALUES
        const crc = calculateCRC16(payload);
        const crcHigh = (crc >> 8) & 0xFF;
        const crcLow = crc & 0xFF;

        const packet = new Uint8Array([0x02, payload.length, ...payload, crcHigh, crcLow, 0x03]);
        logToTerminal(`Packet constructed: ${Array.from(packet).map(b => b.toString(16).padStart(2, '0')).join(' ')}`);

        if (writeCharacteristic) {
            writeCharacteristic.writeValue(packet)
                .then(() => {
                    logToTerminal('> Sent COMM_GET_VALUES command successfully');
                })
                .catch(error => {
                    logToTerminal(`Error sending command: ${error}`, true);
                    console.error('Error sending command:', error);
                });
        } else {
            logToTerminal('No characteristic selected for writing.', true);
        }
    }

    function parseVescResponse(data) {
        logToTerminal('Parsing VESC response...');
        const dataArray = new Uint8Array(data.buffer);
        const startByte = dataArray[0];
        const stopByte = dataArray[dataArray.length - 1];

        logToTerminal(`Start byte: ${startByte.toString(16)}, Stop byte: ${stopByte.toString(16)}`);

        // Verify start and stop bytes
        if ((startByte !== 0x02 && startByte !== 0x03 && startByte !== 0x04) || stopByte !== 0x03) {
            logToTerminal('Invalid packet structure received.', true);
            return;
        }

        // Extract payload length and payload
        const length = dataArray[1];
        logToTerminal(`Payload length: ${length}`);
        const payload = dataArray.slice(2, 2 + length);
        
        // Extract CRC from response and calculate expected CRC
        const receivedCrc = (dataArray[2 + length] << 8) | dataArray[2 + length + 1];
        const calculatedCrc = calculateCRC16(payload);
        logToTerminal(`Received CRC: ${receivedCrc.toString(16)}, Calculated CRC: ${calculatedCrc.toString(16)}`);
        if (receivedCrc !== calculatedCrc) {
            logToTerminal('CRC check failed.', true);
            return;
        }

        // Parse payload data based on expected response structure of COMM_GET_VALUES
        if (payload[0] === 0x04) {  // 0x04 = COMM_GET_VALUES response
            const voltage = ((payload[1] << 8) | payload[2]) / 10.0;  // Assuming 16-bit voltage, scale of 0.1V
            const current = ((payload[3] << 8) | payload[4]) / 100.0;  // Assuming 16-bit current, scale of 0.01A
            const rpm = ((payload[5] << 8) | payload[6]);  // RPM, assuming 16-bit integer
            logToTerminal(`Voltage: ${voltage}V, Current: ${current}A, RPM: ${rpm}`);
        } else {
            logToTerminal('Unknown command ID in response.', true);
        }
    }

    connectBtn.addEventListener('click', function() {
        logToTerminal('Attempting to connect...');
        navigator.bluetooth.requestDevice({
            filters: [{ services: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e'] }]  // Reverted to Nordic UART UUID
        })
        .then(device => {
            selectedDevice = device;
            logToTerminal(`Device selected: ${device.name}`);
            return device.gatt.connect();
        })
        .then(server => {
            logToTerminal('Connected to GATT server. Fetching primary service...');
            return server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e');  // Reverted to Nordic UART UUID
        })
        .then(service => {
            logToTerminal('Primary service fetched. Fetching characteristics...');
            return Promise.all([
                service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e'),  // Writing characteristic UUID
                service.getCharacteristic('6e400003-b5a3-f393-e0a9-e50e24dcca9e')   // Notification characteristic UUID
            ]);
        })
        .then(characteristics => {
            writeCharacteristic = characteristics[0];
            notifyCharacteristic = characteristics[1];
            logToTerminal('Characteristics fetched. Starting notifications...');
            return notifyCharacteristic.startNotifications();
        })
        .then(() => {
            notifyCharacteristic.addEventListener('characteristicvaluechanged', event => {
                logToTerminal('Notification received. Processing...');
                parseVescResponse(event.target.value);
            });
            status.textContent = 'Connected and ready to send commands';
            disconnectBtn.disabled = false;
            connectBtn.disabled = true;
            logToTerminal('Connected successfully and notifications started.');
        })
        .catch(error => {
            console.error('Connection failed:', error);
            status.textContent = 'Failed to connect: ' + error;
            logToTerminal(`Connection failed: ${error}`, true);
        });
    });

    disconnectBtn.addEventListener('click', function() {
        if (selectedDevice && selectedDevice.gatt.connected) {
            selectedDevice.gatt.disconnect();
            status.textContent = 'Disconnected from ' + selectedDevice.name;
            connectBtn.disabled = false;
            disconnectBtn.disabled = true;
            selectedDevice = null;
            writeCharacteristic = null;
            notifyCharacteristic = null;
            logToTerminal('Disconnected from device');
        }
    });

    sendBtn.addEventListener('click', () => {
        logToTerminal('Sending COMM_GET_VALUES command...');
        sendGetValuesCommand();
    });
});
