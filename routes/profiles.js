var express = require('express');
var middle_auth = require('../middlewares/auth');
var router = express.Router();

var profiles_ctr = require('../controllers/profiles');

const { check, validationResult } = require('express-validator/check');

//Listar perfiles
router.get('/', middle_auth.validate, middle_auth.veryfy_permisson, async function (req, res, next) {
	res.json(await profiles_ctr.get_all());
});

//Actualizar perfil
router.put('/', middle_auth.validate, async function (req, res, next) {	
	res.json(await profiles_ctr.update(req.body.id, req.body.name));
});

//Crear nuevo perfil
router.post('/', middle_auth.validate, [
	check('name').not().isEmpty().isLength({ min: 3 }),
], async function (req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	res.json(await profiles_ctr.new(req.body.name));
});

//Eliminar perfil
router.delete('/', middle_auth.validate, async function (req, res, next) {
	res.json(await profiles_ctr.delete(req.body.id));
});

module.exports = router;