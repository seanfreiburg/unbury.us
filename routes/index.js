var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("index");
});

router.get('/opportunity_cost', function(req, res, next) {
    res.render("opportunity_cost");
});

module.exports = router;
