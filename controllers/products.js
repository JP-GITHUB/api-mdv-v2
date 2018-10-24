'use strict'

var jwt = require('jsonwebtoken');
const models = require('../models');

exports.get_all = async function () {
    let product = await models.Product.findAll();

    //mientras no filtro por el status del Product pues asumo que mejor traer todo y filtrar en la vista
    if (product === null) {
        return {
            status: false,
            msg: 'no hay productos para mostrar'
        };
    }

    return {
        status: true,
        obj: product
    };
}

exports.update = function (data) {
    models.Product.update(
        {
            name: data.name,
            description: req.bode.description,
            price: data.price,
        }, {
            where: {
                id: data.id
            }
        }
    )
        .then(function (rowsUpdated) {
            return rowsUpdated;
        })
        .catch(next)

    return {};
}

exports.update_quantity = async function (data) {
    models.Product.update(
        {
            quantity: data.quantity
        }, {
            where: {
                id: data.id
            }
        }
    )
        .then(function (rowsUpdated) {
            return rowsUpdated;
        })
        .catch(next)

    return {};
}

exports.new = async function (data) {
    models.Product.create(
        {
            name: data.name,
            description: req.bode.description,
            price: data.price,
            quantity: 0,
            status: true
        }
    )
        .then(function (rowCreated) {
            return rowCreated;
        })
        .catch(next)

    return {};;
}

exports.delete = async function (product_id) {
    models.Product.update(
        { status: 0 }, {
            where: {
                id: product_id
            }
        }
    )
        .then(function (rowsUpdated) {
            return rowsUpdated;
        })
        .catch(next)

    return {};
}