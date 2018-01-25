/*
 * One Controller per layout view
 */

const express = require('express');
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

router.get('/', function(req, res, next) {

    // retrieve calculation data
    calculationsModel.findOne({_id: "59a3e4a4a2049554a93fec93"}).then(calculation => {
        let calculationCompleted = validateCalculation(calculation);
        console.log(calculation);
        console.log(calculationCompleted);
        
        return res.render('dashboard/dashboard', {
            title: 'Dashboard',
            calculationCompleted
        });
    })
});

module.exports = router;