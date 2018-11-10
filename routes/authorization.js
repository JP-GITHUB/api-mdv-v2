var express = require('express');
var router = express.Router();

var auth_ctr = require('../controllers/authorization');

router.post('/login', async function(req, res, next) {
    let mail = req.body.mail;
    let password = req.body.password;

    return res.json(await auth_ctr.login(mail, password));
});

module.exports = router;