/*
 * One Controller per layout view
 */

const express = require('express');
const _ = require('lodash');
const router = express.Router();
const analyzer = require('../lib/index');
const measurementsModel = require('../models/measurement.model');
const calculationsModel = require('../models/calculation.model');

// Dashboard

const markSelected = (options, value, key) => {
    return options.map(option => {
        option[key] = JSON.stringify(option._id) === JSON.stringify(value);
        return option;
    });
}

const calculateUsedEnergyPerMinute = (measurements, id) => {
    let result;
   _.forEach(measurements, m => {
       if (JSON.stringify(m._id) === JSON.stringify(id)) {
           m.statistics.usedEnergykWh = m.statistics.usedEnergy / 1000;
           result = Math.round((m.statistics.usedEnergykWh / m.statistics.calculatedMinutes) * 1000000) / 1000000; // 6 digits
       }
   });
   return result;
}

router.get('/', function(req, res, next) {

    // retrieve calculation data
    calculationsModel.findOne({_id: "59a3e4a4a2049554a93fec93"}).then(calculation => {
        // get available measurements
        measurementsModel.find({}).then(measurements => {

            // calculations
            // calculation guideline: https://docs.google.com/document/d/1SF0vrBLKHBzJuAh-gRYZQlBSp0ckI7uhUETIqqISL3M/edit#
            calculation.eComputerAltUsedEnergy = calculateUsedEnergyPerMinute(measurements, calculation.eVorher.eComputerAlt);
            calculation.eVorherUsedEnergy = Math.round(
                (calculation.eComputerAltUsedEnergy * calculation.eVorher.tLabore * calculation.eVorher.cComputerDurchschnitt) * 10000) / 10000; // 4 digits

            measurements = markSelected(measurements, calculation.eVorher.eComputerAlt, 'selectedComputerAlt');
            measurements = markSelected(measurements, calculation.eNachher.eZeroClient, 'selectedZeroClient');
            measurements = markSelected(measurements, calculation.eNachher.eServerraum.eSteckdose1, 'selectedSteckdose1');
            measurements = markSelected(measurements, calculation.eNachher.eServerraum.eSteckdose2, 'selectedSteckdose2');

            return res.render('dashboard/dashboard', {
                title: 'Dashboard',
                calculation,
                measurements
            });
        });
    })
});

router.patch('/evorher/:id', function(req, res, next) {
    let calculationId = req.params.id;
    let calculationPatch = req.body;

    calculationsModel.findOne({_id: calculationId}).then(calculation => {
        for(key in calculationPatch) {
            calculation.eVorher[key] = calculationPatch[key];
        }

        calculation.save().then(_ => {
            res.redirect('/');
        })
    });
});

router.patch('/enachher/:id', function(req, res, next) {
    let calculationId = req.params.id;
    let calculationPatch = req.body;
    calculationsModel.findOne({_id: calculationId}).then(calculation => {
        for(key in calculationPatch) {
            calculation.eNachher[key] = calculationPatch[key];
        }

        calculation.save().then(_ => {
            res.redirect('/');
        })
    });
});

module.exports = router;