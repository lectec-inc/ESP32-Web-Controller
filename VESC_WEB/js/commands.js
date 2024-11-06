// commands.js

export const COMMANDS = {
	COMM_FW_VERSION: 0,
	COMM_JUMP_TO_BOOTLOADER: 1,
	COMM_ERASE_NEW_APP: 2,
	COMM_WRITE_NEW_APP_DATA: 3,
	COMM_GET_VALUES: 4,
	COMM_SET_DUTY: 5,
	COMM_SET_CURRENT: 6,
	COMM_SET_CURRENT_BRAKE: 7,
	COMM_SET_RPM: 8,
	COMM_SET_POS: 9,
	COMM_SET_HANDBRAKE: 10,
	COMM_SET_DETECT: 11,
	COMM_SET_SERVO_POS: 12,
	COMM_SET_MCCONF: 13,
	COMM_GET_MCCONF: 14,
	COMM_GET_MCCONF_DEFAULT: 15,
	COMM_SET_APPCONF: 16,
	COMM_GET_APPCONF: 17,
	COMM_GET_APPCONF_DEFAULT: 18,
	COMM_SAMPLE_PRINT: 19,
	COMM_TERMINAL_CMD: 20,
	COMM_PRINT: 21,
	COMM_ROTOR_POSITION: 22,
	COMM_EXPERIMENT_SAMPLE: 23,
	COMM_DETECT_MOTOR_PARAM: 24,
	COMM_DETECT_MOTOR_R_L: 25,
	COMM_DETECT_MOTOR_FLUX_LINKAGE: 26,
	COMM_DETECT_ENCODER: 27,
	COMM_DETECT_HALL_FOC: 28,
	COMM_REBOOT: 29,
	COMM_ALIVE: 30,
	COMM_GET_DECODED_PPM: 31,
	COMM_GET_DECODED_ADC: 32,
	COMM_GET_DECODED_CHUK: 33,
	COMM_FORWARD_CAN: 34,
	COMM_SET_CHUCK_DATA: 35,
	COMM_CUSTOM_APP_DATA: 36,
	COMM_NRF_START_PAIRING: 37,
	COMM_GPD_SET_FSW: 38,
	COMM_GPD_BUFFER_NOTIFY: 39,
	COMM_GPD_BUFFER_SIZE_LEFT: 40,
	COMM_GPD_FILL_BUFFER: 41,
	COMM_GPD_OUTPUT_SAMPLE: 42,
	COMM_GPD_SET_MODE: 43,
	COMM_GPD_FILL_BUFFER_INT8: 44,
	COMM_GPD_FILL_BUFFER_INT16: 45,
	COMM_GPD_SET_BUFFER_INT_SCALE: 46,
	COMM_GET_VALUES_SETUP: 47,
	COMM_SET_MCCONF_TEMP: 48,
	COMM_SET_MCCONF_TEMP_SETUP: 49,
	COMM_GET_VALUES_SELECTIVE: 50,
	COMM_GET_VALUES_SETUP_SELECTIVE: 51,
	COMM_EXT_NRF_PRESENT: 52,
	COMM_EXT_NRF_ESB_SET_CH_ADDR: 53,
	COMM_EXT_NRF_ESB_SEND_DATA: 54,
	COMM_EXT_NRF_ESB_RX_DATA: 55,
	COMM_EXT_NRF_SET_ENABLED: 56,
	COMM_DETECT_MOTOR_FLUX_LINKAGE_OPENLOOP: 57,
	COMM_DETECT_APPLY_ALL_FOC: 58,
	COMM_JUMP_TO_BOOTLOADER_ALL_CAN: 59,
	COMM_ERASE_NEW_APP_ALL_CAN: 60,
	COMM_WRITE_NEW_APP_DATA_ALL_CAN: 61,
	COMM_PING_CAN: 62,
	COMM_APP_DISABLE_OUTPUT: 63,
	COMM_TERMINAL_CMD_SYNC: 64,
	COMM_GET_IMU_DATA: 65,
	COMM_BM_CONNECT: 66,
	COMM_BM_ERASE_FLASH_ALL: 67,
	COMM_BM_WRITE_FLASH: 68,
	COMM_BM_REBOOT: 69,
	COMM_BM_DISCONNECT: 70,
	COMM_BM_MAP_PINS_DEFAULT: 71,
	COMM_BM_MAP_PINS_NRF5X: 72,
	COMM_ERASE_BOOTLOADER: 73,
	COMM_ERASE_BOOTLOADER_ALL_CAN: 74,
	COMM_PLOT_INIT: 75,
	COMM_PLOT_DATA: 76,
	COMM_PLOT_ADD_GRAPH: 77,
	COMM_PLOT_SET_GRAPH: 78,
	COMM_GET_DECODED_BALANCE: 79,
	COMM_BM_MEM_READ: 80,
	COMM_WRITE_NEW_APP_DATA_LZO: 81,
	COMM_WRITE_NEW_APP_DATA_ALL_CAN_LZO: 82,
	COMM_BM_WRITE_FLASH_LZO: 83,
	COMM_SET_CURRENT_REL: 84,
	COMM_CAN_FWD_FRAME: 85,
	COMM_SET_BATTERY_CUT: 86,
	COMM_SET_BLE_NAME: 87,
	COMM_SET_BLE_PIN: 88,
	COMM_SET_CAN_MODE: 89,
	COMM_GET_IMU_CALIBRATION: 90,
	COMM_GET_MCCONF_TEMP: 91,
	COMM_GET_CUSTOM_CONFIG_XML: 92,
	COMM_GET_CUSTOM_CONFIG: 93,
	COMM_GET_CUSTOM_CONFIG_DEFAULT: 94,
	COMM_SET_CUSTOM_CONFIG: 95,
	COMM_BMS_GET_VALUES: 96,
	COMM_BMS_SET_CHARGE_ALLOWED: 97,
	COMM_BMS_SET_BALANCE_OVERRIDE: 98,
	COMM_BMS_RESET_COUNTERS: 99,
	COMM_BMS_FORCE_BALANCE: 100,
	COMM_BMS_ZERO_CURRENT_OFFSET: 101,
	COMM_JUMP_TO_BOOTLOADER_HW: 102,
	COMM_ERASE_NEW_APP_HW: 103,
	COMM_WRITE_NEW_APP_DATA_HW: 104,
	COMM_ERASE_BOOTLOADER_HW: 105,
	COMM_JUMP_TO_BOOTLOADER_ALL_CAN_HW: 106,
	COMM_ERASE_NEW_APP_ALL_CAN_HW: 107,
	COMM_WRITE_NEW_APP_DATA_ALL_CAN_HW: 108,
	COMM_ERASE_BOOTLOADER_ALL_CAN_HW: 109,
	COMM_SET_ODOMETER: 110,
	COMM_PSW_GET_STATUS: 111,
	COMM_PSW_SWITCH: 112,
	COMM_BMS_FWD_CAN_RX: 113,
	COMM_BMS_HW_DATA: 114,
	COMM_GET_BATTERY_CUT: 115,
	COMM_BM_HALT_REQ: 116,
	COMM_GET_QML_UI_HW: 117,
	COMM_GET_QML_UI_APP: 118,
	COMM_CUSTOM_HW_DATA: 119,
	COMM_QMLUI_ERASE: 120,
	COMM_QMLUI_WRITE: 121,
	COMM_IO_BOARD_GET_ALL: 122,
	COMM_IO_BOARD_SET_PWM: 123,
	COMM_IO_BOARD_SET_DIGITAL: 124,
	COMM_BM_MEM_WRITE: 125,
	COMM_BMS_BLNC_SELFTEST: 126,
	COMM_GET_EXT_HUM_TMP: 127,
	COMM_GET_STATS: 128,
	COMM_RESET_STATS: 129,
	COMM_LISP_READ_CODE: 130,
	COMM_LISP_WRITE_CODE: 131,
	COMM_LISP_ERASE_CODE: 132,
	COMM_LISP_SET_RUNNING: 133,
	COMM_LISP_GET_STATS: 134,
	COMM_LISP_PRINT: 135,
	COMM_BMS_SET_BATT_TYPE: 136,
	COMM_BMS_GET_BATT_TYPE: 137,
	COMM_LISP_REPL_CMD: 138,
	COMM_LISP_STREAM_CODE: 139,
	COMM_FILE_LIST: 140,
	COMM_FILE_READ: 141,
	COMM_FILE_WRITE: 142,
	COMM_FILE_MKDIR: 143,
	COMM_FILE_REMOVE: 144,
	COMM_LOG_START: 145,
	COMM_LOG_STOP: 146,
	COMM_LOG_CONFIG_FIELD: 147,
	COMM_LOG_DATA_F32: 148,
	COMM_SET_APPCONF_NO_STORE: 149,
	COMM_GET_GNSS: 150,
	COMM_LOG_DATA_F64: 151,
	COMM_LISP_RMSG: 152,
	COMM_SHUTDOWN: 156
};

