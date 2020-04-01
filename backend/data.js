const fs = require('fs');

const csv = require('./csv');

const unsureMessage = (name, value) => console.log(`[ARD] Unsure how to process data with name "${name}" and value ${value}`);

const nexts = {
    toArduino: (n, v, sendToArduino) => sendToArduino(n, v),
    toReact: (n, v, socket) => socket.emit(n, v),
};

async function mutateNoCollect(name, value, direction, extra) {
    if (data.hasOwnProperty(name)) {
        try {
            data[name] = value;
            csv.addToCsv(name, value, Date.now(), direction);
            nexts[direction](name, value, extra);
        } catch (e) { console.log(e); }
    } else
        unsureMessage(name, value);
}

async function mutateCollect(name, value, direction, extra) {
    if (data.hasOwnProperty(name)) {
        let timestamp = Date.now();
        let nextDatum = { value, timestamp, };

        data[name] = [...data[name], nextDatum];
        csv.addToCsv(name, value, timestamp, direction);
        nexts[direction](name, nextDatum, extra);
    } else
        unsureMessage(name, value);
}

const noCollect = [
    'BattLowWarn', 'Hum', 'HumAlarm', 'HumWarn', 'Pexhale', 'PexWarn',
    'Pinhale', 'PinWarn', 'O2inLowAlarm', 'SensorBrokenAlarm', 'VE', 'Temp',
];
const collect = ["FiO2", "LungPress"];

let tempStorage = {};
async function arduinoReceiver(data) {
    let [name, value] = data.split('|');

    if (noCollect.includes(name))
        tempStorage[name] = parseFloat(value);
    else if (collect.includes(name)) {
        if (!tempStorage.hasOwnProperty(name))
            tempStorage[name] = [];
        tempStorage[name] = [...tempStorage[name], parseFloat(value)];
    } else
        unsureMessage(name, value);
}

async function setUpPipe(socket) {
    setInterval(() => {
        Object.entries(tempStorage).forEach(([name, value]) => {
            if (noCollect.includes(name))
                mutateNoCollect(name, value, 'toReact', socket);
            else if (collect.includes(name))
                mutateCollect(name, value.reduce((acc, next) => next / value.length + acc, 0), 'toReact', socket);
            else
                unsureMessage(name, value);
        });
        tempStorage = {};
    }, 200);
}

async function reactReceiver(socket, sendToArduino) {
    // NON-PERSISTENT/PATIENT-SPECIFIC SETTINGS
    ['BMI', 'DesFiO2', 'RR', 'Pexhale', 'Pinhale', 'PtHt', 'PtWt', 'VT',].forEach(
        name => socket.on(name, value => {
            console.log(`[REACT] Received ${name}|${value}`);
            mutateNoCollect(name, parseFloat(value), "toArduino", sendToArduino);
        })
    );

    // PERSISTENT/GENERAL SETTINGS
    let configFileName = fs.existsSync('./config.json') ? './config.json' : '/home/pi/SFVentilator/backend/config.json';
    let savedConfig = JSON.parse(fs.readFileSync(configFileName));
    ['BattLevelWarn', 'ChamberThresh', 'GoodTemp', 'HumMargBadTemp', 'HumMargGoodTemp',
        'MaxHum', 'MinHum', 'O2TankConc', 'O2TankP',
        'OkErrFiO2', 'OkErrIEP', 'OkErrTemp', 'OkErrVE',].forEach(name => {
            mutateNoCollect(name, parseFloat(savedConfig[name]), "toReact", socket);
            mutateNoCollect(name, parseFloat(savedConfig[name]), "toArduino", sendToArduino);

            socket.on(name, value => {
                console.log(`[REACT] Received ${name}|${value}`);
                mutateNoCollect(name, parseFloat(value), "toArduino", sendToArduino);

                fs.readFile(configFileName, (_, data) => {
                    let currentConfig = JSON.parse(data);
                    currentConfig[name] = parseFloat(value);
                    fs.writeFile(configFileName, JSON.stringify(currentConfig), () => { });
                });
            });
        });
}

const makeCollectableValue = () => [{
    value: 0,
    timestamp: Date.now(),
}];

const data = {
    arduinoReceiver,
    BattLevelWarn: 0,
    BattLowWarn: 0,
    BMI: 0,
    ChamberThresh: 0,
    DesFiO2: 21,
    FiO2: makeCollectableValue(),
    GoodTemp: 37,
    Hum: 0,
    HumAlarm: 0,
    HumWarn: 0,
    HumMargBadTemp: 0,
    HumMargGoodTemp: 0,
    MaxHum: 0,
    MinHum: 0,
    O2TankConc: 0,
    O2TankP: 14061.4,
    OkErrFiO2: 0,
    OkErrIEP: 0,
    OkErrTemp: 0,
    OkErrVE: 0,
    LungPress: makeCollectableValue(),
    Pexhale: 0,
    PexWarn: 0,
    Pinhale: 0,
    PinWarn: 0,
    PtHt: 0,
    PtWt: 0,
    reactReceiver,
    O2inLowAlarm: 0,
    RR: 0,
    setUpPipe,
    SensorBrokenAlarm: 0,
    Temp: 0,
    VT: 0,
    VE: 0,
};

module.exports = data;