var express = require('express');
var router = express.Router();
var user_domain = require('../domains/users');

const { check, validationResult } = require('express-validator/check');

router.get('/:id', [ check('id').isLength({ max: 3 }) ], function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  res.json(user_domain.get_by_id(null));
});

router.get('/', function (req, res, next) {
  res.json(user_domain.get_all(null));
});

module.exports = router;
