var express = require('express');
var router = express.Router();
var schools_ctr = require('../controllers/schools');

router.get('/', async function (req, res, next) {
  res.json(await schools_ctr.get_all());
});

module.exports = router;
