#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <Adafruit_NeoPixel.h>

#define LED_PIN 8         // GPIO pin connected to the RGB LED
#define NUM_PIXELS 1      // Number of LEDs
#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

// Initialize the NeoPixel library for 1 LED on GPIO 8
Adafruit_NeoPixel rgbLed(NUM_PIXELS, LED_PIN, NEO_GRB + NEO_KHZ800);

// Bluetooth characteristic callback class
class MyCallbacks : public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *characteristic) {
        // Get the value as an Arduino String for compatibility
        String value = characteristic->getValue().c_str();

        // Print the received value to Serial Monitor
        Serial.print("Received value: ");
        Serial.println(value);

        // Check the command and act accordingly
        if (value == "ON") {
            rgbLed.setPixelColor(0, rgbLed.Color(255, 255, 255));  // Set LED to white
            rgbLed.show();
            Serial.println("LED ON (White)");
        } else if (value == "OFF") {
            rgbLed.setPixelColor(0, rgbLed.Color(0, 0, 0));         // Turn off LED
            rgbLed.show();
            Serial.println("LED OFF");
        } else {
            Serial.println("Unknown command received.");
        }
    }
};

void setup() {
    Serial.begin(115200);
    Serial.println("Starting BLE and RGB LED Test");

    // Initialize the NeoPixel
    rgbLed.begin();
    rgbLed.show();  // Start with LED off
    Serial.println("LED initialized and set to OFF");

    // Initialize BLE
    BLEDevice::init("ESP32 LED Controller");
    BLEServer *server = BLEDevice::createServer();
    Serial.println("BLE server created");

    BLEService *service = server->createService(SERVICE_UUID);
    Serial.println("BLE service created");

    BLECharacteristic *characteristic = service->createCharacteristic(
        CHARACTERISTIC_UUID,
        BLECharacteristic::PROPERTY_WRITE
    );
    Serial.println("BLE characteristic created");

    characteristic->setCallbacks(new MyCallbacks());
    service->start();
    Serial.println("BLE service started");

    // Start advertising the BLE service
    BLEAdvertising *advertising = BLEDevice::getAdvertising();
    advertising->addServiceUUID(SERVICE_UUID);
    advertising->setScanResponse(true);
    advertising->start();
    Serial.println("Advertising started. Waiting for client connection...");
}

void loop() {
    // No need for code here as BLE handles the LED control via callbacks
}
