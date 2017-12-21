const fs = require('fs');
const _ = require('underscore');
const split = require('split');

const regex = new RegExp("[^\\n\\r\\t ]+",'g')
const test_file = 'logs/Stck1-21122017-1415Uhr.txt'; // todo: command line

const convertStreamToJSON = (outData) => {
  console.log(outData);
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