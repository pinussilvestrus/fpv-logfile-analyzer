const fs = require('fs');
const _ = require('underscore');
const split = require('split');

const regex = new RegExp("[^\\n\\r\\t ]+",'g')
const test_file = 'logs/Stck1-21122017-1415Uhr.txt'; // todo: command line

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
    label: outData[0][socket_index],
    data: []
  };
  _.each(outData, od => {
    result.data.push({
      timestamp: od[timestamp_index],
      energy: od[energy_index],
      power: od[power_index]
    });
  });

  console.log(result);
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
    convertStreamToJSON(outData);
  });
}

readFile(test_file);