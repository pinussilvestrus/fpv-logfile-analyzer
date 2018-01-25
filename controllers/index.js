const express = require('express');
const router = express.Router();

router.use('/dashboard', require('./dashboard'));
router.use('/about/', require('./about'));
router.use('/measurements/', require('./measurements'));


module.exports = router;