var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("index");
});

router.get('/opportunity_cost', function(req, res, next) {
    res.render("opportunity_cost");
});

router.get('/fi_calculator', function(req, res, next) {
    res.render("fi_calculator");
});

module.exports = router;
