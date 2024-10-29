#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <Adafruit_NeoPixel.h>

#define LED_PIN 8
#define NUM_PIXELS 1
#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

const char* DEVICE_NAME = "Lectec-H2L0";

Adafruit_NeoPixel rgbLed(NUM_PIXELS, LED_PIN, NEO_GRB + NEO_KHZ800);

// Callback class to handle disconnects
class ServerCallbacks : public BLEServerCallbacks {
    void onConnect(BLEServer* server) {
        Serial.println("Client connected");
    }

    void onDisconnect(BLEServer* server) {
        Serial.println("Client disconnected. Restarting advertising...");
        server->startAdvertising();  // Restart advertising on disconnect
    }
};

class MyCallbacks : public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *characteristic) {
        String value = characteristic->getValue().c_str();
        Serial.print("Received value: ");
        Serial.println(value);

        if (value == "ON") {
            rgbLed.setPixelColor(0, rgbLed.Color(255, 255, 255));
            rgbLed.show();
            Serial.println("LED ON (White)");
        } else if (value == "OFF") {
            rgbLed.setPixelColor(0, rgbLed.Color(0, 0, 0));
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

    rgbLed.begin();
    rgbLed.show();
    Serial.println("LED initialized and set to OFF");

    BLEDevice::init(DEVICE_NAME);
    BLEServer *server = BLEDevice::createServer();
    server->setCallbacks(new ServerCallbacks());  // Set disconnect callback

    BLEService *service = server->createService(SERVICE_UUID);
    BLECharacteristic *characteristic = service->createCharacteristic(
        CHARACTERISTIC_UUID,
        BLECharacteristic::PROPERTY_WRITE
    );

    characteristic->setCallbacks(new MyCallbacks());
    service->start();

    BLEAdvertising *advertising = BLEDevice::getAdvertising();
    advertising->addServiceUUID(SERVICE_UUID);
    advertising->setScanResponse(true);
    advertising->start();

    Serial.printf("Advertising started with name %s. Waiting for client connection...\n", DEVICE_NAME);
}

void loop() {
    delay(5000);  // Keep loop clean for readability
}
