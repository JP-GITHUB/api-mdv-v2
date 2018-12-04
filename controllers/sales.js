'use strict'

var jwt = require('jsonwebtoken');
const models = require('../models');
const middle_auth = require('../middlewares/auth');
const ctr_payments = require('../controllers/payments');

async function get_product_quantity(product_id, size_id) {
  let product = await models.Product.findOne({
    attributes: ['id', 'status'],
    where: {
      id: product_id
    },
    include: [{
      model: models.ProductSize,
      attributes: ['quantity'],
      where: {
        product_id: product_id,
        size_id: size_id
      }
    }],
    raw: true
  });

  return product['ProductSizes.quantity'];
}

exports.new = async (req) => {
  let token = req.headers.authorization;
  let data_token = middle_auth.get_data_token(token);
  let code = Math.random().toString(36).substr(2, 4);;
  let transaction;
  let data = req.body;

  let arrProducts = [];
  let total = 0;

  let err_msg = null;

  try {
    transaction = await models.sequelize.transaction();

    if (!data.products) {
      err_msg = 'Sin productos para realizar la venta.';
      throw new Error(err_msg);
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

    data.products.forEach((element) => {
      let tmp_quantity = 0;
      for (let index = 0; index < element.sizes.length; index++) {
        const internalElement = element.sizes[index];
        tmp_quantity += internalElement.quantity;

        get_product_quantity(element.productId, internalElement.sizeId)
          .then(result_quantity => {
            if (result_quantity > 0) {
              let rest = result_quantity - internalElement.quantity;

              models.ProductSize.update({
                quantity: rest
              }, {
                  where: {
                    product_id: element.productId,
                    size_id: internalElement.sizeId
                  }
                }, transaction);

              console.log('Reduccion existencia: prod_id -> ' + element.productId + " - size_id -> " + internalElement.sizeId + " - resto -> " + rest);
            }
          });
      }

      arrProducts.push({
        product_id: element.productId,
        shoppingcart_id: new_cart.id,
        shop_quantity: tmp_quantity
      });
    });

    await models.ProductCart.bulkCreate(arrProducts, { transaction });

    let pay_generated = await ctr_payments.generate('Confecciones Margarita del Villar', total);
    let payment_id = null;
    if (!pay_generated.status) {
      err_msg = 'Error al generar el pago.';
      throw new Error(err_msg);
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
    return { status: false, msg: err_msg ? err_msg : 'La venta no pudo ser realizada exitosamente' };
  }
}

exports.get_by_code = (code) => {
  return models.Sale.findOne({
    attributes: ['name_retirement', 'rut_retirement', 'final_value', 'shoppingcart_id', 'delivered', 'payment_status'],
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

exports.get_by_user_email = (email) => {
  return models.User.findOne({
    attributes: ['id', 'name', 'lastname'],
    where: {
      mail: email
    },
    include: [
      { model: models.Sale }
    ]
  });
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

exports.sale_cancel = async (sale_id) => {
  try {
    let update_sale = await models.Sale.update({
      status: false
    },
      {
        where: {
          id: sale_id
        }
      });

    return {
      status: true,
      data: update_sale
    }
  } catch (error) {
    return {
      status: true,
      error: error
    }
  }
}