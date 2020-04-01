import React, { useState } from "react";
import PropTypes from 'prop-types';

import clsx from "clsx";

import { makeStyles, } from "@material-ui/core/styles";
import { ButtonBase, Typography, } from "@material-ui/core";

import SettingDialog from "./SettingDialog";
import { units } from "../Utilities";

const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing(0, 1),
    },
    button: {
        backgroundColor: theme.palette.primary.main,
        borderRadius: "25%",
        height: 95,
        width: 175,
        "&:hover, &$focusVisible": {
            zIndex: 1,
            "& $buttonBackdrop": {
                opacity: 0.3,
            }
        }
    },
    buttonOpen: {
        backgroundColor: "lightgrey",
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

function DataButton(props) {
    const { decimalPlaces, setting, setter, unit, value, startOpen } = props;

    const [open, setOpen] = useState(!!startOpen);

    const classes = useStyles();

    const unitText = units[unit];

    return (
        <>
            {!!setter && <SettingDialog {...{ ...props, open, setOpen }} />}
            <div className={classes.root}>
                <ButtonBase
                    className={clsx(classes.button, open && classes.buttonOpen)}
                    focusRipple
                    focusVisibleClassName={classes.focusVisible}
                    onClick={() => setOpen(!!setter && true)}
                >
                    {!open && <span className={classes.buttonBackdrop} />}
                    <div>
                        <Typography
                            className={classes.primary}
                            component="div"
                            variant="h5"
                        >
                            {setting}
                        </Typography>
                        <Typography
                            className={classes.primary}
                            component="div"
                            variant="h4"
                        >
                            {value.toFixed(decimalPlaces)}{unitText}
                        </Typography>
                    </div>
                </ButtonBase>
            </div>
        </>
    );
}

DataButton.propTypes = {
    unit: PropTypes.oneOf(Object.keys(units)),
};

export default DataButton;