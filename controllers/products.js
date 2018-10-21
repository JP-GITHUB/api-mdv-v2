'use strict'

var jwt = require('jsonwebtoken');
const models = require('../models');

exports.get_all = async function () {
    let productos = await models.PRODUCTO.findAll();

    //mientras no filtro por el estado del producto pues asumo que mejor traer todo y filtrar en la vista
    if (productos === null) {
        return {
            status: false,
            msg: 'no hay productos para mostrar'
        };
    }

    return {
        status: true,
        obj: productos
    };
}

exports.update = function (data) {
    models.PRODUCTO.update(
        {
            nombre: data.nombre,
            descripcion: req.bode.descripcion,
            talla: data.talla,
            precio: data.precio,
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
    models.PRODUCTO.update(
        {
            cantidad: data.cantidad
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
    models.PRODUCTO.create(
        {
            nombre: data.nombre,
            descripcion: req.bode.descripcion,
            talla: data.talla,
            precio: data.precio,
            cantidad: 0,
            estado: true
        }
    )
        .then(function (rowCreated) {
            return rowCreated;
        })
        .catch(next)

    return {};;
}

exports.delete = async function (product_id) {
    models.PRODUCTO.update(
        { estado: 0 }, {
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