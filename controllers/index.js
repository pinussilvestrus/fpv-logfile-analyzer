const express = require('express');
const router = express.Router();

router.use(require('./dashboard'));

/**router.use('/account/', require('./account'));**/


module.exports = router;