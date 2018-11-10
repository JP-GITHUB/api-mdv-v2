'use strict'

const models = require('../models');

//Crear carro de compra
exports.new = async function(data) {
    let shopingcart_data = {
        product_id: data.product,
        price: data.price,
        totalitem: data.totalitem,
        totalvalue: data.totalvalue,
        status: true
    };
    //añadir producto a carro
    return new Promise((resolve, reject) => {
        var cartitem = [product_id];
        models.product.findById(product_id).then((price) => {


        })

    })
}