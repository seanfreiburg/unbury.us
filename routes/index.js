import express from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/opportunity_cost', function(req, res, next) {
  res.render('opportunity_cost');
});

export default router;
