/*
 * One Controller per layout view
 */

const express = require('express');
const router = express.Router();


// Dashboard

router.get('/dashboard/', function(req, res, next) {
    return res.render('dashboard/dashboard', {});
});

module.exports = router;