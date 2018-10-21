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

router.get('/', middle_auth.validate, async function (req, res, next) {
    res.json(await user_ctr.get_all());
});

router.put('/', middle_auth.validate, async function (req, res, next) {
    let data = req.body;
    res.json(await user_ctr.update(data));
});

router.delete('/', middle_auth.validate, async function (req, res, next) {
    res.json(await user_ctr.delete(req.body.id));
});

router.post('/register',  async function (req, res, next) {
    let data = req.body;
    res.json(await user_ctr.register(data));
});

router.post('/forgot_password', async function (req, res) {
    res.json(await user_ctr.forgot_password(req.body.email));
});

router.post('/change_password', middle_auth.validate, async function (req, res) {
    let data = req.body;
    res.json(await user_ctr.change_password(data));
});

module.exports = router;