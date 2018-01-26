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

/** @return true, if all necessary data for calculation is entered
 * calculation guideline: https://docs.google.com/document/d/1SF0vrBLKHBzJuAh-gRYZQlBSp0ckI7uhUETIqqISL3M/edit#
 */
const validateCalculation = calculation => {
    if (!calculation) return false;

    let eVorher = calculation.eVorher;
    let eNachher = calculation.eNachher;
    if (!eVorher || !eNachher) return false;

    if(!eVorher.hasOwnProperty('tLabore') ||
    !eVorher.hasOwnProperty('eComputerAlt') ||
    !eVorher.hasOwnProperty('cComputerDurchschnitt')) return false;

    if (!eNachher.hasOwnProperty('eZeroClient') ||
    !eNachher.hasOwnProperty('tLabore') ||
    !eNachher.hasOwnProperty('cZeroClientsDurchschnitt') ||
    !eNachher.hasOwnProperty('eServerraum')) return false

    let eServerraum = eNachher.eServerraum;
    if (!eServerraum.hasOwnProperty('eSteckdose1') ||
    !eServerraum.hasOwnProperty('eSteckdose2') ||
    !eServerraum.hasOwnProperty('tSemester') ||
    !eServerraum.hasOwnProperty('cServer')) return false;

    return true;
}

const markSelectedComputerAlt = (options, value) => {
    return options.map(option => {
        option.selectedComputerAlt = JSON.stringify(option._id) === JSON.stringify(value);
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
        let calculationCompleted = validateCalculation(calculation);
        // get available measurements
        measurementsModel.find({}).then(measurements => {

            // calculations
            calculation.eComputerAltUsedEnergy = calculateUsedEnergyPerMinute(measurements, calculation.eVorher.eComputerAlt);
            calculation.eVorherUsedEnergy = Math.round(
                (calculation.eComputerAltUsedEnergy * calculation.eVorher.tLabore * calculation.eVorher.cComputerDurchschnitt) * 10000) / 10000; // 4 digits

            measurements = markSelectedComputerAlt(measurements, calculation.eVorher.eComputerAlt);

            return res.render('dashboard/dashboard', {
                title: 'Dashboard',
                calculationCompleted,
                calculation,
                measurements
            });
        });
    })
});

router.patch('/evorher/:id', function(req, res, next) {
    console.log('here');
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

module.exports = router;