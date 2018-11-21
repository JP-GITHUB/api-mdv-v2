'use strict'

var jwt = require('jsonwebtoken');
const models = require('../models');

//existencias para cargar el dtt
exports.get_all_dt = async function () {
    let existances = await models.ProductSize.findAll({
        attributes: ['price', 'quantity', 'product_id', 'size_id'],
        include:
            [
                { model: models.Product },
                { model: models.Size }
            ]
    });

    let count_regs = existances.length;

    return {
        data: existances,
        draw: 0,
        recordsFiltered: count_regs,
        recordsTotal: count_regs
    };
}

//Actualizar existencia.
exports.update = function (data) {
    return new Promise((resolve, reject) => {
        models.ProductSize.update({
            price: data.name,
            quantity: data.description,
             
        }, {
                where: {
                    product_id: data.product_id,
                    size_id: data.size_id
                }
            }).then(function (rowsUpdated) {
                resolve({ status: true, msg: 'Producto actualizado correctamente' });
            }).catch(err => {
                reject({ status: false, msg, err });
            });
    });
}


//Crear existencia.
exports.new = async function (data) {
    let existance_data = {
        price: data.name,
        quantity: data.description,
        product_id: data.product_id,
        size_id: data.size_id,
    };

    return new Promise((resolve, reject) => {
        models.ProductSize.findOrCreate({
            where: {
                product_id: data.product_id,
                size_id: data.size_id
            },
            defaults: existance_data
        }).spread((name, created) => {
            if (created == true) {
                resolve({ status: true, msg: "Producto creado." });
            } else {
                reject({ status: false, msg: "El produto ya existe en la base de datos." });
            }
        });
    });
}
