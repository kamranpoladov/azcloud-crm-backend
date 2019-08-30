const Lead = require('../../db/models/leadModel');

async function generateDataSet() {
    const leads = await Lead
        .find({})
        .populate('service');

    const result = await Promise.all(leads.map(async lead => {
        const fee = (await lead.service.feeAndVat).totalFee;

        return {
            revenue: fee,
            startDate: lead.startDate,
            stopDate: lead.stopDate
        };
    }));

    return result;
}

function isBetween(date, startDate, stopDate) {
    if (date.getTime() >= startDate.getTime() && date.getTime() <= stopDate.getTime()) {
        return true;
    } else {
        return false;
    }
}

//ARRAY OF DATE()
function generateDatePoints(startDate, stopDate) {
    const length = (stopDate.getFullYear() - startDate.getFullYear()) * 8;
    const startExact = startDate.getTime();
    const endExact = stopDate.getTime();
    const difference = endExact - startExact;
    const intervalLength = difference / length;

    const datePoints = [];

    for (let i = 0; i < length; i++) {
        datePoints.push(new Date(startExact + intervalLength * i));
    }

    return datePoints;
}

function calculateRevenueForDate(date, dataSet) {
    return dataSet.filter(dataPoint => isBetween(date, dataPoint.startDate, dataPoint.stopDate))
        .reduce((revenue, dataPoint) => {
            return revenue + dataPoint.revenue;
        }, 0);
}

async function generateTimeSeries(startDate, stopDate) {
    const dataSet = await generateDataSet();

    return generateDatePoints(startDate, stopDate)
        .map(date => {
            return [new Date(date), calculateRevenueForDate(date, dataSet)];
        });
}

module.exports = generateTimeSeries;