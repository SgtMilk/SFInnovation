import React from "react";

import clsx from 'clsx';

import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import WarningIcon from "@material-ui/icons/Warning";

import Bridge from "../Bridge";
import { useRefresher } from "../Utilities";

const useStyles = makeStyles(theme => ({
    borderError: {
        border: '10px solid red'
    },
    borderWarning: {
        border: '10px solid orange'
    },
    title: {
        borderBottom: 'none',
    },
    content: {
        borderBottom: 'none',
        borderTop: 'none',
    },
    actions: {
        borderTop: 'none',
    },
    iconError: {
        position: 'relative',
        top: 5,
        left: -5,
        marginRight: 5,
        color: 'red',
    },
    iconWarning: {
        position: 'relative',
        top: 5,
        left: -5,
        marginRight: 5,
        color: 'orange',
    },
}));

export default function AlarmDialog() {
    const classes = useStyles();
    useRefresher(100);

    let { children, description, open, setOpen, severity } = Bridge.alarmDialog;

    severity = severity || 'error';

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
        >
            <DialogTitle className={clsx(classes.title, severity === 'error' ? classes.borderError : classes.borderWarning)}>
                <WarningIcon className={severity === 'error' ? classes.iconError : classes.iconWarning} />
                {severity.toUpperCase()} - {description}
            </DialogTitle>
            <DialogContent className={clsx(classes.content, severity === 'error' ? classes.borderError : classes.borderWarning)}>
                <DialogContentText>
                    {children}
                </DialogContentText>
            </DialogContent>
            <DialogActions className={clsx(classes.actions, severity === 'error' ? classes.borderError : classes.borderWarning)}>
                <Button onClick={() => setOpen(false)} color="primary" variant="outlined">
                    Close
                 </Button>
            </DialogActions>
        </Dialog>
    );
};