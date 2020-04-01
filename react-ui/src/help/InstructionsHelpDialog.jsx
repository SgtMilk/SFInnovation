import React, { useState, } from "react";

import {
    Button,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Step, StepButton, Stepper,
    Typography,
} from "@material-ui/core";
import { makeStyles, } from "@material-ui/core/styles";
import HelpIcon from "@material-ui/icons/HelpOutlined";

import { getStepContent } from './stepContent';

const useStyles = makeStyles(theme => ({
    icon: {
        position: 'relative',
        top: 5,
        left: -5,
        marginRight: 5,
    },
    inlineIcon: {
        position: 'relative',
        top: 5,
    },
    stepperControlButton: {
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(2),
    },
    stepper: {
        padding: theme.spacing(1, 2),
    },
    ol: {
        margin: theme.spacing(1, 0),
    },
    content: {
        maxHeight: 1000,
    }
}));

export default function InstructionsHelpDialog({ open, onClose }) {
    const [activeStep, setActiveStep] = useState(0);

    const classes = useStyles();

    const stepContent = getStepContent(classes);

    return (
        <Dialog open={open} fullWidth maxWidth="xl">
            <DialogTitle>
                <HelpIcon className={classes.icon} />
                Instructions
            </DialogTitle>
            <DialogContent className={classes.content}>
                <Stepper alternativeLabel className={classes.stepper} nonLinear activeStep={activeStep} orientation="horizontal">
                    {stepContent.map((_, index) => (
                        <Step key={index}>
                            <StepButton onClick={() => setActiveStep(index)} />
                        </Step>
                    ))}
                </Stepper>
                <div>
                    <Button
                        className={classes.stepperControlButton}
                        color="primary"
                        disabled={activeStep === 0}
                        onClick={() => setActiveStep(s => s - 1)}
                        size="large"
                        variant="outlined"
                    >Back</Button>
                    <Button
                        className={classes.stepperControlButton}
                        color="primary"
                        disabled={activeStep === stepContent.length - 1}
                        onClick={() => setActiveStep(s => s + 1)}
                        size="large"
                        variant="outlined"
                    >Next</Button>
                </div>
                <div>
                    <Typography variant="h6" component="div">{activeStep + 1}. {stepContent[activeStep][0]}</Typography>
                    <Typography variant="body1" component="div">{stepContent[activeStep][1]}</Typography>
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onClose}
                    size="large"
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};