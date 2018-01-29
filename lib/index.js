#!/usr/bin/env node

const fs = require('fs');
const _ = require('underscore');
const split = require('split');
const renderChart = require('node-chartist');
const handlebars = require('handlebars');
const promisify = require('es6-promisify');
const path = require('path');
const moment = require('moment');
const dataPointHelper = require('./dataPointsHelper');
const calculationHelper = require('./calculationHelper');

const regex = new RegExp("[^\\n\\r\\t ]+", 'g');
const templateFile = './template.hbs';
const timestampFormat = 'YYYY-MM-DD_hh:mm:ss';
const timestampIndex = 0;
const socketIndex = 1;
const energyIndex = 4;
const powerIndex = 6;

// options defaults
let inputFile = 'logs/Stck1-21122017-1415Uhr.txt';
let outputFile = 'index.html';
let dataFactor = 100; // indicates, how much data is retrieved from files, value = 2 => every 2nd..
let fetchEnergy = false;
let dataPointsMethod = 0;
let dataPointTimeStampOffset = 0; // e.g. serverraum: 11613582000

/*
#######################
#######################
######## L I B ########
#######################
#######################
*/

/** constructor */
const build = (options) => {
    inputFile = options.inputFile || inputFile;
    outputFile = options.outputFile || outputFile;
    dataFactor = options.dataFactor || dataFactor;
    fetchEnergy = options.fetchEnergy || fetchEnergy;
    dataPointsMethod = (options.dataPointsMethod && options.dataPointsMethod < dataPointHelper.length) ?
        options.dataPointsMethod :
        dataPointsMethod;
    dataPointTimeStampOffset = options.dataPointTimeStampOffset || dataPointTimeStampOffset;
}

/**
 * the timestamps written in the logfiles are false, e.g. the measurements starts at
 * 2018-05-01_22:00:42 in the log, but 2017-12-18_11:00:00 in real time
 * this function converts a given timestamp to the correct one
 * @param {String} timestamp, e.g. 2018-05-01_22:00:42
 */
const convertTimeStamp = (timestamp) => {
    const differenceInMillis = dataPointTimeStampOffset;
    return moment(timestamp, timestampFormat).subtract(differenceInMillis, 'milliseconds').format(timestampFormat);
}

/**
 * 
 * @param [Array of Arrays] dataObject, e.g.
 * [['2018-05-02_00:24:42',
    'Steckdose1_Pwr',
    'eState:',
    'E:',
    '469.1',
    'P:',
    '193.41',
    'I:',
    '855',
    'U:',
    '231.2',
    'f:',
    '49.98'],
    [....]]
 * @returns e.g.{
        fromTo: '2018-05-01_22:00:24 - 2018-05-05_00:58:11',
        calculatedMinutes: 7,
        usedEnergy: 900,
        averagedPower: 200
      }
 */
const calculateStatistics = (dataObject) => {
    let result = {
        fromTo: '',
        calculatedMinutes: 0,
        usedEnergy: 0,
        averagedPower: 0
    };

    const outTimeFormat = 'DD.MM.YYYY hh:mm:ss';

    // fromTo
    let startDate = moment(dataObject[0][timestampIndex], timestampFormat);
    let endDate = moment(dataObject[dataObject.length - 1][timestampIndex], timestampFormat);
    result.fromTo = `${startDate.format(outTimeFormat)} - ${endDate.format(outTimeFormat)}`;

    // calculatedMinutes
    result.calculatedMinutes = moment.duration(endDate.diff(startDate)).asMinutes();
    result.calculatedMinutes = Math.round(result.calculatedMinutes * 100) / 100;

    // usedEnergy, only last energy entry of log file
    result.usedEnergy = parseFloat(dataObject[dataObject.length - 1][energyIndex]);

    // averagedPower
    let sum = 0;
    _.forEach(dataObject, o => {
        sum += parseFloat(o[powerIndex]);
    });
    result.averagedPower = Math.round((sum / dataObject.length) * 100) / 100;

    return result;
};

