// protocol.js

import { crc16 } from './utils.js';
import { CHUNK_SIZE } from './config.js';
import { serializeCommandData, parseCommandData } from './commands.js';

let receiveBuffer = [];
let onDataReceivedCallback = null;

export function prepareCommand(commandType, parameters) {
  const { commandId, data } = serializeCommandData(commandType, parameters);
  console.log(`Prepared command ${commandType} with ID ${commandId}`);
  return constructPacket(commandId, data);
}

export function constructPacket(commandId, commandData) {
  const payload = [commandId, ...commandData];
  const payloadLength = payload.length;

  let startByte;
  let lengthBytes;

  if (payloadLength <= 255) {
    startByte = 0x02;
    lengthBytes = [payloadLength];
  } else {
    startByte = 0x03;
    lengthBytes = [(payloadLength >> 8) & 0xFF, payloadLength & 0xFF];
  }

  const crcValue = crc16(payload);
  const crcBytes = [(crcValue >> 8) & 0xFF, crcValue & 0xFF];
  const endByte = 0x03;

  const packet = [startByte, ...lengthBytes, ...payload, ...crcBytes, endByte];
  console.log(`Constructed packet: ${packet.map(byte => byte.toString(16).padStart(2, '0')).join(' ')}`);

  return packet;
}

export function fragmentPacket(packet) {
  const chunks = [];
  for (let i = 0; i < packet.length; i += CHUNK_SIZE) {
    const chunk = packet.slice(i, i + CHUNK_SIZE);
    chunks.push(chunk);
    console.log(`Fragmented packet chunk: ${chunk.map(byte => byte.toString(16).padStart(2, '0')).join(' ')}`);
  }
  return chunks;
}

export function bufferIncomingData(dataChunk) {
  console.log(`Received data chunk: ${Array.from(dataChunk).map(byte => byte.toString(16).padStart(2, '0')).join(' ')}`);
  receiveBuffer.push(...dataChunk);
  processReceiveBuffer();
}

function processReceiveBuffer() {
  while (true) {
    if (receiveBuffer.length < 5) {
      // Not enough data for minimum packet
      return;
    }

    // Detect Start Byte
    let startIndex = receiveBuffer.findIndex(byte => byte === 0x02 || byte === 0x03);
    if (startIndex === -1) {
      // No Start Byte found, discard buffer
      console.warn('No Start Byte found, clearing receive buffer.');
      receiveBuffer = [];
      return;
    }

    if (startIndex > 0) {
      // Discard bytes before Start Byte
      console.warn(`Discarding ${startIndex} bytes before Start Byte.`);
      receiveBuffer.splice(0, startIndex);
    }

    // Determine Packet Length
    let packetLength = 0;
    let payloadLength = 0;
    let startByte = receiveBuffer[0];

    if (startByte === 0x02) {
      if (receiveBuffer.length < 5) {
        // Not enough data for header
        return;
      }
      payloadLength = receiveBuffer[1];
      packetLength = 5 + payloadLength;
    } else if (startByte === 0x03) {
      if (receiveBuffer.length < 6) {
        // Not enough data for header
        return;
      }
      payloadLength = (receiveBuffer[1] << 8) | receiveBuffer[2];
      packetLength = 6 + payloadLength;
    } else {
      // Invalid Start Byte, discard
      console.warn('Invalid Start Byte, discarding byte.');
      receiveBuffer.shift();
      continue;
    }

    if (receiveBuffer.length < packetLength) {
      // Wait for more data
      return;
    }

    // Extract Packet
    const packet = receiveBuffer.slice(0, packetLength);
    receiveBuffer.splice(0, packetLength); // Remove packet from buffer

    console.log(`Extracted packet: ${packet.map(byte => byte.toString(16).padStart(2, '0')).join(' ')}`);

    // Validate Packet
    if (packet[packet.length - 1] !== 0x03) {
      // Invalid End Byte, discard packet
      console.warn('Invalid End Byte, discarding packet.');
      continue;
    }

    // Extract Payload
    let payloadStartIndex = startByte === 0x02 ? 2 : 3;
    const payload = packet.slice(payloadStartIndex, packet.length - 3);

    // Extract and Validate CRC
    const receivedCrc = (packet[packet.length - 3] << 8) | packet[packet.length - 2];
    const calculatedCrc = crc16(payload);

    if (receivedCrc !== calculatedCrc) {
      // CRC mismatch, discard packet
      console.warn('CRC mismatch, discarding packet.');
      continue;
    }

    console.log('Packet CRC validated successfully.');

    // Process Payload
    processPayload(payload);
  }
}

function processPayload(payload) {
  const commandId = payload[0];
  const data = payload.slice(1);
  console.log(`Processing payload for command ID ${commandId}`);

  const parsedData = parseCommandData(commandId, data);

  // Notify UI or other modules
  if (onDataReceivedCallback) {
    onDataReceivedCallback(commandId, parsedData);
  }
}

export function setOnDataReceivedCallback(callback) {
  onDataReceivedCallback = callback;
}
