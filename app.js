// Select UI elements
const connectBtn = document.getElementById('connectBtn');
const disconnectBtn = document.getElementById('disconnectBtn');
const sendBtn = document.getElementById('sendBtn');
const status = document.getElementById('status');
const terminalOutput = document.getElementById('terminalOutput');
const terminalInput = document.getElementById('terminalInput');

let device;
let characteristic;

// UUIDs (replace with the ones in your ESP32 code if they differ)
const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

// Connect function
// Connect function
// Connect function
async function connect() {
    try {
        // No filters, showing all devices
        device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: [SERVICE_UUID]
        });

        const server = await device.gatt.connect();
        const service = await server.getPrimaryService(SERVICE_UUID);
        characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

        status.textContent = 'Connected';
        connectBtn.disabled = true;
        disconnectBtn.disabled = false;
        sendBtn.disabled = false;

        device.ongattserverdisconnected = onDisconnected;

        logToTerminal('Connected to device');
    } catch (error) {
        logToTerminal(`Error: ${error}`);
    }
}



// Disconnect function
function disconnect() {
    if (device && device.gatt.connected) {
        device.gatt.disconnect();
    }
}

// Handle disconnect
function onDisconnected() {
    status.textContent = 'Disconnected';
    connectBtn.disabled = false;
    disconnectBtn.disabled = true;
    sendBtn.disabled = true;
    logToTerminal('Device disconnected');
}

// Send command to the device
async function sendCommand() {
    const command = terminalInput.value.trim();
    if (command === '1' || command === '0') {  // Only send '1' or '0' for LED control
        try {
            const encoder = new TextEncoder();
            await characteristic.writeValue(encoder.encode(command));
            logToTerminal(`Sent command: ${command}`);
        } catch (error) {
            logToTerminal(`Error: ${error}`);
        }
    } else {
        logToTerminal("Please enter '1' to turn on the LED or '0' to turn it off.");
    }
}

// Helper function to log messages to the terminal
function logToTerminal(message) {
    terminalOutput.textContent += message + '\n';
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Event listeners
connectBtn.addEventListener('click', connect);
disconnectBtn.addEventListener('click', disconnect);
sendBtn.addEventListener('click', sendCommand);
