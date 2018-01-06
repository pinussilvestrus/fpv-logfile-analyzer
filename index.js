const fs = require('fs');
const _ = require('underscore');
const split = require('split');
const renderChart = require('node-chartist');
const handlebars = require('handlebars');
const promisify = require('es6-promisify');
const path = require('path');

const regex = new RegExp("[^\\n\\r\\t ]+",'g');
const templateFile = './template.hbs';
// options defaults todo: command line
const inputFile = 'logs/Stck2-21122017-1415Uhr.txt'; 
const outputFile = 'index.html';
const dataFactor = 100; // indicates, how much data is retrieved from files, value = 2 => every 2nd..
const fetchEnergy = false;

const timestampIndex = 0;
const socketIndex = 1;
const energyIndex = 4;
const powerIndex = 6;

/**
 * 
 * @param [Array of Arrays] outData
 * converts e.g.
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

    to

    {
      label: Steckdose1_Pwr,
      chartData: { 
        labels: [ '2018-05-02_00:24:42',  ... ],
        series: [ [ '193.41', .. ] ]
      }
    }
 */
const convertStreamToJSON = (outData) => {
  let result = {
    label: outData[0][socketIndex],
    chartData: {
      labels: [],
      series: [[]]
    }
  };
  _.each(outData, (od, index) => {
    if (index % dataFactor == 0) {
      result.chartData.labels.push(od[timestampIndex]);
      result.chartData.series[0].push(od[fetchEnergy ? energyIndex: powerIndex]);
    }
  });

  console.log(`Socket ${result.label}: ${result.chartData.labels.length} from overall ${outData.length} data points were retrieved for chart (factor ${dataFactor})`);

  return result;
}

const readFile = (inPath) => {
  
  let index = 0;
  let outData = [];

  let readStream = fs.createReadStream(inPath)
    .pipe(split())
    .on('data', (line) => {

      line = line.toString().match(regex);

      if(line){
          // array, no keys
          outData.push(line);
          index++;
      }
    });

  readStream.on('end', () => {
    writeDiagram(convertStreamToJSON(outData));
  });
}

const writeDiagram = (dataObject) => {
  const options = {
    width: 2000, 
    height: 1000,
    axisY: { title: fetchEnergy ? 'Energie E in WS' : 'Leistung P in W'},
    axisX: { title: 'Datum' }
  };

  /**const exampleData = {
    labels: ['a','b','c','d','e'],
    series: [
      [1, 2, 3, 4, 5],
      [3, 4, 5, 6, 7]
    ]
  };**/

  renderChart('line', options, dataObject.chartData).then(chartDiv => {
    // render to output-file with handlebars
    return promisify(fs.readFile)(path.join(__dirname, templateFile)).then(res => {
      let source = res.toString();
        let template = handlebars.compile(source);
        let html = template({
          chartDiv: chartDiv,
          chartTitle: dataObject.label
        });

        return promisify(fs.writeFile)(outputFile, html).then(res => {
          console.log(`The chart was rendered in ${outputFile}!`);
        }).catch(err => {
          console.log(err);
        });
      });
    });
}

readFile(inputFile);