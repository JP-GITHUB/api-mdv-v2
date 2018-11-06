var express = require('express');
var models = require('../models');
var router = express.Router();

const multer = require('multer');

//"Estrategia de salvado de nuevas imágenes entrantes"
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
});
const upload = multer ({ storage: storage});

var middle_auth = require('../middlewares/auth');
var product_ctr = require('../controllers/products');

const { check, validationResult } = require('express-validator/check');


//Listar productos.
router.get('/', middle_auth.validate, async function(req, res, next) {
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

//Crear producto.
router.post('/', upload.single('productImage'), middle_auth.validate, [
    check('name').not().isEmpty(),
    check('description').not().isEmpty().isLength({ min: 4 })
], async function(req, res, next) {
    console.log(req.file)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let data = req.body;
    res.json(await product_ctr.new(data));
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
router.delete('/', middle_auth.validate, async function(req, res, next) {
    res.json(await product_ctr.delete(req.body.id));
});

module.exports = router;