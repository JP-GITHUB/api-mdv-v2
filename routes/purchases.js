var express = require('express');
var middle_auth = require('../middlewares/auth');
var router = express.Router();

var sales_ctr = require('../controllers/sales');

router.get('/code/:code', middle_auth.validate, middle_auth.verify_permisson, async function (req, res) {
	res.json(await sales_ctr.get_by_code(req.params.code));
});

router.get('/user_email/:email', middle_auth.validate, middle_auth.verify_permisson, async function (req, res) {
	res.json(await sales_ctr.get_by_user_email(req.params.email));
});


module.exports = router;