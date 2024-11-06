// ui.js

import { prepareCommand, fragmentPacket, setOnDataReceivedCallback } from './protocol.js';
import { sendPacketOverBLE, connectToDevice } from './communication.js';
import { COMMANDS } from './commands.js';
import { delay } from './utils.js';

let connectButton;
let statusDiv;
let firmwareVersionDiv;
let voltageDiv;
let motorTempDiv;
let isConnected = false;
let accumulatedData = null;   // Buffer to accumulate incoming data
let totalLength = 0;          // Expected total length of data (set upon receiving first response)
let offset = 0;               // Current offset for reading
const chunkSize = 20;         // Size of each chunk to request

let commandQueue = [];
let isProcessingQueue = false;

export function initializeUI() {
  connectButton = document.getElementById('connectButton');
  statusDiv = document.getElementById('status');
  firmwareVersionDiv = document.getElementById('firmwareVersion');
  voltageDiv = document.getElementById('voltage');
  motorTempDiv = document.getElementById('motorTemp');

  connectButton.addEventListener('click', onConnectButtonClick);

  // Set the onDataReceivedCallback for handling data responses
  setOnDataReceivedCallback(onDataReceived);
}

async function onConnectButtonClick() {
  statusDiv.textContent = 'Status: Connecting...';
  console.log('Attempting to connect to VESC device...');
  const success = await connectToDevice();
  if (success) {
    statusDiv.textContent = 'Status: Connected';
    connectButton.disabled = true;
    isConnected = true;
    console.log('Connected to VESC device.');

    // Enqueue commands
    queueCommand(requestFirmwareVersion, 10);
    queueCommand(requestCanDevices, 10);
    // Add additional commands here as needed
    queueCommand(requestLispStats, 5);
    offset = 0;
    queueCommand(() => requestLispReadCode(chunkSize, offset), 60);

  } else {
    statusDiv.textContent = 'Status: Failed to connect';
    console.error('Failed to connect to VESC device.');
  }
}

function queueCommand(commandFunc, timeoutSeconds = 5) {
  commandQueue.push({ commandFunc, timeoutSeconds });
  processQueue();
}

async function processQueue() {
  if (isProcessingQueue || commandQueue.length === 0) return;

  isProcessingQueue = true;

  while (commandQueue.length > 0) {
    const { commandFunc, timeoutSeconds } = commandQueue.shift();

    // Send the command and wait for a response or timeout
    const responseReceived = await sendCommandAndWait(commandFunc, timeoutSeconds);

    if (!responseReceived) {
      console.warn("No response received, moving to the next command.");
    }
  }

  isProcessingQueue = false;
}

async function sendCommandAndWait(commandFunc, timeoutSeconds) {
  console.log("Sending command...");
  
  // Execute the command function (e.g., requestFirmwareVersion, requestCanDevices)
  commandFunc();

  // Wait for the notification for the specified timeout
  return waitForNotification(timeoutSeconds);
}

async function waitForNotification(timeoutSeconds = 5) {
  console.log(`Waiting for response for up to ${timeoutSeconds} seconds...`);
  statusDiv.textContent = "Waiting for response...";

  return new Promise((resolve) => {
    let responseHandled = false;

    // Listen for data within the timeout period
    const timeoutId = setTimeout(() => {
      if (!responseHandled) {
        console.warn("Timeout reached, continuing without response.");
        statusDiv.textContent = "Response not received, continuing...";
        resolve(false);
      }
    }, timeoutSeconds * 1000);

    // Temporary response handler to update UI for specific commands
    const handleResponse = (commandId, data) => {
      responseHandled = true;
      clearTimeout(timeoutId);
      console.log("Response received.");
      statusDiv.textContent = "Response received.";

      // Process and update the UI based on the response command ID
      onDataReceived(commandId, data);

      resolve(true);
    };

    // Set the temporary callback
    setOnDataReceivedCallback(handleResponse);
  });
}

// Command functions to send specific requests
async function requestFirmwareVersion() {
  console.log('Requesting firmware version...');
  const packet = prepareCommand('COMM_FW_VERSION');
  const chunks = fragmentPacket(packet);
  await sendPacketOverBLE(chunks);
}

async function requestCanDevices() {
  console.log('Requesting CAN devices...');
  const packet = prepareCommand('COMM_PING_CAN');
  const chunks = fragmentPacket(packet);
  await sendPacketOverBLE(chunks);
}

// Additional commands based on your list
async function requestLispReadCode(len, offset) {
    console.log(`Requesting LISP Read Code at offset ${offset} with length ${len}...`);
    const packet = prepareCommand('COMM_LISP_READ_CODE', { len, offset });
    const chunks = fragmentPacket(packet);
    await sendPacketOverBLE(chunks);
  }

async function requestLispWriteCode(offset, data) {
  console.log('Requesting LISP Write Code...');
  const packet = prepareCommand('COMM_LISP_WRITE_CODE', { offset, data });
  const chunks = fragmentPacket(packet);
  await sendPacketOverBLE(chunks);
}

async function requestLispEraseCode(eraseSize = -1) {
  console.log('Requesting LISP Erase Code...');
  const packet = prepareCommand('COMM_LISP_ERASE_CODE', { eraseSize });
  const chunks = fragmentPacket(packet);
  await sendPacketOverBLE(chunks);
}

async function requestLispSetRunning(running) {
  console.log('Requesting LISP Set Running...');
  const packet = prepareCommand('COMM_LISP_SET_RUNNING', { running });
  const chunks = fragmentPacket(packet);
  await sendPacketOverBLE(chunks);
}

