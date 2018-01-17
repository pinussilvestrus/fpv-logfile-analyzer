const lib = require('./index');
const commander = require('commander');

/*
#######################
#######################
####### C L I #######
#######################
#######################
*/


// input cli arguments

commander
    .version('0.1.0')
    .option('-i, --input-file <path>', "Add an input file, e.g. 'logs/Stck2-21122017-1415Uhr.txt'")
    .option('-o, --output-file <path>', "Add an output file, e.g. 'index.html'")
    .option('-d, --data-factor <number>', 'Add an data-factor, e.g. 100')
    .option('-f, --fetchEnergy <boolean>', 'Whether to fetch energy or power data')
    .parse(process.argv);

let options = {
    inputFile: commander.inputFile,
    outputFile: commander.outputFile,
    dataFactor: commander.dataFactor,
    fetchEnergy: commander.fetchEnergy
};

lib.build(options);
lib.readFile();