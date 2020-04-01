import React from "react";

import { Divider, List, ListItem, Typography } from "@material-ui/core";

import SettingTextField from "../components/SettingTextField";
import Bridge from "../Bridge";
import { useRefresher } from "../Utilities";

export default function GeneralSettingsPage() {
    const {
        BattLevelWarn, ChamberThresh, GoodTemp, HumMargBadTemp, HumMargGoodTemp, MaxHum, MinHum,
        O2TankConc, O2TankP, OkErrFiO2, OkErrTemp, OkErrIEP, OkErrVE,
        setBattLevelWarn, setChamberThresh, setGoodTemp, setHumMargBadTemp, setHumMargGoodTemp, setMaxHum,
        setMinHum, setO2TankConc, setO2TankP, setOkErrFiO2, setOkErrTemp, setOkErrIEP, setOkErrVE,
    } = Bridge;

    useRefresher(100);

    return (
        <div>
            <Typography variant="h5">General Settings</Typography>
            <Typography variant="subtitle1">Changes will automatically be saved and stored for future session.</Typography>
            <Divider />
            <List dense>
                <ListItem><Typography variant="h6">Battery</Typography></ListItem>
                <ListItem>
                    <Typography variant="body1">Warning battery level:</Typography>
                    &nbsp;&nbsp;&nbsp;
                    <SettingTextField
                        decimalPlaces={1}
                        description="Warning battery level"
                        min={20}
                        max={40}
                        setter={setBattLevelWarn}
                        setting="BattLevelWarn"
                        unit="percentage"
                        value={BattLevelWarn}
                        width={180}
                    />
                </ListItem>
                <Divider />
                <ListItem><Typography variant="h6">Breathing</Typography></ListItem>
                <ListItem>
                    <Typography variant="body1">Allowable error range for minute ventilation:</Typography>
                    &nbsp;&nbsp;&nbsp;
                    <SettingTextField
                        decimalPlaces={1}
                        description="Allowable error range for minute ventilation"
                        min={20}
                        max={40}
                        setter={setOkErrVE}
                        setting="OkErrVE"
                        unit="L/min"
                        value={OkErrVE}
                        width={180}
                    />
                </ListItem>
                <Divider />
                <ListItem><Typography variant="h6">Temperature</Typography></ListItem>
                <ListItem>
                    <Typography variant="body1">Target temperature:</Typography>&nbsp;&nbsp;&nbsp;
                    <SettingTextField
                        decimalPlaces={1}
                        description="Target temperature"
                        min={20}
                        max={40}
                        setter={setGoodTemp}
                        setting="GoodTemp"
                        unit="degrees Celsius"
                        value={GoodTemp}
                        width={120}
                    />
                </ListItem>
                <ListItem>
                    <Typography variant="body1">Acceptable temperature range:</Typography>&nbsp;&nbsp;&nbsp;
                    <SettingTextField
                        decimalPlaces={1}
                        description="Acceptable temperature range"
                        min={20}
                        max={40}
                        setter={setOkErrTemp}
                        setting="OkErrTemp"
                        unit="degrees Celsius"
                        value={OkErrTemp}
                        width={120}
                    />
                </ListItem>
                <Divider />
                <ListItem><Typography variant="h6">Humidity</Typography></ListItem>
                <ListItem>
                    <Typography variant="body1">Acceptable humidity range:</Typography>&nbsp;&nbsp;&nbsp;

                    <SettingTextField
                        decimalPlaces={0}
                        description="Minimum acceptable humidity"
                        min={20}
                        max={Math.min(MaxHum, 40)}
                        setter={setMinHum}
                        setting="Min"
                        unit="percentage"
                        value={MinHum}
                    />
                    &nbsp;-&nbsp;
                    <SettingTextField
                        decimalPlaces={0}
                        description="Maximum acceptable humidity"
                        min={Math.max(MinHum, 20)}
                        max={40}
                        setter={setMaxHum}
                        setting="Max"
                        unit="percentage"
                        value={MaxHum}
                    />
                </ListItem>
                <ListItem>
                    We will warn you when the humidity is near the limit of its acceptable range,
                    and sound an alarm when it's no longer within its acceptable range.
                    The next pair of settings let you choose HOW NEAR the limit we should warn you.
                    For example, were you to set a "nearness range" setting to 3%, and were the minimum acceptable humidity 25%,
                    we would warn you when humidity is between 28%-25%, and sound an alarm when it dips below 25%.
                    <br /><br />
                    We've provided two settings - a nearness range for when temperature is within its target range,
                    and a nearness range for when temperature is not within its target range.
                    This is in case you feel humidity is less critical when temperature is out of range,
                    and you feel you'd like to make the humidity warning more lenient.
                </ListItem>
                <ListItem>
                    <Typography variant="body1">
                        Nearness range for humidity if temperature is <u>within</u> range:
                    </Typography>&nbsp;&nbsp;&nbsp;
                    <SettingTextField
                        decimalPlaces={1}
                        description="Nearness range if temperature is within its limits"
                        min={20}
                        max={40}
                        setter={setHumMargGoodTemp}
                        setting="Range"
                        unit="percentage"
                        value={HumMargGoodTemp}
                    />
                </ListItem>
                <ListItem>
                    <Typography variant="body1">
                        Nearness range for humidity if temperature is <u>not within</u> range:
                    </Typography>&nbsp;&nbsp;&nbsp;
                    <SettingTextField
                        decimalPlaces={1}
                        description="Nearness range if temperature is NOT within its limits"
                        min={20}
                        max={40}
                        setter={setHumMargBadTemp}
                        setting="Range"
                        unit="percentage"
                        value={HumMargBadTemp}
                    />
                </ListItem>
                <Divider />
                <ListItem><Typography variant="h6">O<sub>2</sub> Tank</Typography></ListItem>
                <ListItem>
                    <Typography variant="body1">
                        O<sub>2</sub> tank concentration:
                    </Typography>&nbsp;&nbsp;&nbsp;
                    <SettingTextField
                        decimalPlaces={1}
                        description="O2 tank concentration"
                        min={0}
                        max={100}
                        step={0.1}
                        setter={setO2TankConc}
                        setting="[O2]"
                        unit="percentage"
                        value={O2TankConc}
                    />
                </ListItem>
                <ListItem>
                    <Typography variant="body1">
                        O<sub>2</sub> tank pressure:
                    </Typography>&nbsp;&nbsp;&nbsp;
                    <SettingTextField
                        decimalPlaces={1}
                        description="O2 tank pressure"
                        min={0}
                        max={100}
                        step={0.1}
                        setter={setO2TankP}
                        setting="[O2]"
                        unit="cmH2O"
                        value={O2TankP}
                        width={130}
                    />
                </ListItem>


                <Divider />
                <ListItem><Typography variant="h6">Pressure and FiO<sub>2</sub></Typography></ListItem>
                <ListItem>
                    <Typography variant="body1">
                        Allowable deviation for FiO<sub>2</sub>:
                    </Typography>&nbsp;&nbsp;&nbsp;
                    <SettingTextField
                        decimalPlaces={1}
                        description="Allowable deviation for FiO2"
                        min={0}
                        max={100}
                        step={0.1}
                        setter={setOkErrFiO2}
                        setting="OkErrFiO2"
                        unit="percentage"
                        value={OkErrFiO2}
                        width={130}
                    />
                </ListItem>
                <ListItem>
                    <Typography variant="body1">
                        Allowable deviation for inhale and exhale pressures:
                    </Typography>&nbsp;&nbsp;&nbsp;
                    <SettingTextField
                        decimalPlaces={1}
                        description="Allowable deviation for inhale and exhale pressures"
                        min={0}
                        max={100}
                        step={0.1}
                        setter={setOkErrIEP}
                        setting="OkErrIEP"
                        unit="percentage"
                        value={OkErrIEP}
                    />
                </ListItem>
                <ListItem>
                    <Typography variant="body1">
                        Pressure threshold for the pressure chamber:
                    </Typography>&nbsp;&nbsp;&nbsp;
                    <SettingTextField
                        decimalPlaces={1}
                        description="Pressure threshold for the pressure chamber"
                        min={0}
                        max={100}
                        step={0.1}
                        setter={setChamberThresh}
                        setting="ChamberThresh"
                        unit="cmH2O relative to 1atm"
                        value={ChamberThresh}
                        width={330}
                    />
                </ListItem>
            </List>
        </div>
    )
};