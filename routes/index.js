var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.json({ app: 'API-MDV-V2' });
});

module.exports = router;
