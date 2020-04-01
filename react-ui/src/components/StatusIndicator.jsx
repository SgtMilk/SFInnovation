import React, { useState } from "react";

import { Badge, Divider, IconButton, Menu, MenuItem, Typography } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import NotificationIcon from "@material-ui/icons/Notifications";
import NotificationImportantIcon from "@material-ui/icons/NotificationImportant";

import Bridge from "../Bridge";
import { useRefresher } from "../Utilities";

const StyledBadge = withStyles(theme => ({
    badge: {
        border: `1px solid ${theme.palette.background.paper}`,
        backgroundColor: 'red',
    },
}))(Badge);

const useStyles = makeStyles(theme => ({
    root: {
        alignItems: "center",
        display: "flex",
        flexGrow: 1,
        justifyContent: "center",
    },
    alarmIconButton0: {
        color: "inherit",
    },
    alarmIconButtonNon0: {
        color: "red",
    },
    alarmIcon: {
        fontSize: 42,
    },
    menuItem: {
        width: 600,
    },
    warningIcon: {
        position: 'relative',
        color: 'orange',
        top: 5,
        left: 0,
        marginRight: 5,
    },
    errorIcon: {
        position: 'relative',
        color: 'red',
        top: 5,
        left: 0,
        marginRight: 5,
    },
    alarmComponentContainer: {
        whiteSpace: "normal",
    },
}));

export default function StatusIndicator() {
    const [anchorEl, setAnchorEl] = useState(null);

    const classes = useStyles();

    useRefresher(100);

    const { alarms, status } = Bridge;
    const activeAlarms = Object
        .entries(alarms)
        .filter(([name,]) => Bridge[name])
        .map(([, value]) => value);

    return (
        <div className={classes.root}>
            <Typography variant="h5">{status}</Typography>

            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

            <IconButton
                className={activeAlarms.length === 0 ? classes.alarmIconButton0 : classes.alarmIconButtonNon0}
                onClick={event => setAnchorEl(event.currentTarget)}
            >
                {activeAlarms.length === 0
                    ? <NotificationIcon className={classes.alarmIcon} />
                    : (
                        <StyledBadge badgeContent={activeAlarms.length} color="error" overlap="circle">
                            <NotificationImportantIcon className={classes.alarmIcon} />
                        </StyledBadge>
                    )
                }
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                keepMounted
                onClose={() => setAnchorEl(null)}
                open={!!anchorEl}
            >
                {activeAlarms.length === 0
                    ? <MenuItem className={classes.menuItem}>No alarms or warnings.</MenuItem>
                    : activeAlarms.map((alarm, i) => <div key={i}>
                        <MenuItem key={i} className={classes.menuItem}>{alarm.component(classes, Bridge)}</MenuItem>
                        {i !== activeAlarms.length - 1 && <Divider />}
                    </div>)
                }
            </Menu>
        </div>
    )
};