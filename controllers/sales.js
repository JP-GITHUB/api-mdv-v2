'use strict'

var jwt = require('jsonwebtoken');
const models = require('../models');
var middle_auth = require('../middlewares/auth');

exports.new = async function (req) {
    let token = req.headers.authorization;
    let data = req.body;
    let transaction;
    let data_token = middle_auth.decode_token(token);    
    let total = 0;
    let arrProducts = [];
  
    try {
      
      transaction = await models.sequelize.transaction();
  
      let current_venta = await models.VENTA.create({
        rut_retiro: data_token.user.rut,
        nombre_retiro: data.nombre_retiro,
        descuento: 0,
        valor_final: total,
        estado: true,
        mediodepago_id: 1,
        comprobante_id: current_comp.id,
        usuario_id: data_token.user.id
      }, { transaction });
  
      let current_carrito = await models.CARRITO.create({
        valortotal: total,
        estado: true,
        venta_id: current_venta.id
      }, { transaction });
  
      data.products.forEach(element => {
        arrProducts.push({ producto_id: element.product_id })
      });
  
      await models.PRODUCTO_CARRITO.bulkCreate(bulk_prod, { transaction });
  
      await transaction.commit();
  
      res.json({status: true, msg: 'La venta fue guardada exitosamente'});
  
    } catch (err) {
      console.log(err)
      // Rollback transaction if any errors were encountered
      await transaction.rollback();
      res.json({status: false, msg: 'No se pudo registrar la venta'});
    }
}