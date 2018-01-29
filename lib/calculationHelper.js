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
    calculation.eComputerAltUsedEnergy = calculateUsedEnergyPerMinute(measurements, calculation.eVorher.eComputerAlt);
    calculation.eVorherUsedEnergy = Math.round(
        (calculation.eComputerAltUsedEnergy * calculation.eVorher.tLabore * calculation.eVorher.cComputerDurchschnitt) *
        10000) / 10000; // 4 digits

    calculation.eSteckdose1UsedEnergy = calculateUsedEnergyPerMinute(measurements, calculation.eNachher.eServerraum.eSteckdose1);
    calculation.eSteckdose2UsedEnergy = calculateUsedEnergyPerMinute(measurements, calculation.eNachher.eServerraum.eSteckdose2);
    calculation.eServerraumUsedEnergy = Math.round(
        ((calculation.eSteckdose1UsedEnergy + calculation.eSteckdose2UsedEnergy) * calculation.eNachher.eServerraum.tSemester * calculation.eNachher.eServerraum.cServer) *
        10000) / 10000; // 4 digits

    calculation.eZeroClientUsedEnergy = calculateUsedEnergyPerMinute(measurements, calculation.eNachher.eZeroClient);
    calculation.eZeroClientsUsedEnergy = Math.round(
        (calculation.eZeroClientUsedEnergy * calculation.eNachher.tLabore * calculation.eNachher.cZeroClientsDurchschnitt) *
        10000) / 10000; // 4 digits

    calculation.eNachherUsedEnergy = Math.round(
        (calculation.eZeroClientsUsedEnergy + calculation.eServerraumUsedEnergy) *
        10000) / 10000; // 4 digits
    
    calculateCO2Emissions(calculation, co2Function);

    return calculation;
};

module.exports = { calculateOverallUsedEnergy };