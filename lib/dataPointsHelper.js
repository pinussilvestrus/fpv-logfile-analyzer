/**
 * this helper provides several methods for uniting a couple of data points
 * just because when there are lots of points and we need to combine them for 
 * the charts
 
 * Usage: import this helper and choose the function with the corresponding number,
 * e.g. dataPointsHelper[0](params ...) = useSpotCheck(params ...)
 */

const _ = require('lodash');

const timestampIndex = 0;
const socketIndex = 1;
const energyIndex = 4;
const powerIndex = 6;


/**
 * uses blocks with size @param dataFactor and calculates the average of them
 * as block-timestamp it is used the first timestamp of the block-values
 */
const useBlockAverage = (dataPoints, dataFactor, fetchEnergy) => {
    let chartData = {
        labels: [],
        series: [
            []
        ]
    };

    let block = {
        timestamp: '',
        values: []
    };

    _.each(dataPoints, dp => {
        block.timestamp = dp[timestampIndex];
        block.values.push(parseFloat(dp[fetchEnergy ? energyIndex : powerIndex]));

        if (block.values.length >= dataFactor) {
            chartData.labels.push(block.timestamp);
            chartData.series[0].push(_.mean(block.values));
            // reset block
            block = {
                timestamp: '',
                values: []
            };
        }
    });

    return chartData;
};

/**
 * just uses every x'th data point (e.g. @param dataFactor = 2 => every 2nd)
 */
const useSpotCheck = (dataPoints, dataFactor, fetchEnergy) => {
    let chartData = {
        labels: [],
        series: [
            []
        ]
    };

    _.each(dataPoints, (dp, index) => {
        if (index % dataFactor == 0) {
            chartData.labels.push(dp[timestampIndex]);
            chartData.series[0].push(dp[fetchEnergy ? energyIndex : powerIndex]);
        }
    });

    return chartData;
};

module.exports = [
    useBlockAverage,
    useSpotCheck
];