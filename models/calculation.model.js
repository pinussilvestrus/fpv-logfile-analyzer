'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// current calculation guideline: https://docs.google.com/document/d/1SF0vrBLKHBzJuAh-gRYZQlBSp0ckI7uhUETIqqISL3M/edit#

const eVorherSchema = new Schema({
    eComputerAlt: [{ type: Schema.Types.ObjectId, ref: 'measurement' }],
    tLabore: { type: Number },
    cComputerDurchschnitt: { type: Number }
});

const eServerraumSchema = new Schema({
    eSteckdose1: { type: Schema.Types.ObjectId, ref: 'measurement' },
    eSteckdose2: { type: Schema.Types.ObjectId, ref: 'measurement' },
    tSemester: { type: Number },
    cServer: { type: Number }
});

const eNachherSchema = new Schema({
    eZeroClient: [{ type: Schema.Types.ObjectId, ref: 'measurement' }],
    tLabore: { type: Number },
    cZeroClientsDurchschnitt: { type: Number },
    eServerraum: eServerraumSchema
});


const calculationSchema = new Schema({
    eVorher: eVorherSchema,
    eNachher: eNachherSchema
}, {
    timestamps: true
});

const calculationModel = mongoose.model('calculation', calculationSchema);

module.exports = calculationModel;