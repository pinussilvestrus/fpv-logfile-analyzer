'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    labels: [{ type: String }],
    series: [
        [{ type: String }]
    ]
});

const statisticsSchema = new Schema({
    fromTo: { type: String },
    calculatedHours: { type: Number },
    usedEnergy: { type: Number },
    averagedPower: { type: Number }
});

const measurementSchema = new Schema({
    label: { type: String, required: true },
    socket: { type: String, required: true },
    logFile: { type: String, required: true },
    chartData: dataSchema,
    statistics: statisticsSchema
}, {
    timestamps: true
});

const measurementModel = mongoose.model('measurement', measurementSchema);

module.exports = measurementModel;