'use strict'

var jwt = require('jsonwebtoken');
const models = require('../models');

//Listar productos
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
            msg: 'No hay productos para mostrar.'
        };
    }

    return {
        status: true,
        obj: product
    };
}

//Listar productos por colegio
exports.get_by_school = async function (school_id) {
    let product = await models.Product.findAll({
        where:
        {
            school_id: school_id,
            status: true
        },
        include: [
            {
                model: models.Gender
            },
            {
                model: models.ProductSize
            }
        ]
    });

    product.forEach(element => {
        let item;
        let data = element.ProductSizes;
        let arr_prices = [];
        for (item in data) {
            arr_prices.push(data[item].price);
        }

        element.dataValues['min_price'] = Math.min.apply(null, arr_prices);
        element.dataValues['max_price'] = Math.max.apply(null, arr_prices);
    });

    if (product === null || product.length == 0) {
        return {
            status: false,
            msg: 'No hay productos para mostrar.'
        };
    }

    return {
        status: true,
        obj: product
    };
}

//Actualizar producto.
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

//Actualizar cantidad de producto.
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

//Crear producto.
exports.new = async function (data) {
    let product_data = {
        name: data.name,
        description: data.description,
        status: true
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
                resolve({ status: false, msg: "El produto ya existe en la base de datos." });
            }
        });
    });
}

//Eliminar producto.
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