/*
 * One Controller per layout view
 */

const express = require('express');
const router = express.Router();

// About

router.get('/', function(req, res, next) {
    return res.render('about/about', {
        title: 'Über dieses Projekt'
    });
});

module.exports = router;