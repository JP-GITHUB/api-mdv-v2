var express = require('express');
var middle_auth = require('../middlewares/auth');
var router = express.Router();

var profiles_ctr = require('../controllers/profiles');

router.get('/', middle_auth.validate, middle_auth.veryfy_permisson, async function (req, res, next) {
	res.json(await profiles_ctr.get_all());
});

router.put('/', middle_auth.validate, async function (req, res, next) {
	res.json(await profiles_ctr.update(req.body.id, req.body.nombre));
});

router.post('/', middle_auth.validate,async function (req, res, next) {
	res.json(await profiles_ctr.new(req.body.nombre));
});

router.delete('/', middle_auth.validate, async function (req, res, next) {
	res.json(await profiles_ctr.delete(req.body.id));
});

module.exports = router;