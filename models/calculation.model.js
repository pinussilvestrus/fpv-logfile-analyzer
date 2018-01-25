'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// current calculation guideline: https://docs.google.com/document/d/1SF0vrBLKHBzJuAh-gRYZQlBSp0ckI7uhUETIqqISL3M/edit#

const eVorherSchema = new Schema({
    eComputerAlt: {type: Schema.Types.ObjectId, required: true, ref: 'measurement'},
    tLabore: {type: Number, required: true},
    cComputerDurchschnitt: {type: Number, required: true}
});

const eServerraumSchema = new Schema({
  eSteckdose1: {type: Schema.Types.ObjectId, required: true, ref: 'measurement'},
  eSteckdose2: {type: Schema.Types.ObjectId, required: true, ref: 'measurement'},
  tSemester: {type: Number, required: true},
  cServer: {type: Number, required: true}
});

const eNachherSchema = new Schema({
  eZeroclient: {type: Schema.Types.ObjectId, required: true, ref: 'measurement'},
  tLabore: {type: Number, required: true},
  cZeroClientsDurchschnitt: {type: Number, required: true},
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