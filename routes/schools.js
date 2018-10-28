var express = require('express');
var router = express.Router();
var schools_ctr = require('../controllers/schools');
var middle_auth = require('../middlewares/auth');

const { check, validationResult } = require('express-validator/check');

//Listar colegios
router.get('/', async function (req, res, next) {
  res.json(await schools_ctr.get_all());
});


//Actualizar colegios
router.put('/', middle_auth.validate, async function (req, res, next) {	
	res.json(await schools_ctr.update(req.body.id, req.body.name));
});


//Crear nuevo colegio
router.post('/', middle_auth.validate, [
  check('name').not().isEmpty().isLength({ min: 3 }),
  check('rut').not().isEmpty(),
  check('location').not().isEmpty(),
  check('telephone').not().isEmpty(),
], async function (req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
  }
  let data = req.body;
	res.json(await schools_ctr.new(data));
});


//Eliminar colegios
router.delete('/', middle_auth.validate, async function (req, res, next) {
	res.json(await schools_ctr.delete(req.body.id));
});

module.exports = router;
