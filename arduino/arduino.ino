#include <Servo.h>
#include <LiquidCrystal.h>
#include <Wire.h>
#include <Adafruit_BMP280.h>
#include <Adafruit_BME280.h>
#include <Adafruit_Sensor.h>
#include <string.h>

//------------------------------------entities--------------------------------------------

//set up LCD (with pins)
LiquidCrystal lcd(8, 9, 10, 11, 12, 13);

//servo variables
Servo Regulator;
int regtime = 1000;
int Rval;
int Rangle;

Servo AirCompressor;
int potpinACClosed = 0;
int potpinACOpen = 1023;
int ACtime = 1000;
boolean ACopen;
int ACval;
int ACangle;

Servo O2;
int potpinO2Closed = 0;
int potpinO2Open = 1023;
int O2time = 1000;
boolean O2open;
int O2val;
int O2angle;

//O2 sensor [CURRENTLY MISSING]

//pressure chamber sensor
Adafruit_BME280 PCsensor;

//exhale sensor
Adafruit_BMP280 Esensor;

//------------------------------------variables----------------------------------------------

//regulator variables
int maxRegAngle = 107; //subject to change on the rotation capacity of regulator
int inhale = 0;
int closed = 53.5;
int exhale = 107;

//AirCompressor & O2 variables
int maxACAngle = 50; //subject to change on the rotation of needle valve
int maxO2Angle = 50;

//settings-variables (SUBJECT TO CHANGE BASED ON RPi)
double OkErrFiO2 = 5; //percentage
double FiO2margin = OkErrFiO2 / 100;
double OkErrIEP = 10; //percentage
double Pmargin = OkErrIEP / 100;
double OkErrTemp = 0.2; //degrees celsius
double HumMargBadTemp;
double HumMargGoodTemp;
double OkErrVE = 1500;
double tStart = millis();
double FiO2 = random(17, 23);
double Pexhale; //lungpress
double Pinhale; //lungpress
double Pchamber;
double FiO2f = 21;
double Pdesiredinhale = 103230; //called pexhale
double Pdesiredexhale = 103275; //called pinhale
double Hmax = 35;
double Hmin = 25;
double breathDuration;
double manualBreathDuration = 0;
double RR;
double VEtarget = 6500;
double VT;
double BattLevelWarn;
double Temperature;
double Humidity;
double O2TankP = 14061.4;
double VE;

//other variables
double FiO2fprev;
double intimef;
double extimef;
int L = 10;
boolean cancelledHumAlarm;
boolean cancelledHumWarn;
boolean cancelledPinWarn;
boolean cancelledPexWarn;
boolean cancelledO2inLowAlarm;
boolean cancelledBattLowWarn;
boolean cancelledSensorBrokenAlarm;

//----------------------------------setup(): starting entities-------------------------------------------

void setup()
{

  Regulator.attach(41);
  AirCompressor.attach(42);
  O2.attach(45);

  Serial.begin(115200);

  //commence LCD
  lcd.begin(16, 2);
  lcd.display();
  lcd.print("hello");
  delay(1000);

  //commence sensor BME280 at pressure chamber
  if (!PCsensor.begin(0x76))
  {
    Serial.println("Could not find a valid Pressure Chamber sensor, check wiring!");
  }

  //commence sensor BME280 at regulator cave
  if (!Esensor.begin(0x77))
  {
    Serial.println("Could not find a valid Exhale sensor, check wiring!");
  }

  //start regulator at closed

  buttonled();

  //start AC at closed
  {
    //default is closed
    AirCompressor.write(0);
    ACopen = false;
  }

  buttonled();

  //start O2 at max until FiO2 = 100
  {
    O2.write(maxO2Angle);
    O2open = 1;
  }

  buttonled();

  //Air compressor input opens, fan begins
  {
    AirCompressor.write(maxACAngle);
    ACopen = true;

    digitalWrite(53, HIGH); //open the motor
    digitalWrite(51, HIGH);
    digitalWrite(49, LOW);
    digitalWrite(47, LOW);
  }

  buttonled();

  //--------------------------------------------starting the breathing----------------------------------

  //first exhale
  {
    Regulator.write(0);
  }

  buttonled();

  Pexhale = hPaToCmH2O(Esensor.readPressure());

  while (Pexhale > Pdesiredexhale)
  {
    //test for the pressure, stop when it reaches the desired exhale
    mixture();
    delay(1000);
    Pexhale = hPaToCmH2O(Esensor.readPressure());
    lcd.print(Pexhale);
    Serial.println("LungPress|" + (String)Pexhale);
    buttonled();
  }

  //close O2 input
  O2.write(0);
  O2open = 0;

  buttonled();
}

