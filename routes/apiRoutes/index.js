// This file acts as a central hub to pull everything together.

const express = require('express');
const router = express.Router();

// These statements pull in the routes from the various modules.
router.use(require('./candidateRoutes'));
router.use(require('./partyRoutes'));
router.use(require('./voterRoutes'));
router.use(require('./voteRoutes'));


/////////////////////////////////////////////////////////////////////////////////////////
module.exports = router;