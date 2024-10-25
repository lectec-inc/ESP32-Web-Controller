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

    function createPacket(commandId) {
        const payload = new Uint8Array([commandId]);
        const length = payload.length;
        const crc = calculateCRC16(payload);
        const crcHigh = (crc >> 8) & 0xFF;
        const crcLow = crc & 0xFF;
        logToTerminal(`Creating packet for command: ${commandId}, CRC: ${crc.toString(16).padStart(4, '0')}`);
        return new Uint8Array([0x02, length, ...payload, crcHigh, crcLow, 0x03]);
    }

    async function sendPacket(packet) {
        if (writeCharacteristic) {
            logToTerminal(`Sending packet: ${Array.from(packet).map(b => b.toString(16).padStart(2, '0')).join(' ')}`);
            let chunkSize = 20;
            for (let i = 0; i < packet.length; i += chunkSize) {
                const chunk = packet.slice(i, i + chunkSize);
                await writeCharacteristic.writeValue(chunk);
                logToTerminal(`Chunk sent: ${Array.from(chunk).map(b => b.toString(16).padStart(2, '0')).join(' ')}`);
            }
        } else {
            logToTerminal('No write characteristic available.', true);
        }
    }

    function waitForResponse(timeout) {
        return new Promise(resolve => {
            const timer = setTimeout(() => {
                logToTerminal('No response received within timeout.', true);
                resolve();
            }, timeout);

            notifyCharacteristic.addEventListener('characteristicvaluechanged', function responseHandler(event) {
                clearTimeout(timer);
                notifyCharacteristic.removeEventListener('characteristicvaluechanged', responseHandler);
                const data = new Uint8Array(event.target.value.buffer);
                logToTerminal(`Received data: ${Array.from(data).map(b => b.toString(16).padStart(2, '0')).join(' ')}`);
                resolve(data);
            });
        });
    }

    async function sendInitializationSequence() {
        for (let attempt = 1; attempt <= 3; attempt++) {
            logToTerminal(`Attempt ${attempt} - Sending COMM_FW_VERSION command...`);
            const fwVersionPacket = createPacket(0x00);
            await sendPacket(fwVersionPacket);
            const response = await waitForResponse(3000);
            if (response) return;  // Exit if we receive a response
        }
        logToTerminal("No response to COMM_FW_VERSION. Attempting COMM_GET_VALUES...");

        const getValuesPacket = createPacket(0x04);  // Command ID for COMM_GET_VALUES
        await sendPacket(getValuesPacket);
        await waitForResponse(5000);
    }

    connectBtn.addEventListener('click', function() {
        logToTerminal('Attempting to connect...');
        navigator.bluetooth.requestDevice({
            filters: [{ services: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e'] }]
        })
        .then(device => {
            selectedDevice = device;
            logToTerminal(`Device selected: ${device.name}`);
            return device.gatt.connect();
        })
        .then(server => {
            logToTerminal('Connected to GATT server. Fetching primary service...');
            return server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e');
        })
        .then(service => {
            logToTerminal('Primary service fetched successfully. Fetching characteristics...');
            return Promise.all([
                service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e'),
                service.getCharacteristic('6e400003-b5a3-f393-e0a9-e50e24dcca9e')
            ]);
        })
        .then(characteristics => {
            writeCharacteristic = characteristics[0];
            notifyCharacteristic = characteristics[1];
            logToTerminal('Characteristics fetched successfully.');
            logToTerminal(`Write Characteristic UUID: ${writeCharacteristic.uuid}`);
            logToTerminal(`Notify Characteristic UUID: ${notifyCharacteristic.uuid}`);
            logToTerminal('Starting notifications on notify characteristic...');
            return notifyCharacteristic.startNotifications();
        })
        .then(() => {
            notifyCharacteristic.addEventListener('characteristicvaluechanged', event => {
                const data = new Uint8Array(event.target.value.buffer);
                logToTerminal(`Notification received: ${Array.from(data).map(b => b.toString(16).padStart(2, '0')).join(' ')}`);
            });
            status.textContent = 'Connected and ready to send commands';
            disconnectBtn.disabled = false;
            connectBtn.disabled = true;
            logToTerminal('Connected successfully and notifications started.');
            sendInitializationSequence();  // Run the initialization sequence with retries
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

    sendBtn.addEventListener('click', sendInitializationSequence);
});
