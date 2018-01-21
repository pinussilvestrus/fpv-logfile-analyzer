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
    .option('-f, --fetch-energy <boolean>', 'Whether to fetch energy or power data')
    .option('-m, --data-points-method <number>', 'Which method to choose for the data points, see dataPointsHelper.js, default is useBlockAverage')
    .parse(process.argv);

let options = {
    inputFile: commander.inputFile,
    outputFile: commander.outputFile,
    dataFactor: commander.dataFactor,
    fetchEnergy: commander.fetchEnergy,
    dataPointsMethod: commander.dataPointsMethod
};

lib.build(options);
lib.readFile();