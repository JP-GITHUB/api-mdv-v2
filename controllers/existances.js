'use strict'

var jwt = require('jsonwebtoken');
const models = require('../models');

//existencias para cargar el dtt
exports.get_all_dt = async function () {
    let existances = await models.Product.findAll({
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
        models.Product.update({
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
    let product_data = {
        name: data.name,
        description: data.description,
        status: true,
        school_id: data.school,
        gender_id: data.gender
    };

    return new Promise((resolve, reject) => {
        models.Product.findOrCreate({
            where: {
                name: data.name,
                status: true
            },
            defaults: product_data
        }).spread((name, created) => {
            if (created == true) {
                resolve({ status: true, msg: "Producto creado." });
            } else {
                reject({ status: false, msg: "El produto ya existe en la base de datos." });
            }
        });
    });
}

//Eliminar producto.
exports.delete = async function (product_id) {

    return new Promise((resolve, reject) => {
        models.Product.update({ status: 0 }, {
            where: {
                id: product_id
            }
        })
            .then(function (rowsUpdated) {
                resolve({ status: true, msg: "Producto Eliminado." })
            })
            .catch(function (err) {

                reject({ status: false, msg: "Error al eliminar producto." });
            });
    });
}

exports.getGender = async function () {
    let gender = await models.Gender.findAll({
    })

    if (gender === null || gender.length == 0) {
        return {
            status: false,
            msg: 'No hay productos para mostrar.'
        };
    }

    return {
        status: true,
        obj: gender
    };
}