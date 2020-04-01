import React, { useState } from "react";
import PropTypes from 'prop-types';

import { TextField, } from "@material-ui/core";

import SettingDialog from "./SettingDialog";
import { units } from "../Utilities";

function SettingTextField(props) {
    const [open, setOpen] = useState(false);

    const { decimalPlaces, setting, unit, value, width } = props
    const unitText = units[unit];

    return (
        <>
            <SettingDialog {...{ ...props, open, setOpen }} />
            <TextField
                label={<>{setting} ({unitText})</>}
                margin="dense"
                onClick={() => setOpen(true)}
                style={{ width: width || 100 }}
                value={value.toFixed(decimalPlaces)}
                variant="outlined"
            />
        </>
    );
};

SettingTextField.propTypes = {
    unit: PropTypes.oneOf(Object.keys(units)),
};

export default SettingTextField;