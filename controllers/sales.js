'use strict'

const models = require('../models');
var middle_auth = require('../middlewares/auth');

exports.new = async function (req) {
  let token = req.headers.authorization;
  let data_token = middle_auth.get_data_token(token);

  let transaction;
  let data = req.body;

  let arrProducts = [];

  try {
    transaction = await models.sequelize.transaction();

    if(!data.products){
      throw new Error('Sin productos para realizar la venta.')
    }

    let new_cart = await models.Shoppingcart.create({
      totalvalue: data.totalValue,
      status: true
    }, { transaction });

    data.products.forEach(element => {
      let tmp_quantity = 0;
      for (let index = 0; index < element.sizes.length; index++) {
        const internalElement = element.sizes[index];
        tmp_quantity += internalElement.quantity;
      }

      arrProducts.push({ product_id: element.productId, shoppingcart_id: new_cart.id, shop_quantity: tmp_quantity })
    });

    await models.ProductCart.bulkCreate(arrProducts, { transaction });

    
    let new_sale = await models.Sale.create({
      rut_retirement: data.rut,
      name_retirement: data.firstName + " " + data.lastName,
      discount: 0,
      final_value: data.totalValue,
      status: true,
      payment_method_id: 1,
      shoppingcart_id: new_cart.id,
      user_id: data_token.user.id
    }, { transaction });

    await transaction.commit();

    return { status: true, msg: 'La venta fue realizada exitosamente' };

  } catch (err) {
    console.log(err);
    await transaction.rollback();
    return { status: false, msg: 'La venta no pudo ser realizada exitosamente' };
  }
}