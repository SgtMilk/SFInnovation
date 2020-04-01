import { useEffect } from "react";

import socketIOClient from "socket.io-client";

import { sortInPlace } from './Utilities';
import alarms from './alarms';

export function makePointAdder(maxPointCount, name) {
    return point => Bridge[name] = sortInPlace([...Bridge[name].slice(Math.max(0, Bridge[name].length - maxPointCount)), point]);
};

export function makeSetter(name, socket) {
    return value => {
        let oldStatus = Bridge.status;
        Bridge.status = `Status: Updating setting ${name}...`;
        Bridge[name] = value;
        socket.emit(name, value);
        Bridge.status = oldStatus;
    };
};

const makeCollectableValue = () => [{
    value: 0,
    timestamp: Date.now(),
}];

export function useBridge() {
    useEffect(() => {
        const socket = socketIOClient("http://127.0.0.1:4001");
        socket.on('connect_error', () => console.log("Failed to connect to socket.io"));
        socket.on('connect', () => {
            console.log("Connected to socket.io");
            Bridge.status = `Status: Connected.`;
        });
        socket.on('disconnect', () => {
            console.log("Socket.io disconnected");
            Bridge.status = `Status: Connecting...`;
        });

        // nonCollect backend -> React
        ['Hum', 'HumMargBadTemp', 'HumMargGoodTemp', 'MaxHum', 'MinHum',
            'Pexhale', 'Pinhale', 'VE', 'Temp',].forEach(name => socket.on(name, value => Bridge[name] = value));

        // collect backend -> React
        ['FiO2', 'LungPress',].forEach(name => socket.on(name, makePointAdder(200, name)));

        // alarm backend -> React
        ['BattLowWarn', 'HumAlarm', 'HumWarn', 'PexWarn', 'PinWarn', 'O2inLowAlarm', 'SensorBrokenAlarm'].forEach(name =>
            socket.on(name, data => {
                let alarmDialogData = alarms[name].dialogData;
                let next = !!data;

                if (next && !Bridge[name])
                    Bridge.alarmDialog = {
                        ...alarmDialogData,
                        open: true,
                        setOpen: open => Bridge.alarmDialog.open = open,
                    };
                else if (!next && Bridge[name]
                    && alarmDialogData.description === Bridge.alarmDialog.description
                    && alarmDialogData.severity === Bridge.alarmDialog.severity)
                    Bridge.alarmDialog.open = false;

                Bridge[name] = next;
            })
        );

        // nonCollect React -> backend
        ['BMI', 'BattLevelWarn', 'ChamberThresh', 'DesFiO2', 'GoodTemp', 'HumMargBadTemp', 'HumMargGoodTemp',
            'MaxHum', 'MinHum', 'OkErrIEP', 'OkErrFiO2', 'OkErrTemp', 'OkErrVE', 'O2TankConc', 'O2TankP',
            'RR', 'Pexhale', 'Pinhale', 'PtHt', 'PtWt', 'VT',].forEach(name => Bridge['set' + name] = makeSetter(name, socket));
    }, []);
};

export const Bridge = {
    alarmDialog: { open: false },
    alarms,
    ChamberThresh: 0,
    BattLevelWarn: 0,
    BattLowWarn: false,
    BMI: 0,
    DesFiO2: 21,
    FiO2: makeCollectableValue(),
    GoodTemp: 37,
    Hum: 0,
    HumAlarm: false,
    HumWarn: false,
    HumMargBadTemp: 0,
    HumMargGoodTemp: 0,
    MaxHum: 30,
    MinHum: 30,
    O2TankConc: 0,
    OkErrIEP: 0,
    O2TankP: 0,
    OkErrFiO2: 0,
    OkErrTemp: 0,
    OkErrVE: 0,
    LungPress: makeCollectableValue(),
    makePointAdder,
    Pexhale: 0,
    PexWarn: false,
    Pinhale: 0,
    PinWarn: false,
    PtHt: 0,
    PtWt: 0,
    O2inLowAlarm: false,
    RR: 0,
    status: "Status: Connecting...",
    SensorBrokenAlarm: false,
    Temp: 0,
    VE: 0,
    VT: 0,
    useBridge,
};

export default Bridge;