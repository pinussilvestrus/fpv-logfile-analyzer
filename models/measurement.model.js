'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**let example = {
    "label": "Messung Serverraum 1 Woche",
    "logFile": "logs/Stck2-15012018-1130Uhr.txt",
    "socket": "Steckdose2_Pwr",
    "chartData": {
        "labels": [
            "2017-12-18_11:00:52",
            "2017-12-18_03:00:16",
            "2017-12-18_04:55:06",
            "2017-12-18_08:28:19",
            "2017-12-19_12:41:49",
            "2017-12-19_04:55:52",
            "2017-12-19_09:02:52",
            "2017-12-19_12:24:01",
            "2017-12-19_02:43:35",
            "2017-12-19_05:46:16",
            "2017-12-19_09:33:34",
            "2017-12-20_01:41:50",
            "2017-12-20_05:47:44",
            "2017-12-20_09:18:07",
            "2017-12-20_11:50:56",
            "2017-12-20_02:01:57",
            "2017-12-20_06:08:19",
            "2017-12-20_10:16:44",
            "2017-12-21_02:15:02",
            "2017-12-21_06:28:25",
            "2017-12-21_09:36:03",
            "2017-12-21_12:02:47"
        ],
        "series": [
            [
                "0",
                "208.41",
                "186.44",
                "153.99",
                "156.92",
                "155.35",
                "164.4",
                "161.87",
                "168.13",
                "162.52",
                "157.1",
                "156.78",
                "156.41",
                "168.65",
                "179.52",
                "168.95",
                "160.14",
                "157.07",
                "158.32",
                "156.93",
                "168.76",
                "177.74"
            ]
        ]
    },
    "statistics": {
        "fromTo": "18.12.2017 11:00:52 - 21.12.2017 02:01:54",
        "calculatedHours": 63.02,
        "usedEnergy": 11672.1,
        "averagedPower": 160.28
    }
}**/

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