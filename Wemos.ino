#include <SoftwareSerial.h>  // Thư viện cho EspSoftwareSerial
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <  >
#define RX_PIN 4  // Chân RX của EspSoftwareSerial
#define TX_PIN 5  // Chân TX của EspSoftwareSerial
StaticJsonDocument<100> doc;
SoftwareSerial mySerial(RX_PIN, TX_PIN);  // Tạo một đối tượng EspSoftwareSerial

const char* ssid = "Nummm";
const char* psswd = "21522735";

void setup() {
  Serial.begin(9600);    // Khởi tạo cổng nối tiếp cứng với tốc độ baud là 9600
  mySerial.begin(9600);  // Khởi tạo cổng nối tiếp mềm với tốc độ baud là 9600
  WiFi.begin(ssid, psswd);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected! IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  WiFiClient client;
  HTTPClient http;
  if (mySerial.available()) {
    // Đọc một dòng từ cổng nối tiếp ảo
    String line = mySerial.readStringUntil('\n');

    // Chuyển đổi chuỗi JSON thành đối tượng JsonDocument
    DeserializationError error = deserializeJson(doc, line);

    // Kiểm tra xem có lỗi nào trong quá trình chuyển đổi hay không
    if (error) {
      Serial.print("deserializeJson() failed: ");
      Serial.println(error.c_str());
      return;
    }
    // Lấy giá trị nhiệt độ và độ ẩm từ đối tượng JsonDocument
    float temperature = doc["temp"];
    float humidity = doc["humi"];
    float CO_concentration = doc["co"];
    float dustDensity = doc["dust"];

    // In các giá trị ra màn hình nối tiếp
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.println(" C");
    Serial.print("Humidity: ");
    Serial.print(humidity);
    Serial.println(" %");
    Serial.print("CO_concentration: ");
    Serial.println(CO_concentration);
    Serial.print("Dust Density:: ");
    Serial.println(dustDensity);
    Serial.println();
    http.begin(client, "http://nhhoang15.site/api/data");
    http.addHeader("Content-Type", "application/json");
    Serial.print("[HTTP] POST...\n");
    // int httpCode = http.POST("{\"temp\":" + String(temperature) + ",\"humi\":" + String(humidity) + ",\"co\":" + String(CO_concentration) + ",\"dust\":" + String(dustDensity) + "}");
    int httpCode = http.POST("{\"temp\":" + String(temperature) + ",\"humi\":" + String(humidity) + ",\"co\":" + String(CO_concentration) + ",\"dust\":" + String(dustDensity) + "}");
    if (httpCode > 0) {
      Serial.printf("[HTTP] POST... code: %d\n", httpCode);
      if (httpCode == HTTP_CODE_OK) {
        const String& payload = http.getString();
        Serial.print("received payload:");
        Serial.println(payload);
      }
    } else {
      Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
    }
    http.end();
  }
}