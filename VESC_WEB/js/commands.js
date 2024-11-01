// commands.js

export const COMMANDS = {
    COMM_FW_VERSION: 0,
    COMM_GET_VALUES: 4,
    COMM_GET_VALUES_SELECTIVE: 50, // Assuming this is the command for selective data
    // ... add other command IDs as needed
  };
  
  // Serialization function for each command
  export function serializeCommandData(commandType, parameters = {}) {
    const commandId = COMMANDS[commandType];
    const data = [];
  
    switch (commandType) {
      case 'COMM_FW_VERSION':
        // No additional data needed
        console.log('Serializing COMM_FW_VERSION command.');
        break;
  
      case 'COMM_GET_VALUES':
        // No additional data needed
        console.log('Serializing COMM_GET_VALUES command.');
        break;
  
      default:
        console.warn(`Unknown command type: ${commandType}`);
        break;
    }
  
    return { commandId, data };
  }
  
  // Parsing function for each command response
  export function parseCommandData(commandId, data) {
    const commandType = Object.keys(COMMANDS).find(key => COMMANDS[key] === commandId);
    switch (commandType) {
      case 'COMM_FW_VERSION':
        console.log('Parsing COMM_FW_VERSION response.');
        return parseCommFwVersion(data);
  
      case 'COMM_GET_VALUES':
        console.log('Parsing COMM_GET_VALUES response.');
        return parseCommGetValues(data);
  
      default:
        console.warn(`Unknown command ID: ${commandId}`);
        return {};
    }
  }
  
  // Parsing function for COMM_FW_VERSION
  function parseCommFwVersion(data) {
    let index = 0;
    const version = {};
    version.major = data[index++];
    version.minor = data[index++];
  
    // Extract hardware name
    const endOfHardwareName = data.indexOf(0, index);
    version.hardwareName = new TextDecoder().decode(data.slice(index, endOfHardwareName));
    index = endOfHardwareName + 1;
  
    // Skip the next bytes as per the protocol (e.g., UUID, flags)
    // Adjust index accordingly if needed
  
    return version;
  }
  
  // Parsing function for COMM_GET_VALUES
  function parseCommGetValues(data) {
    const view = new DataView(data.buffer);
    let index = 0;
    const values = {};
  
    // Parse voltage (assuming it's a float32)
    values.voltage = view.getFloat32(index, false);
    index += 4;
  
    // Skip other data if necessary
    // Parse motor temperature (assuming it's a float32)
    values.tempMotor = view.getFloat32(index, false);
    index += 4;
  
    // ... Continue parsing as per the VESC protocol
  
    return values;
  }
  