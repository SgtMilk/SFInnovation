import React, { useState } from "react";

import { Typography } from "@material-ui/core";

import { useInterval } from "../Utilities";

function getFormattedDateTime(ts) {
    let d = new Date(ts || Date.now());

    let year = d.getFullYear();
    let month = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ][d.getMonth()];
    let date = d.getDate();

    let hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
    let minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    let seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();

    return <>{month} {date}, {year} &nbsp;&nbsp; {hours}:{minutes}:{seconds}</>;
}

export default function DateTimeIndicator() {
    const [string, setString] = useState(getFormattedDateTime());

    useInterval(() => setString(getFormattedDateTime()), 1000);

    return (
        <div>
            <Typography variant="h5">{string}</Typography>
        </div>
    )
};