/** Converts input stream of a log file to structured json object, which can be used for chartist.js
 * @param [Array of Arrays] outData, e.g.
 * [['2018-05-02_00:24:42',
    'Steckdose1_Pwr',
    'eState:',
    'E:',
    '469.1',
    'P:',
    '193.41',
    'I:',
    '855',
    'U:',
    '231.2',
    'f:',
    '49.98'],
    [....]]

 * @returns e.g.
    {
      socket: Steckdose1_Pwr,
      chartData: { 
        labels: [ '2018-05-02_00:24:42',  ... ],
        series: [ [ '193.41', ... ] ]
      },
      statistics: { ... }
    }
 */
const convertStreamToJSON = (outData) => {

    // convert timestamps
    _.each(outData, o => {
        o[timestampIndex] = convertTimeStamp(o[timestampIndex]);
    });

    // predefine result-structure
    let result = {
        socket: outData[0][socketIndex],
        chartData: {
            labels: [],
            series: [
                []
            ]
        },
        statistics: calculateStatistics(outData)
    };

    // calculate chartData
    result.chartData = dataPointHelper[dataPointsMethod](outData, dataFactor, fetchEnergy);

    console.log(`Socket ${result.socket}: ${result.chartData.labels.length} from overall ${outData.length} data points were retrieved for chart (factor ${dataFactor})`);

    return result;
}

/**
 * retrieves log-file data from given input file
 * @param {Boolean} justReturn - whether to just return the generated chart-div-element or render it into a file (for the cli)
 */
const readFile = (justReturn) => {

    let index = 0;
    let outData = [];

    return new Promise((resolve, reject) => {
        let readStream = fs.createReadStream(inputFile)
            .pipe(split())
            .on('data', (line) => {

                line = line.toString().match(regex);

                if (line) {
                    // array, no keys
                    outData.push(line);
                    index++;
                }
            });

        readStream.on('end', () => {
            resolve(writeDiagram(convertStreamToJSON(outData), justReturn));
        });
    });
}

/**
 * renders the node-chartist chart from given dataObject
 * @param {Boolean} justReturn - whether to just return the generated chart-div-element or render it into a file (for the cli)
 * @param {} dataObject, e.g.
 * {
      socket: Steckdose1_Pwr,
      chartData: { 
        labels: [ '2018-05-02_00:24:42',  ... ],
        series: [ [ '193.41', ... ] ]
      },
      statistics: { see above }
    }
 */
const writeDiagram = (dataObject, justReturn) => {
    const options = {
        width: 1200,
        height: 600,
        axisY: { title: fetchEnergy ? 'Energie E in Wh' : 'Leistung P in W' },
        axisX: { title: 'Datum' }
    };

    return renderChart('line', options, dataObject.chartData).then(chartDiv => {

        if (justReturn) return {
            chartDiv: chartDiv,
            chartTitle: dataObject.socket,
            statistics: dataObject.statistics,
            chartData: dataObject.chartData
        };

        // render to output-file with handlebars
        return promisify(fs.readFile)(path.join(__dirname, templateFile)).then(res => {
            let source = res.toString();
            let template = handlebars.compile(source);
            let html = template({
                chartDiv: chartDiv,
                chartTitle: dataObject.socket,
                statistics: dataObject.statistics
            });

            return promisify(fs.writeFile)(outputFile, html).then(res => {
                console.log(`The chart was rendered in ${outputFile}!`);
            }).catch(err => {
                console.log(err);
            });
        });
    });
}

/** computes the names of all available dataPointMethods */
const getDataPointFunctionNames = () => {
    return _.map(dataPointHelper, m => m.name)
};

const calculateUsedEnergy = (calculation, measurements) => {
    return calculationHelper.calculateOverallUsedEnergy(calculation, measurements);
}

module.exports = {
    build,
    readFile,
    writeDiagram,
    getDataPointFunctionNames,
    calculateUsedEnergy
}