//----------------------------------loop()------------------------------------------------------------
double timeAtStartofBreath;

void loop()
{

  //test all sensors
  int tempcount = 0;
  int Pexhalecount = 0;
  int Hcount = 0;
  int Pchambercount = 0;

  buttonled();

  //temperature
  for (int i = 0; i < L; i++)
  {
    double test = PCsensor.readTemperature();
    if (test == NULL)
    {
      tempcount++;
    }
  }
  if (tempcount == L)
  {
    cancelledSensorBrokenAlarm = false;
    Serial.println("SensorBrokenAlarm|1");

    digitalWrite(51, LOW);
    digitalWrite(49, LOW);
    digitalWrite(47, HIGH);
  }
  else
  {
    if (!cancelledSensorBrokenAlarm)
    {
      for (int i = 0; i < 10; i++)
      {
        Serial.println("SensorBrokenAlarm|0");
      }
      cancelledSensorBrokenAlarm = true;

      digitalWrite(51, HIGH);
      digitalWrite(49, LOW);
      digitalWrite(47, LOW);
    }
  }

  //pressure at exhale
  for (int i = 0; i < L; i++)
  {
    double test = Esensor.readPressure();
    if (test == NULL)
    {
      Pexhalecount++;
    }
  }
  if (Pexhalecount == L)
  {
    cancelledSensorBrokenAlarm = false;
    Serial.println("SensorBrokenAlarm|1");

    digitalWrite(51, LOW);
    digitalWrite(49, LOW);
    digitalWrite(47, HIGH);
  }
  else
  {
    if (!cancelledSensorBrokenAlarm)
    {
      for (int i = 0; i < 10; i++)
      {
        Serial.println("SensorBrokenAlarm|0");
      }
      cancelledSensorBrokenAlarm = true;

      digitalWrite(51, HIGH);
      digitalWrite(49, LOW);
      digitalWrite(47, LOW);
    }
  }

  //pressure at chamber
  for (int i = 0; i < L; i++)
  {
    double test = PCsensor.readPressure();
    if (test == NULL)
    {
      Pchambercount++;
    }
  }
  if (Pchambercount == L)
  {
    cancelledSensorBrokenAlarm = false;
    Serial.println("SensorBrokenAlarm|1");

    digitalWrite(51, LOW);
    digitalWrite(49, LOW);
    digitalWrite(47, HIGH);
  }
  else
  {
    if (!cancelledSensorBrokenAlarm)
    {
      for (int i = 0; i < 10; i++)
      {
        Serial.println("SensorBrokenAlarm|0");
      }
      cancelledSensorBrokenAlarm = true;

      digitalWrite(51, HIGH);
      digitalWrite(49, LOW);
      digitalWrite(47, LOW);
    }
  }

  //humidity
  for (int i = 0; i < L; i++)
  {
    double test = PCsensor.readHumidity();
    if (test == NULL)
    {
      Hcount++;
    }
  }
  if (Hcount == L)
  {
    cancelledSensorBrokenAlarm = false;
    Serial.println("SensorBrokenAlarm|1");

    digitalWrite(51, LOW);
    digitalWrite(49, LOW);
    digitalWrite(47, HIGH);
  }
  else
  {
    if (!cancelledSensorBrokenAlarm)
    {
      for (int i = 0; i < 10; i++)
      {
        Serial.println("SensorBrokenAlarm|0");
      }
      cancelledSensorBrokenAlarm = true;

      digitalWrite(51, HIGH);
      digitalWrite(49, LOW);
      digitalWrite(47, LOW);
    }
  }

  buttonled();

  timeAtStartofBreath = millis();

  Serial.println("loop here");

  FiO2fprev = FiO2f;

  Temperature = PCsensor.readTemperature();
  Humidity = PCsensor.readHumidity();

  Serial.println("Temp|" + (String)Temperature);
  Serial.println("Hum|" + (String)Humidity);

  //temp and humidity to be checked every breath
  if (Temperature > Temperature - 0.2 && Temperature < Temperature + 0.2)
  {
    if (Humidity > (Hmax - HumMargGoodTemp) || Humidity < (Hmin + HumMargGoodTemp))
    {
      if (Humidity < Hmax && Humidity > Hmin)
      {
        //print warning on ui
        lcd.print("Hum:");
        lcd.print((int)Humidity);
        lcd.println("Temp:");
        lcd.print((int)Temperature);

        cancelledHumWarn = false;
        Serial.println("HumWarn|1");

        digitalWrite(51, LOW);
        digitalWrite(49, LOW);
        digitalWrite(47, HIGH);

        if (!cancelledHumAlarm)
        {
          for (int i = 0; i < 10; i++)
          {
            Serial.println("HumAlarm|0");
          }
          cancelledHumAlarm = true;

          digitalWrite(51, HIGH);
          digitalWrite(49, LOW);
          digitalWrite(47, LOW);
        }
      }
      else
      {
        lcd.print("Hum:");
        lcd.print((int)Humidity);
        lcd.println("Temp:");
        lcd.print((int)Temperature);

        cancelledHumAlarm = false;
        Serial.println("HumAlarm|1");

        digitalWrite(51, LOW);
        digitalWrite(49, LOW);
        digitalWrite(47, HIGH);

        if (!cancelledHumWarn)
        {
          for (int i = 0; i < 10; i++)
          {
            Serial.println("HumWarn|0");
          }
          cancelledHumWarn = true;

          digitalWrite(51, HIGH);
          digitalWrite(49, LOW);
          digitalWrite(47, LOW);
        }
      }
    }
    else
    {
      lcd.print("Hum:");
      lcd.print((int)Humidity);
      lcd.println("Temp:");
      lcd.print((int)Temperature);
    }
  }
  else
  {
    if (Humidity > (Hmax - HumMargBadTemp) || Humidity < (Hmin - HumMargBadTemp))
    {
      if (Humidity < Hmax && Humidity > Hmin)
      {
        //print warning on ui
        lcd.print("Hum:");
        lcd.print((int)Humidity);
        lcd.println("Temp:");
        lcd.print((int)Temperature);

        cancelledHumWarn = false;
        Serial.println("HumWarn|1");

        digitalWrite(51, LOW);
        digitalWrite(49, LOW);
        digitalWrite(47, HIGH);

        if (!cancelledHumAlarm)
        {
          for (int i = 0; i < 10; i++)
          {
            Serial.println("HumAlarm|0");
          }
          cancelledHumAlarm = true;

          digitalWrite(51, HIGH);
          digitalWrite(49, LOW);
          digitalWrite(47, LOW);
        }
      }
      else
      {
        lcd.print("Hum:");
        lcd.print((int)Humidity);
        lcd.println("Temp:");
        lcd.print((int)Temperature);

        cancelledHumAlarm = false;
        Serial.println("HumAlarm|1");

        digitalWrite(51, LOW);
        digitalWrite(49, LOW);
        digitalWrite(47, HIGH);

        if (!cancelledHumWarn)
        {
          for (int i = 0; i < 10; i++)
          {
            Serial.println("HumWarn|0");
          }
          cancelledHumWarn = true;

          digitalWrite(51, HIGH);
          digitalWrite(49, LOW);
          digitalWrite(47, LOW);
        }
      }
    }
    else
    {
      lcd.print("Hum:");
      lcd.print((int)Humidity);
      lcd.println("Temp:");
      lcd.print((int)Temperature);
    }
  }

  buttonled();

  receiveData();
  OkErrFiO2 = interpretData("OkErrFiO2", OkErrFiO2); //percentage
  FiO2margin = OkErrFiO2 / 100;
  OkErrIEP = interpretData("OkErrIEP", OkErrIEP); //percentage
  Pmargin = OkErrIEP / 100;
  OkErrTemp = interpretData("OkErrTemp", OkErrTemp); //degrees celsius
  HumMargBadTemp = interpretData("HumMargBadTemp", OkErrTemp);
  HumMargGoodTemp = interpretData("HumMargBadTemp", OkErrTemp);
  OkErrVE = interpretData("OkErrVE", OkErrVE);
  FiO2f = interpretData("DesFiO2", FiO2f);
  Pdesiredinhale = interpretData("Pinhale", Pdesiredinhale); //called pexhale
  Hmax = interpretData("MaxHum", Hmax);
  Hmin = interpretData("MinHum", Hmin);
  manualBreathDuration = interpretData("RR", breathDuration);
  VT = interpretData("VT", VT);
  BattLevelWarn = interpretData("BattLevelWarn", BattLevelWarn);
  O2TankP = interpretData("O2TankP", O2TankP);

  buttonled();

  if (manualBreathDuration == 0)
  {

    //after exhale
    {
      Regulator.write(closed);
    }

    buttonled();

    //inhale
    {
      Regulator.write(inhale);
    }

    buttonled();

    double intimei = millis();

    Pinhale = hPaToCmH2O(Esensor.readPressure());
    while (Pinhale < Pdesiredinhale)
    {

      Pinhale = hPaToCmH2O(Esensor.readPressure());
      Serial.println("LungPress|" + (String)Pinhale);

      buttonled();
    }

    intimef = millis() - intimei;

    //after inhale
    {
      Regulator.write(closed);
    }

    buttonled();

    //exhale
    {
      Regulator.write(exhale);
    }

    double extimei = millis();

    Pexhale = hPaToCmH2O(Esensor.readPressure());
    while (Pexhale > Pdesiredexhale)
    {
      //test for the pressure, stop when it reaches the desired exhale
      mixture();
      Pexhale = hPaToCmH2O(Esensor.readPressure());
      Serial.println("LungPress|" + (String)Pexhale);

      buttonled();
    }

    extimef = millis() - intimei;

    breathDuration = millis() - timeAtStartofBreath;
    RR = 60 / breathDuration;

    VE = VT * RR;
    Serial.println("RR|" + (String)RR);

    buttonled();
  }
  else
  {
    double manualInhaleDuration = (intimef * manualBreathDuration) / breathDuration;
    double manualExhaleDuration = (extimef * manualBreathDuration) / breathDuration;
    double manualregtime = (regtime * manualBreathDuration) / breathDuration;

    buttonled();

    //after exhale
    {
      Regulator.write(closed);
    }

    buttonled();

    //inhale
    {
      Regulator.write(inhale);
    }

    buttonled();

    Pinhale = hPaToCmH2O(Esensor.readPressure());
    double intimeman = millis();
    double intimeman_helper = millis();
    while (intimeman < intimeman_helper + manualExhaleDuration)
    {

      Pinhale = hPaToCmH2O(Esensor.readPressure());
      Serial.println("LungPress|" + (String)Pinhale);
      intimeman = millis();

      buttonled();
    }

    //after inhale
    {
      Regulator.write(closed);
    }

    buttonled();

    //exhale
    {
      Regulator.write(exhale);
    }

    buttonled();

    Pexhale = hPaToCmH2O(Esensor.readPressure());
    double extimeman = millis();
    double extimeman_helper = millis();
    while (extimeman < extimeman_helper + manualExhaleDuration)
    {
      //test for the pressure, stop when it reaches the desired exhale
      mixture();
      Pexhale = hPaToCmH2O(Esensor.readPressure());
      Serial.println("LungPress|" + (String)Pexhale);
      extimeman = millis();

      buttonled();
    }

    VE = VT * manualBreathDuration;
    Serial.println("RR|" + (String)manualBreathDuration);
  }

  Serial.println("VT|" + (String)VT);
  Serial.println("VE|" + (String)VE);
}

