import React from "react";

import {
    Button,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from "@material-ui/core";
import { makeStyles, } from "@material-ui/core/styles";
import HelpIcon from "@material-ui/icons/HelpOutlined";

const useStyles = makeStyles(theme => ({
    icon: {
        position: 'relative',
        top: 5,
        left: -5,
        marginRight: 5,
    },
}));

export default function InitialHelpDialog({ open, onClose, setAtInitial, }) {
    const classes = useStyles();

    return (
        <Dialog open={open}>
            <DialogTitle>
                <HelpIcon className={classes.icon} />
                Instructions
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    First-time user? Consult our step-by-step instructions.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="primary" onClick={onClose}>
                    No Help Needed
                </Button>
                <Button variant="contained" color="primary" onClick={() => setAtInitial(false)}>
                    Teach me
                </Button>
            </DialogActions>
        </Dialog>
    );
};