/*
 * One Controller per layout view
 */

const express = require('express');
const router = express.Router();
const analyzer = require('../lib/index');
const measurementsModel = require('../models/measurement.model');

// Measurements
router.get('/', function(req, res, next) {
    return measurementsModel.find({}).then(result => {
        return res.render('measurements/measurements-overview', {
            title: 'Messungen',
            measurements: result
        });
    });
});

router.get('/add/', function(req, res, next) {
    return res.render('measurements/measurement-add', {
        title: 'Messung hinzufügen',
        dataPointMethodOptions: analyzer.getDataPointFunctionNames,
    });
});

router.get('/:id/', function(req, res, next) {
    return measurementsModel.findOne({ _id: req.params.id }).then(result => {
        return analyzer.writeDiagram(result, true).then(diagram => {
            return res.render('measurements/measurement', {
                title: result.label,
                measurement: result,
                chartDiv: diagram.chartDiv
            });
        });
    }).catch(err => res.send(err))
});

router.post('/', function(req, res, next) {

    console.log(req.body)
        // todo: handle file upload

    analyzer.build({ // todo: inputFile
        dataFactor: parseInt(req.body.dataFactor),
        fetchEnergy: req.body.fetchEnergy === 'fetchEnergy' ? true : false,
        dataPointsMethod: parseInt(req.body.dataPointsMethod)
    });

    analyzer.readFile(true).then(result => {
        let newMeasurement = new measurementsModel({
            label: req.body.label,
            logFile: 'logs/Stck2-15012018-1130Uhr.txt', //todo!
            socket: result.chartTitle,
            chartData: result.chartData,
            statistics: result.statistics
        });

        return newMeasurement.save().then(result => {
            res.redirect('/measurements/');
        }).catch(err => res.err(err));
    });
});

module.exports = router;