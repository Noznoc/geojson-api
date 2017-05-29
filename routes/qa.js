var express = require('express'); // defining the Express application
var router = express.Router(); // defining the router, which define an app behavior when a specific reuest is received

db = require('../queries');

router.get('/qa/area', db.area); // url to access the area data
router.get('/qa/match', db.match);
router.get('/qa/:city/:id', db.getId);

module.exports = router;