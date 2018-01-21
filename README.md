# fpv-logfile-analyzer
Script for automatically analyzing the smart-meter logfiles (Forschungsprojekt Virtualisierung HS-Harz)

## Requirements

* node.js

## Setup

1. Clone directory into local folder
2. Go into the cloned folder and enter `npm install`

## Run CLI

1. Go into project folder
2. run `node lib/cli.js` for generating the chart
3. run `npm run serve-chart` for serving the generated chart on http://localhost:8000/

## Cli Usage

Usage: node cli.js [options]

    Options:

    -V, --version                      output the version number
    -i, --input-file <path>            Add an input file, e.g. 'logs/Stck2-21122017-1415Uhr.txt'
    -o, --output-file <path>           Add an output file, e.g. 'index.html'
    -d, --data-factor <number>         Add an data-factor, e.g. 100
    -f, --fetch-energy <boolean>       Whether to fetch energy or power data
    -m, --data-points-method <number>  Which method to choose for the data points, see dataPointsHelper.js
    -h, --help                         output usage information
## Run Web-App

1. Go into project folder
2. run `npm start` for serving the app on http://localhost:3100/