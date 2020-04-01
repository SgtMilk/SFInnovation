# SFVentilator

The code for an open-source ventilator created by 20 young innovators in Montreal. We came together to try to help develop a more affordable product during the COVID-19 crisis. The project uses an Arduino to manage and analyze the physical aspects of the device, and a Raspberry Pi with a touch screen for user interaction.

## The Arduino

The project uses an Arduino Mega 2560 rev. 3. If you are using a PCB, you'll probably need to remap the ports. If you are using continuous rotational servos, the code will also need some modification to accomodate that. If you are not using BMP280s or BME280s, you may also need to change your code and use different libraries.

Libraries needed:
- `Adafruit_BMP280.h`
- `Adafruit_BME280.h`
- `Adafruit_Sensor.h`

## The Raspberry Pi

The RPi is connected to the Arduino over a simple USB serial connection. It runs a React web app in Google Chrome's fullscreen kiosk mode. A Node.js server acts as the middleman between the two devices, transmitting data between them and storing any persistent data on disk.

Note that the cursor is hidden in the web app. It should be run in Developer Tool's device mode, with resolution set to 1280 x 800.

#### Prerequisites

Update your computer:
```
$ sudo apt update
$ sudo apt -y upgrade
```

Install packages needed to build Node.js packages:
```
$ sudo apt -y install git gcc g++ make
```

Install Node.js (which comes with NPM) and the Yarn package manager:
```
$ curl -sL https://deb.nodesource.com/setup_12.x | sudo bash -
$ curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
$ sudo apt update
$ sudo apt -y install nodejs yarn
```

#### Downloading the repository

The code should be installed in user `pi`'s home directory:
```
$ cd ~
$ git clone https://github.com/ilangleben19/SFVentilator.git
```

#### Installing the Node.js server

```
$ cd ~/SFVentilator/backend
$ npm i
```

#### Installing the React frontend

````
$ cd ~/SFVentilator/react-ui
$ yarn install
$ yarn build
````

#### Registering the webapp to open on startup
CAREFUL - This step is optional and should only be done on an actual Raspberry Pi for production!

````
$ sudo echo "@lxterminal -e node /home/pi/SFVentilator/backend/index.js" >> /etc/xdg/lxsession/LXDE-pi/autostart
````

And just reboot and you're done! The Node.js server will automatically start the React app in a fullscreen browser.