// Serialization function for each command
export function serializeCommandData(commandType, parameters = {}) {
	const commandId = COMMANDS[commandType];
	const data = [];

	switch (commandType) {
		case 'COMM_FW_VERSION':
			console.log('Serializing COMM_FW_VERSION command.');
			break;

		case 'COMM_GET_VALUES':
			console.log('Serializing COMM_GET_VALUES command.');
			break;

		case 'COMM_PING_CAN':
			console.log('Serializing COMM_PING_CAN command.');
			break;

        case 'COMM_LISP_READ_CODE':
            console.log('Serializing COMM_LISP_READ_CODE command.');
            const lenBytes = new Uint8Array(4);
            const offsetBytes = new Uint8Array(4);
            new DataView(lenBytes.buffer).setInt32(0, parameters.len, false);
            new DataView(offsetBytes.buffer).setInt32(0, parameters.offset, false);
            data.push(...lenBytes, ...offsetBytes);
            break;
            

		case 'COMM_LISP_WRITE_CODE':
			console.log('Serializing COMM_LISP_WRITE_CODE command.');
			data.push(parameters.offset || 0);
			data.push(...parameters.data);
			break;

		case 'COMM_LISP_ERASE_CODE':
			console.log('Serializing COMM_LISP_ERASE_CODE command.');
			data.push(parameters.eraseSize || -1);
			break;

		case 'COMM_FILE_LIST':
			console.log('Serializing COMM_FILE_LIST command.');
			data.push(...new TextEncoder().encode(parameters.path || ''));
			data.push(0); // Null-terminator for string
			data.push(...new TextEncoder().encode(parameters.from || ''));
			data.push(0); // Null-terminator for string
			break;

		case 'COMM_FILE_READ':
			console.log('Serializing COMM_FILE_READ command.');
			data.push(...new TextEncoder().encode(parameters.path || ''));
			data.push(0); // Null-terminator for string
			data.push(parameters.offset || 0);
			break;

		case 'COMM_FILE_WRITE':
			console.log('Serializing COMM_FILE_WRITE command.');
			data.push(...new TextEncoder().encode(parameters.path || ''));
			data.push(0); // Null-terminator for string
			data.push(parameters.offset || 0);
			data.push(...parameters.data);
			break;

		case 'COMM_FILE_MKDIR':
			console.log('Serializing COMM_FILE_MKDIR command.');
			data.push(...new TextEncoder().encode(parameters.path || ''));
			data.push(0); // Null-terminator for string
			break;

		case 'COMM_FILE_REMOVE':
			console.log('Serializing COMM_FILE_REMOVE command.');
			data.push(...new TextEncoder().encode(parameters.path || ''));
			data.push(0); // Null-terminator for string
			break;

		case 'COMM_LISP_RMSG':
			console.log('Serializing COMM_LISP_RMSG command.');
			break;

        case 'COMM_LISP_GET_STATS':
            console.log('Serializing COMM_LISP_GET_STATS command.');
            // No additional data needed for this command
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

		case 'COMM_PING_CAN':
			console.log('Parsing COMM_PING_CAN response.');
			return parseCommPingCAN(data);

        case 'COMM_LISP_READ_CODE':
            console.log('Parsing COMM_LISP_READ_CODE response.');
            return parseCommLispReadCode(data instanceof Uint8Array ? data.buffer : data);  // Ensure buffer
            

		case 'COMM_LISP_WRITE_CODE':
			console.log('Parsing COMM_LISP_WRITE_CODE response.');
			return parseCommLispWriteCode(data);

		case 'COMM_LISP_ERASE_CODE':
			console.log('Parsing COMM_LISP_ERASE_CODE response.');
			return { success: true };

		case 'COMM_LISP_SET_RUNNING':
			console.log('Parsing COMM_LISP_SET_RUNNING response.');
			return parseCommLispSetRunning(data);

		case 'COMM_LISP_GET_STATS':
			console.log('Parsing COMM_LISP_GET_STATS response.');
			return parseCommLispGetStats(data);

		case 'COMM_LISP_PRINT':
			console.log('Parsing COMM_LISP_PRINT response.');
			return parseCommLispPrint(data);

		case 'COMM_LISP_REPL_CMD':
			console.log('Parsing COMM_LISP_REPL_CMD response.');
			return parseCommLispReplCmd(data);

		case 'COMM_LISP_STREAM_CODE':
			console.log('Parsing COMM_LISP_STREAM_CODE response.');
			return parseCommLispStreamCode(data);

        case 'COMM_FILE_LIST':
            console.log('Parsing COMM_FILE_LIST response.');
            return data && data.buffer ? parseCommFileList(data.buffer) : {};

        case 'COMM_FILE_READ':
            console.log('Parsing COMM_FILE_READ response.');
            return data && data.buffer ? parseCommFileRead(data.buffer) : {};

        case 'COMM_FILE_WRITE':
            console.log('Parsing COMM_FILE_WRITE response.');
            return data && data.buffer ? parseCommFileWrite(data.buffer) : {};

		case 'COMM_FILE_MKDIR':
			console.log('Parsing COMM_FILE_MKDIR response.');
			return parseCommFileMkdir(data);

		case 'COMM_FILE_REMOVE':
			console.log('Parsing COMM_FILE_REMOVE response.');
			return parseCommFileRemove(data);

		case 'COMM_LISP_RMSG':
			console.log('Parsing COMM_LISP_RMSG response.');
			return data && data.buffer ? parseCommLispRmsg(data.buffer) : {};

        case 'COMM_LISP_GET_STATS':
            console.log('Parsing COMM_LISP_GET_STATS response.');
            return data && data.buffer ? parseCommLispGetStats(data.buffer) : {};

		default:
			console.warn(`Unknown command ID: ${commandId}`);
			return {};
	}
}

