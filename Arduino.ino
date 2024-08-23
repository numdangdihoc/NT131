#include "DHT.h"
#include <SoftwareSerial.h>
#include <ArduinoJson.h>
#include <MQUnifiedsensor.h>

#define DHTPIN 4
#define DHTTYPE DHT22

#define Board ("Arduino UNO")
#define Pin (A1)  //Analog input 1 of arduino
/***********************Software Related Macros************************************/
#define Type ("MQ-2")  //MQ2
#define Voltage_Resolution (5)
#define ADC_Bit_Resolution (10)  // For arduino UNO/MEGA/NANO
#define RatioMQ2CleanAir (9.83)  //RS / R0 = 9.83 ppm

int measurePin = A0;
int ledPower = 2;

int samplingTime = 280;
int deltaTime = 40;
int sleepTime = 9680;

float voMeasured = 0;
float calcVoltage = 0;
float dustDensity = 0;

#define RX_PIN 10  // Chân RX của cổng nối tiếp mềm
#define TX_PIN 11  // Chân TX của cổng nối tiếp mềm

SoftwareSerial mySerial(RX_PIN, TX_PIN);  // Tạo một đối tượng cổng nối tiếp mềm
DHT dht(DHTPIN, DHTTYPE);
MQUnifiedsensor MQ2(Board, Voltage_Resolution, ADC_Bit_Resolution, Pin, Type);
StaticJsonDocument<100> doc;
void setup() {
  Serial.begin(9600);
  Serial.println(F("DHT22 test!"));
  mySerial.begin(9600);  // Khởi tạo cổng nối tiếp mềm với tốc độ baud là 9600
  dht.begin();
  MQ2.setRegressionMethod(1);  //_PPM =  a*ratio^b
  MQ2.setA(36974);
  MQ2.setB(-3.109);  //
  MQ2.init();
  float calcR0 = 0;
  for (int i = 1; i <= 10; i++) {
    MQ2.update();  // Update data, the arduino will read the voltage from the analog pin
    calcR0 += MQ2.calibrate(RatioMQ2CleanAir);
    Serial.print(".");
  }
  MQ2.setR0(calcR0 / 10);
  Serial.println("  done!.");

  if (isinf(calcR0)) {
    Serial.println("Warning: Conection issue, R0 is infinite (Open circuit detected) please check your wiring and supply");
    while (1)
      ;
  }
  if (calcR0 == 0) {
    Serial.println("Warning: Conection issue found, R0 is zero (Analog pin shorts to ground) please check your wiring and supply");
    while (1)
      ;
  }
  /*****************************  MQ CAlibration ********************************************/

  MQ2.serialDebug(true);
  pinMode(ledPower, OUTPUT);
}

void loop() {
  delay(2000);
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  if (isnan(h) || isnan(t)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }
  MQ2.update();  // Update data, the arduino will read the voltage from the analog pin
  float CO_concentration = MQ2.readSensor();
  digitalWrite(ledPower, LOW);          // Bật IR LED
  delayMicroseconds(samplingTime);      //Delay 0.28ms
  voMeasured = analogRead(measurePin);  // Đọc giá trị ADC V0
  delayMicroseconds(deltaTime);         //Delay 0.04ms
  digitalWrite(ledPower, HIGH);         // Tắt LED
  delayMicroseconds(sleepTime);         //Delay 9.68ms

  // Tính điện áp từ giá trị ADC
  calcVoltage = voMeasured * (5.0 / 1024);  //Điệp áp Vcc của cảm biến (5.0 hoặc 3.3)
  dustDensity = 170 * calcVoltage - 0.1;
  Serial.print("Dust Density: ");
  Serial.println(dustDensity);
  Serial.print("CO_concentration: ");
  Serial.println(CO_concentration);
  Serial.print(F("Humidity: "));
  Serial.print(h);
  Serial.println(F("%  "));
  Serial.print(F("Temperature: "));
  Serial.print(t);
  Serial.print(F("°C "));
  doc["temp"] = t;
  doc["humi"] = h;
  doc["co"] = CO_concentration;
  doc["dust"] = dustDensity;
  serializeJson(doc, mySerial);
  mySerial.println();
  serializeJson(doc, Serial);
  Serial.println();
  delay(1000);
}
