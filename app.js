document.getElementById('connectBtn').addEventListener('click', function() {
    // Attempt to connect only to devices that have a name starting with 'Express'
    navigator.bluetooth.requestDevice({
        filters: [{
            namePrefix: 'Express'
        }],
        optionalServices: ['battery_service'] // Include the UUIDs of any services you need to interact with
    })
    .then(device => {
        // Connection process starts if a device is selected
        console.log('Device selected:', device.name); // Log the selected device name
        return device.gatt.connect();
    })
    .then(server => {
        // Update web page to show successful connection
        document.getElementById('status').textContent = 'Success: Connected to ' + server.device.name;
    })
    .catch(error => {
        // Handle errors in connection or device selection
        console.error('Connection failed:', error);
        document.getElementById('status').textContent = 'Failed to connect: ' + error;
    });
});
