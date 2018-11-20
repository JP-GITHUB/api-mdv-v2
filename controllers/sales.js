'use strict'

var jwt = require('jsonwebtoken');
const models = require('../models');
const middle_auth = require('../middlewares/auth');
const ctr_payments = require('../controllers/payments');

exports.new = async (req) => {
  let token = req.headers.authorization;
  let data_token = middle_auth.get_data_token(token);
  let code = Math.random().toString(36).substr(2, 4);;
  let transaction;
  let data = req.body;

  let arrProducts = [];
  let total = 0;

  try {
    transaction = await models.sequelize.transaction();

    if (!data.products) {
      throw new Error('Sin productos para realizar la venta.')
    }

    /** Get totals */
    data.products.forEach(element => {
      for (let index = 0; index < element.sizes.length; index++) {
        const internalElement = element.sizes[index];
        total += (internalElement.quantity * internalElement.price)
      }
    });

    // TODO: Validar nan

    let new_cart = await models.Shoppingcart.create({
      totalvalue: total,
      status: true
    }, { transaction });

    code = code + new_cart.id;

    data.products.forEach(element => {
      let tmp_quantity = 0;
      for (let index = 0; index < element.sizes.length; index++) {
        const internalElement = element.sizes[index];
        tmp_quantity += internalElement.quantity;
      }

      arrProducts.push({ product_id: element.productId, shoppingcart_id: new_cart.id, shop_quantity: tmp_quantity })
    });

    await models.ProductCart.bulkCreate(arrProducts, { transaction });


    let pay_generated = await ctr_payments.generate('Teste!', total);
    let payment_id = null;
    if (!pay_generated.status) {
      throw new Error('Error al generar el pago.');
    } else {
      payment_id = pay_generated.obj.payment_id;
    }

    await models.Sale.create({
      rut_retirement: data.rut,
      name_retirement: data.firstName + " " + data.lastName,
      discount: 0,
      final_value: total,
      status: true,
      payment_status: 0, // 0 Pendiente de pago, 1 Pagada, 2 rechazada
      payment_method_id: 1,
      payment_id: payment_id,
      code: code,
      delivered: false,
      shoppingcart_id: new_cart.id,
      user_id: data_token.user.id
    }, { transaction });

    await transaction.commit();

    return {
      status: true,
      msg: 'La venta fue realizada exitosamente',
      retirement_code: code,
      payment_id: pay_generated.obj.payment_id,
      transfer_url: pay_generated.obj.transfer_url
    };

  } catch (err) {
    console.log(err);
    await transaction.rollback();
    return { status: false, msg: 'La venta no pudo ser realizada exitosamente' };
  }
}

exports.get_by_code = (code) => {
  return models.Sale.findOne({
    attributes: ['name_retirement', 'rut_retirement', 'final_value', 'shoppingcart_id', 'delivered'],
    where: {
      code: code
    },
    include: [{
      attributes: ['id'],
      model: models.Shoppingcart,
      include: [
        {
          attributes: ['id', 'name', 'description'],
          model: models.Product
        }
      ]
    }]
  })
}

exports.deliver = async (code) => {
  let exist = await models.Sale.findOne({
    where: {
      code: code,
      delivered: true
    }
  });

  if (exist) {
    return { status: false, msg: 'Producto ya se encuentra entregado' }
  } else {
    let result = await models.Sale.update({
      delivered: true
    },
      {
        where: { code: code }
      });

    if (result) {
      return { status: true, msg: 'Se registro la entrega correctamente.' };
    } else {
      return { status: false, msg: 'Hubo un problema al registrar la entega.' }
    }
  }
}

exports.confirm_sale = async (data) => {
  try {
    let result = await models.Sale.update({
      payment_status: 1
    }, {
        where: {
          payment_id: data.payment_id
        }
      });

    if (result) {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}