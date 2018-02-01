/*
 * One Controller per layout view
 */

const express = require('express');
const router = express.Router();
const authHelper = require('../lib/authHelper');

// About

router.get('/', authHelper, function(req, res, next) {
    return res.render('about/about', {
        title: 'Über dieses Projekt'
    });
});

module.exports = router;