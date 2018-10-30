var express = require('express');
var models = require('../models');
var middle_auth = require('../middlewares/auth');
var router = express.Router();

var user_ctr = require('../controllers/users');

const { check, validationResult } = require('express-validator/check');

/**
 * Example validation check: 
 * 
router.get('/:id', [check('id').isLength({ max: 3 })], function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    res.json(user_ctr.get_by_id(null));
});
*/

router.get('/:user_id', middle_auth.validate, async function (req, res) {
    res.json(await user_ctr.get_by_id(req.params.user_id));
});

/** Datatables example */
router.post('/datatables', async function (req, res, next) {
    res.json(await user_ctr.get_all_dt());
});

//Registro
router.post('/register', [
    check('name').not().isEmpty().isLength({ min: 3 }),
    check('mail').not().isEmpty().isEmail(),
    check('lastname').not().isEmpty().isLength({ min: 3 }),
    check('rut').not().isEmpty(),
    check('telephone').not().isEmpty().isLength({ max: 12 }),
    check('password').not().isEmpty().isLength({ min: 4 })
], async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let data = req.body;
    res.json(await user_ctr.register(data));
});

//Recuperar contraseña
router.post('/forgot_password', [
    check('mail').not().isEmpty().isEmail()
], async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let data = req.body;
    res.json(await user_ctr.forgot_password(req.body.email));
});

//Cambiar contraseña.
router.post('/change_password', middle_auth.validate, async function (req, res) {
    let data = req.body;
    res.json(await user_ctr.change_password(data));
});

/** RestFull */

router.get('/', middle_auth.validate, async function (req, res, next) {
    res.json(await user_ctr.get_all());
});

router.post('/', [
    check('name').not().isEmpty().isLength({ min: 3 }),
    check('mail').not().isEmpty().isEmail(),
    check('lastname').not().isEmpty().isLength({ min: 3 }),
    check('rut').not().isEmpty(),
    check('telephone').not().isEmpty().isLength({ max: 12 }),
    check('password').not().isEmpty().isLength({ min: 4 })
], async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let data = req.body;
    res.json(await user_ctr.register(data, 2)); // 2 = Vendedor
});

router.put('/', middle_auth.validate, async function (req, res, next) {
    let data = req.body;
    res.json(await user_ctr.update(data));
});

router.delete('/:user_id', middle_auth.validate, async function (req, res, next) {
    res.json(await user_ctr.delete(req.params.user_id));
});
module.exports = router;