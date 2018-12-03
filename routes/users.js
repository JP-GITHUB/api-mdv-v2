var express = require('express');
var middle_auth = require('../middlewares/auth');
var router = express.Router();


var user_ctr = require('../controllers/users');

const { check, validationResult } = require('express-validator/check');

router.get('/:user_id', middle_auth.validate, middle_auth.verify_permisson, async function (req, res) {
    res.json(await user_ctr.get_by_id(req.params.user_id));
});

/** Datatables example */
router.post('/datatables', middle_auth.validate, async function (req, res, next) {
    res.json(await user_ctr.get_all_dt(req));
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

router.post('/', middle_auth.validate, [
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
    let profile_id = data.profile_id;
    res.json(await user_ctr.register(data, (profile_id ? profile_id : 2))); // 2 - Comprador
});

router.put('/', middle_auth.validate, async function (req, res, next) {
    let data = req.body;
    res.json(await user_ctr.update(data));
});

router.delete('/:user_id', middle_auth.validate, async function (req, res, next) {
    res.json(await user_ctr.delete(req.params.user_id));
});
module.exports = router;