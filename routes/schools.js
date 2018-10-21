var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  let schools = [
    {
      id: 1,
      name: 'Liceo Manuel de Salas LMS'
    },
    {
      id: 2,
      name: 'Universitario El Salvador'
    },
  ];

  res.json({ status: true, schools });
});

module.exports = router;
