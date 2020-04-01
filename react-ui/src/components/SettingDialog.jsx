import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';

import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
    Button,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Grid,
    Slider,
    Tooltip,
} from "@material-ui/core";

import LeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import RightIcon from "@material-ui/icons/KeyboardArrowRight";

import { units, usePrevious } from "../Utilities";

const sliderLabelSize = 40;

const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing(0, 1),
    },
    focusVisible: {},
    buttonBackdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: "25%",
        backgroundColor: theme.palette.common.white,
        opacity: 0,
        transition: theme.transitions.create('opacity'),
    },
    primary: {
        color: "white",
    },
    sliderContainer: {
        marginTop: theme.spacing(3.5),
    },
    actions: {
        flex: "1 0 auto",
        justifyContent: "space-between",
    },
    buttonMargin: {
        marginLeft: theme.spacing(0.75),
        marginRight: theme.spacing(0.75),
    },
    tooltip: {
        fontSize: 14,
    },
}));

const SettingDialogSlider = withStyles({
    valueLabel: {
        fontSize: "1.2rem",
        "& > span": {
            width: sliderLabelSize,
            height: sliderLabelSize,
        },
    },
})(Slider);

function SettingDialog({ open, setOpen, decimalPlaces, description, min, max, setter, setting, step, unit, value }) {
    const prevOpen = usePrevious(open);
    useEffect(() => {
        if (open && !prevOpen)
            setLocalValue(value);
    }, [open, prevOpen, value]);

    const [localValue, setLocalValue] = useState(value);
    const [localValueString, setLocalValueString] = useState(value.toFixed(decimalPlaces));

    useEffect(() => setLocalValueString(localValue.toFixed(decimalPlaces)), [decimalPlaces, localValue]);

    const classes = useStyles();

    const onClose = () => setOpen(false);
    const validate = val => Math.min(Math.max(parseFloat(val).toFixed(decimalPlaces), min), max);

    const unitText = units[unit];
    const round = num => Math.round(num * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
    step = step || round((max - min) / 10);

    return (
        <>
            <Dialog
                {...{ open }}
                className={classes.dialog}
                fullWidth
                maxWidth="xl"
            >
                <DialogTitle>{setting} - {description} ({unit})</DialogTitle>
                <DialogContent dividers>
                    <div className={classes.sliderContainer}>
                        <Grid
                            alignItems="center"
                            container
                            spacing={2}
                        >
                            <Grid item>
                                {min.toFixed(decimalPlaces)}{unitText}
                            </Grid>
                            <Grid item xs>
                                <SettingDialogSlider
                                    className={classes.slider}
                                    {...{ min, max, step, }}
                                    onChange={(_, newValue) => setLocalValue(parseFloat(newValue))}
                                    value={localValue}
                                    valueLabelDisplay="on"
                                />
                            </Grid>
                            <Grid item>
                                {max.toFixed(decimalPlaces)}{unitText}
                            </Grid>
                        </Grid>
                    </div>
                </DialogContent>
                <DialogActions className={classes.actions}>
                    <div>
                        <Tooltip
                            arrow
                            classes={{ tooltip: classes.tooltip }}
                            title="Decrease"
                            placement="top"
                        >
                            <Button
                                className={classes.buttonMargin}
                                color="primary"
                                onClick={() => setLocalValue(localValue => Math.max(localValue - step, min))}
                                size="large"
                                variant="outlined"
                            >
                                <LeftIcon />
                            </Button>
                        </Tooltip>
                        <Tooltip
                            arrow
                            classes={{ tooltip: classes.tooltip }}
                            title="Increase"
                            placement="top"
                        >
                            <Button
                                className={classes.buttonMargin}
                                color="primary"
                                onClick={() => setLocalValue(localValue => Math.min(localValue + step, max))}
                                size="large"
                                variant="outlined"
                            >
                                <RightIcon />
                            </Button>
                        </Tooltip>
                    </div>
                    <div>
                        <Button
                            className={classes.buttonMargin}
                            onClick={onClose}
                            size="large"
                            variant="outlined"
                        >
                            Cancel
                    </Button>
                        <Button
                            className={classes.buttonMargin}
                            color="primary"
                            onClick={() => { setter(validate(localValue)); onClose(); }}
                            size="large"
                            variant="contained"
                        >
                            Set {setting}&nbsp;to {localValueString}{unitText}
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        </>
    );
}

SettingDialog.propTypes = {
    unit: PropTypes.oneOf(Object.keys(units)),
};

export default SettingDialog;