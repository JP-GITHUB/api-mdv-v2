var express = require('express');
var router = express.Router();
let user_ctr = require('../controllers/users');

router.get('/', function (req, res, next) {
  res.json({ app: 'API-MDV-V2' });
});

router.get('/info_token', function (req, res) {
  let token = req.headers['authorization'];
  let result = user_ctr.get_user_in_token(token);
  res.json({data: result.user});
});

module.exports = router;
