const fs = require('fs');

function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    var strTime = hours + '-' + minutes + '-' + seconds + '-' + ampm;
    return (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear() + "-" + strTime;
}

const csvLines = [];
const addToCsv = (name, value, timestamp, direction) => csvLines.push([timestamp, name, value, direction]);

const setupCsv = () => {
    process.on('SIGINT', () => {
        console.log('Received SIGINT; flushing to CSV file');

        if (!fs.existsSync('./data'))
            fs.mkdirSync('./data');

        let fileLines = [
            'timestamp,name,value,direction',
            ...csvLines.map(row => row.join(',')),
        ];

        fs.writeFileSync("./data/" + formatDate(new Date(global.tStart)) + '.csv', fileLines.join('\n'));

        process.exit(0);
    });
}

module.exports = {
    formatDate,
    addToCsv,
    setupCsv,
};