async function requestLispGetStats() {
  console.log('Requesting LISP Get Stats...');
  const packet = prepareCommand('COMM_LISP_GET_STATS');
  const chunks = fragmentPacket(packet);
  await sendPacketOverBLE(chunks);
}

async function requestLispPrint() {
  console.log('Requesting LISP Print...');
  const packet = prepareCommand('COMM_LISP_PRINT');
  const chunks = fragmentPacket(packet);
  await sendPacketOverBLE(chunks);
}

async function requestLispReplCmd(command) {
  console.log('Requesting LISP REPL Command...');
  const packet = prepareCommand('COMM_LISP_REPL_CMD', { command });
  const chunks = fragmentPacket(packet);
  await sendPacketOverBLE(chunks);
}

async function requestLispStreamCode(codeChunk) {
  console.log('Requesting LISP Stream Code...');
  const packet = prepareCommand('COMM_LISP_STREAM_CODE', { codeChunk });
  const chunks = fragmentPacket(packet);
  await sendPacketOverBLE(chunks);
}

async function requestFileList(path = '', from = '') {
  console.log('Requesting File List...');
  const packet = prepareCommand('COMM_FILE_LIST', { path, from });
  const chunks = fragmentPacket(packet);
  await sendPacketOverBLE(chunks);
}

async function requestFileRead(path, offset = 0) {
  console.log('Requesting File Read...');
  const packet = prepareCommand('COMM_FILE_READ', { path, offset });
  const chunks = fragmentPacket(packet);
  await sendPacketOverBLE(chunks);
}

async function requestFileWrite(path, offset, data) {
  console.log('Requesting File Write...');
  const packet = prepareCommand('COMM_FILE_WRITE', { path, offset, data });
  const chunks = fragmentPacket(packet);
  await sendPacketOverBLE(chunks);
}

async function requestFileMkdir(path) {
  console.log('Requesting File Mkdir...');
  const packet = prepareCommand('COMM_FILE_MKDIR', { path });
  const chunks = fragmentPacket(packet);
  await sendPacketOverBLE(chunks);
}

async function requestFileRemove(path) {
  console.log('Requesting File Remove...');
  const packet = prepareCommand('COMM_FILE_REMOVE', { path });
  const chunks = fragmentPacket(packet);
  await sendPacketOverBLE(chunks);
}

async function requestLispRmsg() {
  console.log('Requesting LISP Rmsg...');
  const packet = prepareCommand('COMM_LISP_RMSG');
  const chunks = fragmentPacket(packet);
  await sendPacketOverBLE(chunks);
}

async function requestLispStats() {
    console.log('Requesting Lisp Stats...');
    const packet = prepareCommand('COMM_LISP_GET_STATS');
    const chunks = fragmentPacket(packet);
    await sendPacketOverBLE(chunks);
  }
  

function onDataReceived(commandId, data) {
  const commandType = Object.keys(COMMANDS).find(key => COMMANDS[key] === commandId);

  switch (commandType) {
    case 'COMM_FW_VERSION':
      console.log('Firmware version data received.');
      updateFirmwareVersion(data);
      break;

    case 'COMM_GET_VALUES':
      console.log('Realtime data received.');
      updateRealtimeData(data);
      break;
    
    case 'COMM_PING_CAN':
      console.log('CAN device data received.');
      updateCanDevices(data.deviceIds);
      break;

    default:
      console.log(`Received data for command ${commandType}`, data);
      break;
  }
}

function updateFirmwareVersion(data) {
  const versionText = `Firmware Version: ${data.major}.${data.minor} (${data.hardwareName})`;
  firmwareVersionDiv.textContent = versionText;
  console.log(versionText);
}

function updateRealtimeData(data) {
  if (data.voltage !== undefined) {
    voltageDiv.textContent = `Voltage: ${data.voltage.toFixed(2)} V`;
    console.log(`Voltage: ${data.voltage.toFixed(2)} V`);
  }
  if (data.tempMotor !== undefined) {
    motorTempDiv.textContent = `Motor Temperature: ${data.tempMotor.toFixed(2)} °C`;
    console.log(`Motor Temperature: ${data.tempMotor.toFixed(2)} °C`);
  }
}

function updateCanDevices(deviceIds) {
    const canDevicesDiv = document.getElementById('canDevices');
    canDevicesDiv.innerHTML = ''; // Clear previous device list

    if (deviceIds.length === 0) {
        canDevicesDiv.textContent = 'No CAN devices found.';
    } else {
        deviceIds.forEach(id => {
            const deviceElem = document.createElement('div');
            deviceElem.textContent = `CAN Device ID: ${id}`;
            canDevicesDiv.appendChild(deviceElem);
        });
    }
}

function onLispReadCodeReceived(data) {
    if (offset === 0) {
      // On the first packet, set the total length and initialize the buffer
      totalLength = data.qmlui_len;
      accumulatedData = new Uint8Array(totalLength);
    }
  
    // Add the current chunk to the accumulatedData buffer at the correct offset
    accumulatedData.set(data.codeData, data.ofs_qml);
  
    // Check if all data has been accumulated
    if (offset + data.codeData.length >= totalLength) {
      console.log("All data received. Processing complete data...");
      processCompleteData(accumulatedData); // Process or decode the entire buffer as needed
    } else {
      // Increment offset by chunkSize and request the next chunk
      offset += chunkSize;
      requestLispReadCode(chunkSize, offset);
    }
}
  

  function processCompleteData(dataBuffer) {
    const codeText = new TextDecoder("utf-8").decode(dataBuffer);
    console.log("Complete LISP Code Data:", codeText);
    // Further processing as needed...
  }

export function updateUI(data) {
  // Not used in this simplified example
}
