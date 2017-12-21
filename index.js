const fs = require('fs');
const _ = require('underscore');
const split = require('split');
const generate = require('node-chartist');

const regex = new RegExp("[^\\n\\r\\t ]+",'g');

// options todo: command line
const test_file = 'logs/Stck1-21122017-1415Uhr.txt'; 
const test_output_file = 'test.html';
const data_factor = 100; // indicates, how much data is retrieved from files, value = 2 => every 2nd..
const fetchEnergy = false;

const timestamp_index = 0;
const socket_index = 1;
const energy_index = 4;
const power_index = 6;

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
      data: [
        {
          timestamp: 2018-05-02_00:24:42,
          energy: 469.1,
          power: 193.41
        }
      ],
      ...
    }
 */
const convertStreamToJSON = (outData) => {
  let result = {
    labels: [],
    series: [[]]
  };
  _.each(outData, (od, index) => {
    if (index % data_factor == 0) {
      result.labels.push(od[timestamp_index]);
      result.series[0].push(od[fetchEnergy ? energy_index: power_index]);
    }
  });

  console.log(`${result.labels.length} from overall ${outData.length} data points were retrieved for chart (factor ${data_factor})`);

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
  const options = {width: 4000, height: 2000};

  /**const exampleData = {
    labels: ['a','b','c','d','e'],
    series: [
      [1, 2, 3, 4, 5],
      [3, 4, 5, 6, 7]
    ]
  };**/

  generate('line', options, dataObject).then(chartDiv => {
    // write to ouput file
    fs.writeFile(test_output_file, chartDiv, (err) => {
      if(err) {
          return console.log(err);
      }
      console.log(`The chart was rendered in ${test_output_file}!`);
    }); 
  }) 
}

readFile(test_file);