// Helper parsing functions
function parseCommFwVersion(data) {
	let index = 0;
	const version = {};

	version.major = data[index++];
	version.minor = data[index++];

	const endOfHardwareName = data.indexOf(0, index);
	if (endOfHardwareName > -1) {
		const nameBytes = new Uint8Array(data.slice(index, endOfHardwareName));
		version.hardwareName = new TextDecoder().decode(nameBytes.buffer);
	} else {
		console.error("Error: Hardware name not null-terminated");
		version.hardwareName = "";
	}

	return version;
}

function parseCommPingCAN(data) {
	const deviceIds = [];
	for (let i = 0; i < data.length; i++) {
		deviceIds.push(data[i]);
	}
	return { deviceIds };
}

function parseCommLispPrint(data) {
	const message = new TextDecoder('utf-8').decode(data);
	return { message };
}

function parseCommGetValues(data) {
	const view = new DataView(data.buffer);
	let index = 0;
	const values = {};

	values.voltage = view.getFloat32(index, false);
	index += 4;
	values.tempMotor = view.getFloat32(index, false);

	return values;
}

function parseCommLispReadCode(data) {
    // Check if data is a Uint8Array or ArrayBuffer directly, and assign buffer accordingly
    const buffer = data instanceof ArrayBuffer ? data : data instanceof Uint8Array ? data.buffer : null;

    // Log data type for inspection
    console.log("Received data type:", typeof data);
    console.log("Is ArrayBuffer:", data instanceof ArrayBuffer);
    console.log("Is Uint8Array:", data instanceof Uint8Array);

    if (!buffer) {
        console.error("Error: Data is not in a compatible format. Expected ArrayBuffer or Uint8Array.");
        return {}; // Return an empty object to gracefully handle the error
    }

    const view = new DataView(buffer);
    let index = 0;
    const result = {};

    // Validate minimum expected data length
    if (view.byteLength < 8) {
        console.error("Error: Insufficient data length for COMM_LISP_READ_CODE.");
        console.log("Data length:", view.byteLength);
        return {};
    }

    try {
        // Parse `qmlui_len` (int32)
        result.qmlui_len = view.getInt32(index, false);
        index += 4;

        // Parse `ofs_qml` (int32)
        result.ofs_qml = view.getInt32(index, false);
        index += 4;

        // Ensure we have the expected amount of code data
        if (view.byteLength < index + result.qmlui_len) {
            console.error("Error: Data length does not match expected `qmlui_len`.");
            console.log("Expected length:", result.qmlui_len, "Available length:", view.byteLength - index);
            return {};
        }

        // Extract code data
        result.codeData = new Uint8Array(buffer, index, result.qmlui_len);
        result.codeText = new TextDecoder("utf-8").decode(result.codeData); // Decode as text for readability

    } catch (e) {
        console.error("Error during parsing:", e.message);
        return {};
    }

    console.log("Parsed COMM_LISP_READ_CODE data:", result);
    return result;
}




