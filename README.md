# fpv-logfile-analyzer
Script for automatically analyzing the smart-meter logfiles (Forschungsprojekt Virtualisierung HS-Harz)

## Requirements

* node.js

## Setup

1. Clone directory into local folder
2. Go into the cloned folder and enter `npm install`

## Run

1. Go into project folder
2. run `node index.js` for generating the chart
3. run `npm start` for serving the generated chart on http://localhost:8000/

## Cli Usage

Usage: node index.js [options]

  Options:

    -V, --version                output the version number
    -i, --input-file <path>      Add an input file, e.g. 'logs/Stck2-21122017-1415Uhr.txt'
    -o, --output-file <path>     Add an output file, e.g. 'index.html'
    -d, --data-factor <number>   Add an data-factor, e.g. 100
    -f, --fetchEnergy <boolean>  Whether to fetch energy or power data
    -h, --help                   output usage information

