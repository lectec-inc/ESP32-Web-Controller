// ui.js

import { prepareCommand, fragmentPacket, setOnDataReceivedCallback } from './protocol.js';
import { sendPacketOverBLE, connectToDevice } from './communication.js';
import { COMMANDS } from './commands.js';

let connectButton;
let statusDiv;
let firmwareVersionDiv;
let voltageDiv;
let motorTempDiv;
let isConnected = false;

export function initializeUI() {
  connectButton = document.getElementById('connectButton');
  statusDiv = document.getElementById('status');
  firmwareVersionDiv = document.getElementById('firmwareVersion');
  voltageDiv = document.getElementById('voltage');
  motorTempDiv = document.getElementById('motorTemp');

  connectButton.addEventListener('click', onConnectButtonClick);

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

    // Request firmware version
    await requestFirmwareVersion();

    // Start streaming realtime data
    startRealtimeDataStream();
  } else {
    statusDiv.textContent = 'Status: Failed to connect';
    console.error('Failed to connect to VESC device.');
  }
}

async function requestFirmwareVersion() {
  console.log('Requesting firmware version...');
  const packet = prepareCommand('COMM_FW_VERSION');
  const chunks = fragmentPacket(packet);
  await sendPacketOverBLE(chunks);
}

function startRealtimeDataStream() {
  console.log('Starting realtime data stream...');
  setInterval(async () => {
    if (isConnected) {
      console.log('Requesting realtime data...');
      const packet = prepareCommand('COMM_GET_VALUES');
      const chunks = fragmentPacket(packet);
      await sendPacketOverBLE(chunks);
    }
  }, 500); // Adjust the interval as needed (e.g., 500 ms)
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

export function updateUI(data) {
  // Not used in this simplified example
}
