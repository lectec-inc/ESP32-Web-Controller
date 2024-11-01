const connectBtn = document.getElementById("connectBtn");
const statusDisplay = document.getElementById("status");
let device, server, txCharacteristic, rxCharacteristic;
let connectionState = 'disconnected';
let messageBuffer = [];

// UUIDs for VESC Service and Characteristics
const VESC_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const RX_CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e"; // Used for writing commands
const TX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e"; // Used for reading data/notifications

// Function to initiate connection with verbose output
async function connectToDevice() {
    if (connectionState !== 'disconnected') return;
    console.log("Scanning for VESC device...");
    connectionState = 'connecting';
    try {
        device = await navigator.bluetooth.requestDevice({
            filters: [{ services: [VESC_SERVICE_UUID] }]
        });
        console.log(`Device found: ${device.name}, ID: ${device.id}`);

        device.addEventListener("gattserverdisconnected", handleDisconnection);
        console.log("Attempting to connect to GATT server...");
        server = await device.gatt.connect();
        connectionState = 'connected';
        statusDisplay.textContent = "Status: Connected";
        console.log("Connected to GATT server successfully.");

        console.log("Retrieving UART service...");
        const service = await server.getPrimaryService(VESC_SERVICE_UUID);
        console.log("UART service obtained successfully");

        console.log("Retrieving RX characteristic for writing...");
        rxCharacteristic = await service.getCharacteristic(RX_CHARACTERISTIC_UUID);
        console.log(`RX characteristic (Write) obtained, UUID: ${RX_CHARACTERISTIC_UUID}`);

        console.log("Retrieving TX characteristic for notifications...");
        txCharacteristic = await service.getCharacteristic(TX_CHARACTERISTIC_UUID);
        console.log(`TX characteristic (Notify) obtained, UUID: ${TX_CHARACTERISTIC_UUID}`);

        // Enable notifications on TX
        console.log("Enabling notifications on TX characteristic...");
        await enableNotifications(txCharacteristic);
        console.log("Notifications enabled on TX characteristic");

        // Send larger COMM_FW_VERSION request after enabling notifications
        console.log("Preparing to send extended firmware version request (COMM_FW_VERSION)...");
        sendExtendedCommFWVersion();

    } catch (error) {
        console.error("Connection failed:", error);
        statusDisplay.textContent = "Status: Disconnected";
        connectionState = 'disconnected';
    }
}

// Function to enable notifications on TX characteristic
async function enableNotifications(characteristic) {
    try {
        await characteristic.startNotifications();
        characteristic.addEventListener("characteristicvaluechanged", handleTelemetryData);
        console.log(`Notifications are now enabled for TX characteristic (UUID: ${TX_CHARACTERISTIC_UUID})`);
    } catch (error) {
        console.error("Failed to enable notifications:", error);
    }
}

// **Define handleDisconnection function to reset state on disconnect**
function handleDisconnection(event) {
    console.log("Device disconnected from GATT server");
    statusDisplay.textContent = "Status: Disconnected";
    connectionState = 'disconnected';
    messageBuffer = [];
}

// Function to send extended COMM_FW_VERSION command
function sendExtendedCommFWVersion() {
    const startByte = 0x02;
    const payloadLength = 42; // 42-byte payload, similar to example
    const commandID = 0x00; // COMM_FW_VERSION
    const dummyPayload = new Array(39).fill(0x00); // Fill with dummy data for testing
    const endByte = 0x03;

    // Combine command ID with dummy payload
    const packetData = [commandID, ...dummyPayload];
    const crc = calculateCRC(packetData);
    const packet = new Uint8Array([startByte, payloadLength, ...packetData, crc & 0xFF, (crc >> 8) & 0xFF, endByte]);

    console.log("Preparing packet for extended COMM_FW_VERSION:");
    console.log(" - Packet data (hex):", Array.from(packet).map(byte => byte.toString(16).padStart(2, '0')).join(' '));
    console.log(" - Target characteristic: RX (used for writing commands)");
    console.log(" - Target characteristic UUID:", RX_CHARACTERISTIC_UUID);

    // Write packet in chunks with detailed logging
    writeDataChunkedWithDelay(rxCharacteristic, packet);
}

// Function to write data in chunks with detailed output
async function writeDataChunkedWithDelay(characteristic, data) {
    const chunkSize = 20;
    console.log(`Starting chunked write to characteristic (UUID: ${characteristic.uuid})`);

    try {
        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);
            console.log(" - Writing chunk to RX characteristic:", Array.from(chunk).map(byte => byte.toString(16).padStart(2, '0')).join(' '));
            await characteristic.writeValueWithoutResponse(chunk);
            console.log(" - Chunk written successfully, delaying next write by 30ms...");
            await new Promise(resolve => setTimeout(resolve, 30));
        }
    } catch (error) {
        console.error("Failed to write data chunk to RX characteristic:", error);
    }
    console.log("Completed writing all chunks for extended COMM_FW_VERSION packet.");
}

// Buffer incoming data from TX and assemble full messages with verbose output
function handleTelemetryData(event) {
    const value = event.target.value;
    console.log("Data chunk received from TX characteristic (hex):", Array.from(new Uint8Array(value.buffer)).map(byte => byte.toString(16).padStart(2, '0')).join(' '));

    for (let i = 0; i < value.byteLength; i++) {
        messageBuffer.push(value.getUint8(i));
    }

    if (messageBuffer[0] === 0x02 && messageBuffer[messageBuffer.length - 1] === 0x03) {
        console.log("Full VESC message received (hex):", Array.from(messageBuffer).map(byte => byte.toString(16).padStart(2, '0')).join(' '));
        processVescMessage(new Uint8Array(messageBuffer));
        messageBuffer = [];
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

// Simple CRC-16 calculation function with detailed output
function calculateCRC(data) {
    let crc = 0xFFFF;
    data.forEach(byte => {
        crc ^= byte;
        for (let i = 0; i < 8; i++) {
            crc = (crc & 1) ? (crc >> 1) ^ 0xA001 : crc >> 1;
        }
    });
    console.log(`Calculated CRC for data [${data}]:`, crc.toString(16));
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
</script>
</body>
</html>
