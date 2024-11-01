// communication.js

import { delay } from './utils.js';
import { CHUNK_DELAY_MS } from './config.js';
import { bufferIncomingData } from './protocol.js';
import { UART_SERVICE_UUID, RX_CHARACTERISTIC_UUID, TX_CHARACTERISTIC_UUID } from './config.js';

let device = null;
let server = null;
let rxCharacteristic = null; // For writing data to VESC
let txCharacteristic = null; // For receiving data from VESC

export async function connectToDevice() {
  try {
    console.log('Requesting Bluetooth device...');
    device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [UART_SERVICE_UUID] }],
    });
    console.log(`Device selected: ${device.name}`);

    console.log('Connecting to GATT server...');
    server = await device.gatt.connect();

    console.log('Getting UART service...');
    const service = await server.getPrimaryService(UART_SERVICE_UUID);

    console.log('Getting RX characteristic for writing...');
    rxCharacteristic = await service.getCharacteristic(RX_CHARACTERISTIC_UUID);

    console.log('Getting TX characteristic for notifications...');
    txCharacteristic = await service.getCharacteristic(TX_CHARACTERISTIC_UUID);

    console.log('Starting notifications on TX characteristic...');
    txCharacteristic.addEventListener('characteristicvaluechanged', onCharacteristicValueChanged);
    await txCharacteristic.startNotifications();

    console.log('Device connected and ready.');
    return true;
  } catch (error) {
    console.error('Failed to connect:', error);
    return false;
  }
}

export async function disconnectDevice() {
  if (device && device.gatt.connected) {
    console.log('Disconnecting device...');
    await device.gatt.disconnect();
    console.log('Device disconnected.');
  }
}

export async function sendPacketOverBLE(chunks) {
  for (const chunk of chunks) {
    console.log(`Sending chunk: ${Array.from(chunk).map(byte => byte.toString(16).padStart(2, '0')).join(' ')}`);
    await rxCharacteristic.writeValue(new Uint8Array(chunk));
    await delay(CHUNK_DELAY_MS);
  }
  console.log('All chunks sent.');
}

function onCharacteristicValueChanged(event) {
  const value = new Uint8Array(event.target.value.buffer);
  console.log(`Notification received with value: ${value.map(byte => byte.toString(16).padStart(2, '0')).join(' ')}`);
  bufferIncomingData(value);
}