//-------------------------------------------------------------------------mixture function----------------------------------------------------------------

void mixture()
{
  //check pressure of chamber
  Serial.println("enter mixture change");

  Pchamber = hPaToCmH2O(PCsensor.readPressure());

  Serial.println("Pchamber:" + (String)Pchamber);

  if (Pchamber > Pdesiredinhale || Pchamber < Pdesiredinhale - (Pmargin * Pdesiredinhale))
  {

    cancelledPinWarn = false;
    Serial.println("PinWarn|1");

    digitalWrite(51, LOW);
    digitalWrite(49, HIGH);
    digitalWrite(47, LOW);

    lcd.print("WARNING");
    Pchamber = Pinhale;
  }
  else
  {
    if (!cancelledPinWarn)
    {
      for (int i = 0; i < 10; i++)
      {
        Serial.println("PinWarn|0");
      }
      cancelledPinWarn = true;

      digitalWrite(51, HIGH);
      digitalWrite(49, LOW);
      digitalWrite(47, LOW);
    }
  }

  //simulate the FiO2 value
  FiO2 = random(19, 25);
  Serial.println("FiO2|" + (String)FiO2);

  if (Pchamber <= Pdesiredinhale + (Pmargin * Pdesiredinhale))
  {

    if (FiO2 >= FiO2f - FiO2margin)
    {

      if (ACopen == 0)
      {
        AirCompressor.write(maxACAngle);
        ACopen = 1;
      }

      if (O2open == 1)
      {
        O2.write(0);
        O2open = 0;
      }

      //AirCompressor.write(90);
      //O2.write(90);
    }

    if (FiO2 < FiO2f - FiO2margin)
    {

      if (ACopen == 0)
      {
        AirCompressor.write(maxACAngle);
        ACopen = 1;
      }

      if (O2open == 0)
      {
        O2.write(maxO2Angle);
        O2open = 1;
      }

      //AirCompressor.write(90);
      //O2.write(90);
    }
  }

  if (Pchamber > Pdesiredinhale + (Pmargin * Pdesiredinhale))
  {

    if (FiO2 >= FiO2f - FiO2margin)
    {

      if (ACopen == 1)
      {
        AirCompressor.write(0);
        ACopen = 0;
      }

      if (O2open == 1)
      {
        O2.write(0);
        O2open = 0;
      }

      //AirCompressor.write(90);
      //O2.write(90);
    }

    if (FiO2 < FiO2f - FiO2margin)
    {

      if (ACopen == 1)
      {
        AirCompressor.write(0);
        ACopen = 0;
      }

      if (O2open = 0)
      {
        O2.write(maxO2Angle);
        O2open = 1;
      }

      //AirCompressor.write(90);
      //O2.write(90);
    }
  }

  if (FiO2 < 18)
  {
    cancelledO2inLowAlarm = false;
    Serial.println("O2inLowAlarm|1");

    digitalWrite(51, LOW);
    digitalWrite(49, LOW);
    digitalWrite(47, HIGH);
  }
  else
  {

    if (!cancelledO2inLowAlarm)
    {
      for (int i = 0; i < 10; i++)
      {
        Serial.println("O2inLowAlarm|0");
      }
      cancelledO2inLowAlarm = true;

      digitalWrite(51, HIGH);
      digitalWrite(49, LOW);
      digitalWrite(47, LOW);
    }

    //blink sensor five times
    double FiO2_1 = 21;
    double FiO2_2 = 27;
    double FiO2_3 = 34;
    double FiO2_4 = 39;
    double FiO2_5 = 49;
    if (FiO2f > FiO2fprev)
    {
      if (FiO2_5 > FiO2_4 && FiO2_4 > FiO2_3 && FiO2_3 > FiO2_2 && FiO2_2 > FiO2_1)
      {
      }
      else
      {
        if (O2open == 1)
        {
          O2.write(0);
          O2open = 0;
        }

        delay(O2time);

        if (O2open = 0)
        {
          O2.write(maxO2Angle);
          O2open = 1;
        }

        delay(O2time);
      }
    }
    else if (FiO2f < FiO2fprev)
    {
      if (FiO2_5 < FiO2_4 && FiO2_4 < FiO2_3 && FiO2_3 < FiO2_2 && FiO2_2 < FiO2_1)
      {
      }
      else
      {
        if (O2open == 1)
        {
          O2.write(0);
          O2open = 0;
        }

        delay(O2time);

        if (ACopen == 0)
        {
          AirCompressor.write(maxACAngle);
          ACopen = 1;
        }

        delay(ACtime);
      }
    }
    else
    {
      //the sensor should fix itself if it shows weird values actually, scrap this alarm.
    }
  }
}

