/*
 * One Controller per layout view
 */

const express = require('express');
const router = express.Router();
const analyzer = require('../lib/index');


// Dashboard

router.get('/dashboard/', function(req, res, next) {

    // todo: show something dashboard like stuff
    analyzer.build({
        inputFile: 'logs/Stck1-21122017-1415Uhr.txt',
        outputFile: 'index.html',
        dataFactor: 100,
        fetchEnergy: false
    });
    analyzer.readFile(true).then(result => {
        return res.render('dashboard/dashboard', {
            title: 'Dashboard',
            demo: result
        });
    })
});

module.exports = router;