const connectBtn = document.getElementById("connectBtn");
const statusDisplay = document.getElementById("status");
let device, server, txCharacteristic, rxCharacteristic;
let firmwareTimeout;

// Connection State Management
let connectionState = 'disconnected';
let messageBuffer = []; // Buffer for assembling full messages

// UUIDs for VESC Service and Characteristics
const VESC_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const RX_CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const TX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

// Function to initiate connection with verbose output
async function connectToDevice() {
    if (connectionState !== 'disconnected') return; // Prevent duplicate connections
    console.log("Scanning for VESC device...");
    connectionState = 'connecting';
    try {
        device = await navigator.bluetooth.requestDevice({
            filters: [{ services: [VESC_SERVICE_UUID] }]
        });
        console.log(`Device found: ${device.name} with ID: ${device.id}`);

        device.addEventListener("gattserverdisconnected", handleDisconnection);
        console.log("Attempting to connect to GATT server...");
        server = await device.gatt.connect();
        connectionState = 'connected';
        statusDisplay.textContent = "Status: Connected";
        console.log("Connected to GATT server successfully.");

        console.log("Retrieving UART service...");
        const service = await server.getPrimaryService(VESC_SERVICE_UUID);
        console.log("UART service obtained:", service);

        console.log("Retrieving TX characteristic...");
        txCharacteristic = await service.getCharacteristic(TX_CHARACTERISTIC_UUID);
        console.log("TX characteristic obtained:", txCharacteristic);

        console.log("Retrieving RX characteristic...");
        rxCharacteristic = await service.getCharacteristic(RX_CHARACTERISTIC_UUID);
        console.log("RX characteristic obtained:", rxCharacteristic);

        // Enable notifications on TX and provide verbose confirmation
        console.log("Enabling notifications on TX characteristic...");
        await enableNotifications(txCharacteristic);
        console.log("Notifications successfully enabled on TX characteristic.");

        // Directly request firmware version with verbose logging
        sendCommFWVersion();

    } catch (error) {
        console.error("Connection failed:", error);
        statusDisplay.textContent = "Status: Disconnected";
        connectionState = 'disconnected';
    }
}

// Function to enable notifications on a characteristic with verbose output
async function enableNotifications(characteristic) {
    await characteristic.startNotifications();
    characteristic.addEventListener("characteristicvaluechanged", handleTelemetryData); // Handle data received on TX
    console.log(`Notifications are now enabled for characteristic: ${characteristic.uuid}`);
}

// Function to handle disconnection with verbose output
function handleDisconnection(event) {
    console.log("Device disconnected from GATT server");
    statusDisplay.textContent = "Status: Disconnected";
    connectionState = 'disconnected';
    clearTimeout(firmwareTimeout); // Clear firmware timeout on disconnection
    messageBuffer = []; // Clear buffer on disconnect
}

// Function to send COMM_FW_VERSION command with verbose output
function sendCommFWVersion() {
    const startByte = 0x02;
    const payloadLength = 0x01; // Only the command ID for COMM_FW_VERSION
    const commandID = 0x00; // COMM_FW_VERSION ID
    const endByte = 0x03;

    // Calculate CRC over the command ID only (simple case)
    const crc = calculateCRC([commandID]);

    const packet = new Uint8Array([startByte, payloadLength, commandID, crc & 0xFF, (crc >> 8) & 0xFF, endByte]);
    console.log("Sending COMM_FW_VERSION command:", packet);
    writeDataChunkedWithDelay(rxCharacteristic, packet);
}

// Function to write data in chunks with a 30ms delay and verbose output
async function writeDataChunkedWithDelay(characteristic, data) {
    const chunkSize = 20;
    for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        await characteristic.writeValueWithoutResponse(chunk);
        console.log("Chunk written to RX characteristic:", chunk);
        await new Promise(resolve => setTimeout(resolve, 30)); // 30ms delay between chunks
    }
}

// Buffer incoming data from TX and assemble full messages with verbose output
function handleTelemetryData(event) {
    const value = event.target.value;
    console.log("Data chunk received from TX characteristic:", value);
    for (let i = 0; i < value.byteLength; i++) {
        messageBuffer.push(value.getUint8(i));
    }

    // Check if buffer contains a full VESC message framed by 0x02 and 0x03
    if (messageBuffer[0] === 0x02 && messageBuffer[messageBuffer.length - 1] === 0x03) {
        console.log("Full VESC message received:", new Uint8Array(messageBuffer));
        processVescMessage(new Uint8Array(messageBuffer));
        messageBuffer = []; // Clear buffer after processing
    }
}

// Function to process a complete VESC message with verbose output
function processVescMessage(message) {
    const commandID = message[2];
    if (commandID === 0x00) { // Firmware version command ID
        const majorVersion = message[3];
        const minorVersion = message[4];
        const hardwareType = message[5];
        const uuid = Array.from(message.slice(6, 12)).map(b => b.toString(16).padStart(2, '0')).join(" ");
        console.log(`Firmware Version: ${majorVersion}.${minorVersion}, Hardware: ${hardwareType}, UUID: ${uuid}`);
    } else {
        console.log("Received other telemetry data:", message);
    }
}

// Simple CRC calculation function (CRC-16) with verbose output
function calculateCRC(data) {
    let crc = 0xFFFF;
    data.forEach(byte => {
        crc ^= byte;
        for (let i = 0; i < 8; i++) {
            if (crc & 1) {
                crc = (crc >> 1) ^ 0xA001;
            } else {
                crc >>= 1;
            }
        }
    });
    console.log(`Calculated CRC for data [${data}]:`, crc);
    return crc;
}

// Attach connect function to button with verbose output
connectBtn.addEventListener("click", () => {
    if (connectionState === 'connected') {
        console.log("Disconnecting from device...");
        device.gatt.disconnect();
    } else {
        connectToDevice();
    }
});