//----------------------------------------------------------------------converters--------------------------------------------------------------------------------

double hPaToCmH2O(double p)
{
  double pcmh2o = (1.0197442889221 * p) / 100;
  return pcmh2o;
}

//-----------------------------------------------------------------------receive and interpret data---------------------------------------------------------------------

const byte DATA_MAX_SIZE = 60;
char data[DATA_MAX_SIZE];

char *settingName = "none";
char *newValue = "none";

double interpretData(char *settingName, double current)
{
  char *readName;
  char *readValue;
  double decValue;
  for (int i = 0; i < sizeof(data); i++)
  {
    readName = strtok(data[i], "|");
    readValue = strtok(NULL, "|");
    if (readName == settingName)
    {
      decValue = strtod(readValue, NULL);
      return decValue;
    }
  }

  return current;
}

void receiveData()
{
  static char endMarker = '\n';
  char receivedChar;
  int ndx = 0;

  memset(data, 32, sizeof(data));

  while (Serial.available() > 0)
  {
    receivedChar = Serial.read();
    if (receivedChar == endMarker)
    {
      data[ndx] = '\0';
      settingName = strtok(data, "|");
      newValue = strtok(NULL, "|");

      //interpretData();
      receiveData();
      return;
    }

    data[ndx] = receivedChar;
    ndx++;

    if (ndx >= DATA_MAX_SIZE)
      break;
  }
}

void buttonled()
{

  if (digitalRead(7) == HIGH)
  {
    Pdesiredinhale += 1;
  }
  if (digitalRead(6) == HIGH)
  {
    Pdesiredinhale -= 1;
  }
  if (digitalRead(5) == HIGH)
  {
    if (FiO2f == 21)
    {
      FiO2f += 9;
    }
    else if (FiO2f == 100)
    {
    }
    else
      FiO2f += 10;
  }
  if (digitalRead(4) == HIGH)
  {
    if (FiO2f == 21)
    {
    }
    else if (FiO2f == 30)
    {
      FiO2f -= 9;
    }
    else
      FiO2f -= 10;
  }
}
