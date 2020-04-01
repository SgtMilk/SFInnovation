const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const data = require('./data');

async function getArduinoPort() {
    const ports = await SerialPort.list();
    for (const port of ports) {
        const pm = port.manufacturer;
        if (typeof pm !== 'undefined' && pm.includes('arduino')) {
            return port.comName.toString();
        }
    };
    return null;
}

async function setupArduino(socket) {
    const portName = await getArduinoPort();
    const port = new SerialPort(portName, { baudRate: 115200 });
    const parser = port.pipe(new Readline({ delimeter: '\n' }));

    const sendToArduino = (name, value) => {
        port.write(`${name}|${value}\n`);
        console.log(`[ARD] Sending ${name}|${value}`);
    };

    port.on('open', () => {
        console.log('[ARD] Connected to Arduino via serial port');
        globals.tStart = Date.now();
        data.setUpPipe(socket);
    });
    port.on('close', () => console.log('[ARD] Disconnected from Arduino'));
    port.on('error', error => {
        console.log(error);
        console.log('[ARD] Error thrown from Arduino serial port');
    });

    parser.on('data', data.arduinoReceiver);


    data.setUpPipe(socket);
    data.reactReceiver(socket, sendToArduino);
}

module.exports = setupArduino;