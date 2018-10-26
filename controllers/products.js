'use strict'

var jwt = require('jsonwebtoken');
const models = require('../models');

exports.get_all = async function () {
    let product = await models.Product.findAll(
        {
            where:
            {
                status: true,
            }
        }
    )

    if (product === null || product.length == 0) {
        return {
            status: false,
            msg: 'No hay productos para mostrar'
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