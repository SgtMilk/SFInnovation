import React from 'react';

import { Typography } from "@material-ui/core";
import WarningIcon from "@material-ui/icons/Warning";

const alarms = {
    HumAlarm: {
        component: (classes, Bridge) => <div className={classes.alarmComponentContainer}>
            <WarningIcon className={classes.errorIcon} />
            <Typography variant="h6" component="span">ERROR: Humidity</Typography>
            <Typography variant="body1" component="div">
                Humidity is outside of the acceptable range.
                The patient is in danger of pneumonia and lung damage.
                <br /><br />
                <b>Recommended action:</b> Replace the HME (heat and moisture exchanger)
                as it may be defective or broken.
            </Typography>
        </div>,
        dialogData: {
            children: <>
                Humidity is outside of the acceptable range.
                Press the bell icon at the top for more information.
            </>,
            description: 'Humidity',
            severity: 'error',
        },
    },
    O2inLowAlarm: {
        component: (classes, Bridge) => <div className={classes.alarmComponentContainer}>
            <WarningIcon className={classes.errorIcon} />
            <Typography variant="h6" component="span">ERROR: Inhalation oxygen levels low</Typography>
            <Typography variant="body1" component="div">
                There is not enough oxygen in the pressure chamber to meet inhalation requirements.
                The patient may also be rebreathing the air in the pressure chamber.
                <br /><br />
                <b>Recommended action:</b> Please check the valves and the level of consciousness of the patient.
            </Typography>
        </div>,
        dialogData: {
            children: <>
                There is not enough oxygen in the pressure chamber to meet inhalation requirements.
                Press the bell icon at the top for more information.
            </>,
            description: 'Inhalation oxygen levels low',
            severity: 'error',
        },
    },
    SensorBrokenAlarm: {
        component: (classes, Bridge) => <div className={classes.alarmComponentContainer}>
            <WarningIcon className={classes.errorIcon} />
            <Typography variant="h6" component="span">ERROR: Blocked valve</Typography>
            <Typography variant="body1" component="div">
                A valve is blocked somewhere in the ventilator.
                <br /><br />
                <b>Recommended action:</b> Commence manual ventilation immediately.
        </Typography>
        </div>,
        dialogData: {
            children: <>
                A valve is blocked somewhere in the ventilator.
                Commence manual ventilation immediately.
            </>,
            description: 'Blocked valve',
            severity: 'error',
        },
    },
    BattLow: {
        component: (classes, Bridge) => <div className={classes.alarmComponentContainer}>
            <WarningIcon className={classes.warningIcon} />
            <Typography variant="h6" component="span">WARNING: Low Battery</Typography>
            <Typography variant="body1" component="div">
                The battery is low.
                <br /><br />
                <b>Recommended action:</b> Either plug it in, swap out the battery, or prepare a different ventilator.
            </Typography>
        </div>,
        dialogData: {
            children: <>
                The battery is low.
                Press the bell icon at the top for more information.
            </>,
            description: 'Low battery',
            severity: 'warning',
        },
    },
    HumWarn: {
        component: (classes, Bridge) => <div className={classes.alarmComponentContainer}>
            <WarningIcon className={classes.warningIcon} />
            <Typography variant="h6" component="span">WARNING: Humidity</Typography>
            <Typography variant="body1" component="div">
                Humidity is in the warning zone and approaching its acceptable limit.
                <br /><br />
                <b>Recommended action:</b> You may need to replace the HME (heat and moisture exchanger)
                if it is defective or broken.
            </Typography>
        </div>,
        dialogData: {
            children: <>
                Humidity approaching the limit of its acceptable range.
                Press the bell icon at the top for more information.
            </>,
            description: 'Humidity',
            severity: 'warning',
        },
    },
    PexWarn: {
        component: (classes, Bridge) => <div className={classes.alarmComponentContainer}>
            <WarningIcon className={classes.warningIcon} />
            <Typography variant="h6" component="span">WARNING: P<sub>ex</sub></Typography>
            <Typography variant="body1" component="div">
                The pressure inside the exhalation tube is outside its acceptable range.
                This may signify ???
                <br /><br />
                <b>Recommended action:</b> ???
            </Typography>
        </div>,
        dialogData: {
            children: <>
                The pressure inside the exhalation tube is outside its acceptable range.
                Press the bell icon at the top for more information.
            </>,
            description: 'Exhalation tube pressure',
            severity: 'warning',
        },
    },
    PinWarn: {
        component: (classes, Bridge) => <div className={classes.alarmComponentContainer}>
            <WarningIcon className={classes.warningIcon} />
            <Typography variant="h6" component="span">WARNING: P<sub>in</sub></Typography>
            <Typography variant="body1" component="div">
                The pressure inside the inhalation tube is outside its acceptable range.
                This may signify ???
                <br /><br />
                <b>Recommended action:</b> ???
            </Typography>
        </div>,
        dialogData: {
            children: <>
                The pressure inside the inhalation tube is outside its acceptable range.
                Press the bell icon at the top for more information.
            </>,
            description: 'Inhalation tube pressure',
            severity: 'warning',
        },
    },
};

export default alarms;