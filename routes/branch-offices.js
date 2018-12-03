var express = require('express');
var models = require('../models');
var middle_auth = require('../middlewares/auth');
var router = express.Router();

var branchOffice_ctr = require('../controllers/branch-offices');

const { check, validationResult } = require('express-validator/check');

router.get('/:branchOffice_id', middle_auth.validate, async function (req, res) {
    res.json(await branchOffice_ctr.get_by_id(req.params.branchOffice_id));
});

/** Datatables example */
router.post('/datatables', middle_auth.validate, middle_auth.verify_permisson, async function (req, res, next) {
    res.json(await branchOffice_ctr.get_all_dt());
});

/** RestFull */

router.get('/', async function (req, res, next) {
    res.json(await branchOffice_ctr.get_all());
});

router.post('/', middle_auth.validate, middle_auth.verify_permisson, [
    check('name').not().isEmpty().isLength({ min: 3, max: 50 }),
    check('location').not().isEmpty().isLength({min: 3, max: 255}),
    check('telephone').not().isEmpty().isLength({ min: 3, max: 16}),
], async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let data = req.body;
    res.json(await branchOffice_ctr.new(data));
});

router.put('/', middle_auth.validate, middle_auth.verify_permisson, async function (req, res, next) {
    let data = req.body;
    res.json(await branchOffice_ctr.update(data));
});

router.delete('/:branchOffice_id', middle_auth.validate, middle_auth.verify_permisson, async function (req, res, next) {
    res.json(await branchOffice_ctr.delete(req.params.branchOffice_id));
});
module.exports = router;