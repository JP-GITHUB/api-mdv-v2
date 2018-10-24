var express = require('express');
var models = require('../models');
var router = express.Router();

var middle_auth = require('../middlewares/auth');
var product_ctr = require('../controllers/products');

router.get('/', middle_auth.validate,  async function (req, res, next) {
    res.json(await product_ctr.get_all());
});

router.post('/', middle_auth.validate, async function (req, res, next) {
    let data = req.body;
    res.json(await product_ctr.new(data));
});

router.put('/', middle_auth.validate, async function (req, res, next) {
    let data = req.body;
    res.json(await product_ctr.update(data));
});

router.put('/cantidad', middle_auth.validate, async function (req, res, next) {
    let data = req.body;
    res.json(await product_ctr.update_quantity(data));
});

router.delete('/', middle_auth.validate, async function (req, res, next) {
    res.json(await product_ctr.delete(req.body.id));
});

module.exports = router;