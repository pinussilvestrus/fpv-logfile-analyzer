# fpv-logfile-analyzer

Script and Web Application for automatically analyzing [fhem](https://wiki.fhem.de/wiki/Hauptseite) log-files (Forschungsprojekt Virtualisierung HS-Harz)


[![Build Status](https://travis-ci.org/pinussilvestrus/fpv-logfile-analyzer.svg?branch=master)](https://travis-ci.org/pinussilvestrus/fpv-logfile-analyzer) [![Greenkeeper badge](https://badges.greenkeeper.io/pinussilvestrus/fpv-logfile-analyzer.svg?token=980d1d0322802cec36a63bd342c497f36c155a8629fde870949fb02c5f03f41a&ts=1519317159352)](https://greenkeeper.io/)

![image](https://user-images.githubusercontent.com/9433996/36330967-370742de-136c-11e8-89ed-b115ed3626b7.png)


## Requirements

* [node.js](https://nodejs.org/en/)
* [mongodb](https://www.mongodb.com)

## Setup

1. Clone directory into local folder
2. Go into the cloned folder and enter `npm install`

## Run CLI

1. Go into project folder
2. run `node lib/cli.js` for generating the chart
3. run `npm run serve-chart` for serving the generated chart on http://localhost:8000/

## Run Web-App

1. Go into project folder
2. run `npm run setup` for prefill the mongo-db with calculation-data
3. run `npm start` for serving the app on http://localhost:3100/

## Develop

1. Go into project folder
2. run `npm run setup` for prefill the mongo-db with calculation-data
3. run `npm run watch` for serving the app on http://localhost:3100/

## Cli Usage

Usage: node cli.js [options]

    Options:

    -V, --version                      output the version number
    -i, --input-file <path>            Add an input file, e.g. 'logs/Stck2-21122017-1415Uhr.txt'
    -o, --output-file <path>           Add an output file, e.g. 'index.html'
    -d, --data-factor <number>         Add an data-factor, e.g. 100
    -f, --fetch-energy <boolean>       Whether to fetch energy or power data
    -m, --data-points-method <number>  Which method to choose for the data points, see dataPointsHelper.js, default is useBlockAverage
    -t, --timestamp-offset <number>    Offset for converting all timestamps
    -h, --help                         output usage information
