var express = require('express');
var middle_auth = require('../middlewares/auth');
var router = express.Router();

var sales_ctr = require('../controllers/sales');

//Crear una nueva venta
router.post('/', middle_auth.validate, async function (req, res) {
	res.json(await sales_ctr.new(req));
});

module.exports = router;