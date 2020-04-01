import React, { useRef, } from "react";

import { defaults, Line } from "react-chartjs-2";

import { colorToRGBA, tsToHMS } from "../Utilities";
import { themeData } from "../Config";

export default function Chart({ colors, data, suggestedMin, suggestedMax, title }) {
    const chartRef = useRef(null);

    colors = colors || { 0: themeData.palette.secondary.main };

    let processedData = {
        labels: data.map(d => d.timestamp).map(tsToHMS),
        datasets: Object.entries(colors).map(([dataIndex, newColor], colorIndex, colorEntries) => (
            {
                type: 'line',
                label: 'Dataset ' + colorIndex,
                fill: 'origin',
                lineTension: 0.1,
                backgroundColor: colorToRGBA(newColor, 0.4),
                borderColor: colorToRGBA(newColor, 1),
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: colorToRGBA(newColor, 1),
                pointBackgroundColor: 'black',
                pointBorderWidth: 8,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: colorToRGBA(newColor, 1),
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: data.map((d, i) =>
                    (i >= dataIndex && (colorIndex >= colorEntries.length - 1 || i <= colorEntries[colorIndex + 1][0]))
                        ? d.value
                        : null
                ),
            }
        )),
    };

    let labelTracker = 0;
    const options = {
        defaultFontFamily: defaults.global.defaultFontFamily = "Roboto",
        defaultFontSize: defaults.global.defaultFontSize = 20,
        legend: {
            display: false,
        },
        maintainAspectRatio: false,
        responsive: true,
        responsiveAnimationDuration: 0,
        animation: {
            duration: 0
        },
        hover: {
            animationDuration: 0
        },
        scales: {
            yAxes: [{
                ticks: {
                    maxTicksLimit: 8,
                    suggestedMin,
                    suggestedMax,
                },
            }],
            xAxes: [{
                afterTickToLabelConversion: function (data) {
                    var xLabels = data.ticks;
                    xLabels.forEach((_, i) => {
                        if ((i + labelTracker) % 5 !== 1)
                            xLabels[i] = '';
                    });
                    labelTracker++;
                },
            }],
        },
        title: {
            display: true,
            text: title
        },
        tooltips: {
            callbacks: {
                label: (item, data) => {
                    let lastDatasetIndex = -1;
                    data.datasets.forEach((ds, i) => {
                        // eslint-disable-next-line
                        if (ds.data[item.index] == item.value)
                            lastDatasetIndex = i;
                    });
                    return item.datasetIndex === lastDatasetIndex ? item.yLabel : null;
                },
            },
        },
    };

    return <Line ref={chartRef} data={processedData} options={options} />;
};