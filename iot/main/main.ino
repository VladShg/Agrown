#include <DS1302.h>



bool state_flight = false;
int state = HIGH;           // the current state of the output pin
int reading;                // the current reading from the input pin
int previous = LOW;         // the previous reading from the input pin

unsigned long time = 0;           // the last time the output pin was toggled
unsigned long debounce = 200;   // the debounce time, increase if the output flickers

int flight_id = 1;
int respin = A5; // sensor pin used
bool flight_active = false;
bool begin = true;
String start_time1 = "";
String start_time2 = "";
int level_start = 0;
String end_time1 = "";
String end_time2 = "";
int level_end = 0;
String separator = "/";
const int max_level = 700;

DS1302 rtc(5, 6, 7);

void setup()
{
  rtc.halt(false);
  rtc.writeProtect(false);
  pinMode(8,  INPUT);
  pinMode(10, OUTPUT);
  pinMode(12, OUTPUT);
  Serial.begin(9600);
}

void loop()
{
  int reading = digitalRead(8);
  int resval = analogRead(respin);

  if (reading == HIGH && previous == LOW && millis() - time > debounce)
  {
    if (state_flight == HIGH) {
      end_time1 = rtc.getDateStr();
      end_time2 = rtc.getTimeStr();
      level_end = resval;
      if (begin == false) {
        Serial.println(start_time1 + separator + start_time2 + separator +
                       end_time1 + separator + end_time2 + separator +
                       level_start + separator + level_end + separator + flight_id);
      }
      state_flight = LOW;
    } else {
      state_flight = HIGH;
      begin = false;
      start_time1 = rtc.getDateStr();
      start_time2 = rtc.getTimeStr();
      level_start = resval;
    }

    time = millis();
  }
  previous = reading;
  if (state_flight == true) {
    digitalWrite(12, LOW);
    digitalWrite(10, HIGH);
  } else {
    digitalWrite(12, HIGH);
    digitalWrite(10, LOW);
  }
  
  
}
