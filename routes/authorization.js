var express = require('express');
var router = express.Router();

var auth_ctr = require('../controllers/authorization');

router.post('/login', async function (req, res, next) {
    let email = req.body.email;
	let password = req.body.password;
	
	return res.json(await auth_ctr.login(email, password));
});

module.exports = router;
