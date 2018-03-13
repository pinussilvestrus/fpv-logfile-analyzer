/**
 * this helper calculates the used energy per term in kWH for the web-app
 * calculation guideline: https://docs.google.com/document/d/1SF0vrBLKHBzJuAh-gRYZQlBSp0ckI7uhUETIqqISL3M/edit#
 */

const _ = require('lodash');

const calculateCO2Emissions = (calculation, co2Function)  => {
  calculation.eVorherCO2Emission = co2Function(calculation.eVorherUsedEnergy);
  calculation.eNachherCO2Emission = co2Function(calculation.eNachherUsedEnergy);
};

const calculateUsedEnergyPerMinute = (measurements, id) => {
    let result;
    _.forEach(measurements, m => {
        if (JSON.stringify(m._id) === JSON.stringify(id)) {
            m.statistics.usedEnergykWh = m.statistics.usedEnergy / 1000;
            result = Math.round((m.statistics.usedEnergykWh / m.statistics.calculatedMinutes) * 1000000) / 1000000; // 6 digits
        }
    });
    return result;
};

const calculateOverallUsedEnergy = (calculation, measurements, co2Function) => {

    // calculate average for each measurement
    calculation.eComputerAltUsedEnergy = _.sum(_.map(calculation.eVorher.eComputerAlt, id => calculateUsedEnergyPerMinute(measurements, id))) / calculation.eVorher.eComputerAlt.length;
    calculation.eVorherUsedEnergy = Math.round(
        (calculation.eComputerAltUsedEnergy * calculation.eVorher.tLabore * calculation.eVorher.cComputerDurchschnitt) *
        10000) / 10000; // 4 digits

    calculation.eSteckdose1UsedEnergy = calculateUsedEnergyPerMinute(measurements, calculation.eNachher.eServerraum.eSteckdose1);
    calculation.eSteckdose2UsedEnergy = calculateUsedEnergyPerMinute(measurements, calculation.eNachher.eServerraum.eSteckdose2);
    calculation.eServerraumUsedEnergy = Math.round(
        ((calculation.eSteckdose1UsedEnergy + calculation.eSteckdose2UsedEnergy) * calculation.eNachher.eServerraum.tSemester * calculation.eNachher.eServerraum.cServer) *
        10000) / 10000; // 4 digits

    // calculate average for each measurement
    calculation.eZeroClientUsedEnergy = _.sum(_.map(calculation.eNachher.eZeroClient, id => calculateUsedEnergyPerMinute(measurements, id))) / calculation.eNachher.eZeroClient.length;
    calculation.eZeroClientsUsedEnergy = Math.round(
        (calculation.eZeroClientUsedEnergy * calculation.eNachher.tLabore * calculation.eNachher.cZeroClientsDurchschnitt) *
        10000) / 10000; // 4 digits

    calculation.eNachherUsedEnergy = Math.round(
        (calculation.eZeroClientsUsedEnergy + calculation.eServerraumUsedEnergy) *
        10000) / 10000; // 4 digits
    
    calculateCO2Emissions(calculation, co2Function);

    // total comparisons
    calculation.eDifference = Math.round(
        (calculation.eVorherUsedEnergy - calculation.eNachherUsedEnergy) * 
        10000) / 10000; // 4 digits

    calculation.co2Difference =  Math.round(
        (calculation.eVorherCO2Emission - calculation.eNachherCO2Emission) * 
        10000) / 10000; // 4 digits

    calculation.eDifferencePercentage =  Math.round(
        ((calculation.eDifference * 100) / calculation.eVorherUsedEnergy) * 
        10000) / 10000; // 4 digits

    calculation.co2DifferencePercentage = Math.round(
        ((calculation.co2Difference * 100) / calculation.eVorherCO2Emission) * 
        10000) / 10000; // 4 digits


    return calculation;
};

module.exports = { calculateOverallUsedEnergy };