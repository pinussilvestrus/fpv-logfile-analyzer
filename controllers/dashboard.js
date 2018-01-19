/*
 * One Controller per layout view
 */

const express = require('express');
const router = express.Router();
const analyzer = require('../lib/index');


// Dashboard

router.get('/', function(req, res, next) {
    return res.render('dashboard/dashboard', {
        title: 'Dashboard'
    });
});

module.exports = router;