function parseCommLispWriteCode(data) {
	const view = new DataView(data.buffer);
	let index = 0;
	const result = {};

	result.flash_res = view.getUint8(index) === 1;
	index += 1;
	result.qmlui_offset = view.getUint32(index, false);

	return result;
}

function parseCommLispSetRunning(data) {
	const view = new DataView(data.buffer);
	return { running: view.getUint8(0) === 1 };
}

function parseCommLispGetStats(data) {
    // Ensure data is a Uint8Array or ArrayBuffer for DataView compatibility
    const buffer = data instanceof ArrayBuffer
        ? data
        : (data instanceof Uint8Array ? data.buffer : new Uint8Array(data).buffer);

    const view = new DataView(buffer);
    let index = 0;

    return {
        totalMemory: view.getUint32(index, false),
        currentMemory: view.getUint32(index += 4, false),
        cpuUsage: view.getFloat32(index += 4, false),
        executionCount: view.getUint32(index += 4, false)
    };
}


function parseCommLispReplCmd(data) {
	return { replOutput: new TextDecoder('utf-8').decode(data) };
}

function parseCommLispStreamCode(data) {
	return { codeChunk: new TextDecoder('utf-8').decode(data) };
}

function parseCommFileList(data) {
	const view = new DataView(data.buffer);
	let index = 0;
	const fileList = [];

	while (index < data.byteLength) {
		const isDirectory = view.getUint8(index) === 1;
		index += 1;

		const fileSize = view.getInt32(index, true);
		index += 4;

		let fileName = '';
		while (data[index] !== 0 && index < data.byteLength) {
			fileName += String.fromCharCode(data[index]);
			index += 1;
		}
		index += 1; // Skip null terminator

		fileList.push({ isDirectory, fileSize, fileName });
	}

	return { fileList };
}

function parseCommFileRead(data) {
	const view = new DataView(data.buffer);
	let index = 0;

	const result = {};
	result.offset = view.getInt32(index, true);
	index += 4;
	result.totalSize = view.getInt32(index, true);
	index += 4;

	const contentArray = new Uint8Array(data.buffer, index);
	result.content = new TextDecoder().decode(contentArray);

	return result;
}

function parseCommFileWrite(data) {
	const view = new DataView(data.buffer);
	let index = 0;

	return {
		offset: view.getInt32(index, true),
		success: view.getUint8(index + 4) === 1
	};
}

function parseCommFileMkdir(data) {
	return { success: new DataView(data.buffer).getUint8(0) === 1 };
}

function parseCommFileRemove(data) {
	return { success: new DataView(data.buffer).getUint8(0) === 1 };
}

function parseCommLispRmsg(data) {
	return { message: new TextDecoder('utf-8').decode(data) };
}
