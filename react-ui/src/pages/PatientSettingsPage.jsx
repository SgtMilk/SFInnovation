import React from "react";

import { Divider, List, ListItem, Typography } from "@material-ui/core";

import SettingTextField from "../components/SettingTextField";
import Bridge from "../Bridge";
import { useRefresher } from "../Utilities";

export default function PatientSettingsPage() {
    const {
        BMI, GoodTemp, PtHt, PtWt,
        setBMI, setGoodTemp, setPtHt, setPtWt,
    } = Bridge;

    useRefresher(100);

    return (
        <div>
            <Typography variant="h5">Patient Settings</Typography>
            <Typography variant="subtitle1">Changes will be automatically saved for the duration of the session.</Typography>
            <Divider />
            <List dense>
                <ListItem>
                    <Typography variant="body1">Ideal lung temperature:</Typography>
                    &nbsp;&nbsp;&nbsp;
                    <SettingTextField
                        decimalPlaces={1}
                        description="Ideal lung temperature"
                        min={20}
                        max={40}
                        setter={setGoodTemp}
                        setting="GoodTemp"
                        unit="degrees Celsius"
                        value={GoodTemp}
                        width={156}
                    />
                </ListItem>
                <ListItem>
                    <Typography variant="body1">BMI:</Typography>
                    &nbsp;&nbsp;&nbsp;
                    <SettingTextField
                        decimalPlaces={1}
                        description="BMI"
                        min={20}
                        max={40}
                        setter={setBMI}
                        setting="BMI"
                        unit="kg/m^2"
                        value={BMI}
                        width={156}
                    />
                </ListItem>
                <ListItem>
                    <Typography variant="body1">Patient height:</Typography>
                    &nbsp;&nbsp;&nbsp;
                    <SettingTextField
                        decimalPlaces={1}
                        description="Patient height"
                        min={20}
                        max={40}
                        setter={setPtHt}
                        setting="PtHt"
                        unit="cm"
                        value={PtHt}
                        width={156}
                    />
                </ListItem>
                <ListItem>
                    <Typography variant="body1">Patient weight:</Typography>
                    &nbsp;&nbsp;&nbsp;
                    <SettingTextField
                        decimalPlaces={1}
                        description="Patient weight"
                        min={20}
                        max={40}
                        setter={setPtWt}
                        setting="PtWt"
                        unit="kg"
                        value={PtWt}
                        width={156}
                    />
                </ListItem>
            </List>
        </div>
    )
};