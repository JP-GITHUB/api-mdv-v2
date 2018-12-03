const express = require('express');
const router = express.Router();

const middle_auth = require('../middlewares/auth');
var payment_ctr = require('../controllers/payments');

router.get('/banks',  middle_auth.validate, async function (req, res) {
	res.json(await payment_ctr.banks());
});

router.post('/',  middle_auth.validate, middle_auth.verify_permisson, async function (req, res) {
	let subject = req.body.subject;
	let amount = req.body.amount;
	res.json(await payment_ctr.generate(subject, amount))
});

router.post('/confirm_sale', async function (req, res) {
	let body = req.body;
	//let body = { api_version: '1.3', notification_token: '79976b57f8e3bfd8253d4b72b8f5b94d4fcb2856cd0a74bff8e13ee2bcbc263d' };
	res.json(await payment_ctr.confirm_sale_with_token(body));
});

module.exports = router;