var express = require('express');
var router = express.Router();

var middle_auth = require('../middlewares/auth');
var existance_ctr = require('../controllers/existances');

const { check, validationResult } = require('express-validator/check');

//Crear existencia.
router.post('/', middle_auth.validate, [
    check('price').not().isEmpty(),
    check('quantity').not().isEmpty(),
    check('product').not().isEmpty(),
    check('size').not().isEmpty()
], async function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let data = req.body;
    res.json(await existance_ctr.new(data));
});

//DT
router.post('/datatables', middle_auth.validate, async function (req, res, next) {
    res.json(await existance_ctr.get_all_dt(req));
});

//Actualizar producto.
router.put('/', middle_auth.validate, async function(req, res, next) {
    let data = req.body;
    res.json(await existance_ctr.update(data));
});

router.get('/sizes', async function(req, res, next){
    res.json(await existance_ctr.get_sizes());
})

module.exports = router;