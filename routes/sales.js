var express = require('express');
var middle_auth = require('../middlewares/auth');
var router = express.Router();

var sales_ctr = require('../controllers/sales');

//Crear una nueva venta
router.post('/', middle_auth.validate, async function (req, res) {
	res.json(await sales_ctr.new(req));
});

router.post('/deliver', middle_auth.validate, async function (req, res) {
	let code = req.body.code;
	res.json(await sales_ctr.deliver(code));
});

router.get('/:code', middle_auth.validate, async function (req, res) {
	res.json(await sales_ctr.get_by_code(req.params.code));
});

module.exports = router;