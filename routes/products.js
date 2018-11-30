var express = require('express');
var router = express.Router();

var middle_auth = require('../middlewares/auth');
var product_ctr = require('../controllers/products');

const { check, validationResult } = require('express-validator/check');

//Listar productos.
router.get('/', async function(req, res, next) {
    res.json(await product_ctr.get_all());
});

//Listar productos por colegio.
router.get('/school/:school_id', async function(req, res, next) {
    res.json(await product_ctr.get_by_school(req.params.school_id));
});
//Listar precios de productos de menor a mayor.
router.get('/', async function(req, res, next) {
    res.json(await product_ctr.get_by_product_price(req.params.school_id));
});

//Listar los generos
router.get('/gender', async function(req, res, next){
    res.json(await product_ctr.getGender());
});

//Crear producto.
router.post('/', async function(req, res, next) {
    let data = req.body;
    let files = req.files;
    res.json(await product_ctr.new(data, files));
});

//DT
router.post('/datatables', middle_auth.validate, async function (req, res, next) {
    res.json(await product_ctr.get_all_dt());
});

//Actualizar producto.
router.put('/', middle_auth.validate, async function(req, res, next) {
    let data = req.body;
    res.json(await product_ctr.update(data));
});

//Actualizar cantidad de producto
router.put('/quantity', middle_auth.validate, async function(req, res, next) {
    let data = req.body;
    res.json(await product_ctr.update_quantity(data));
});

//Eliminar producto.
router.delete('/:product_id', middle_auth.validate, async function(req, res, next) {
    res.json(await product_ctr.delete(req.params.product_id));
});

module.exports = router;