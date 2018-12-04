'use strict'

var jwt = require('jsonwebtoken');
const models = require('../models');

//existencias para cargar el dtt
exports.get_all_dt = async function (req) {
    const Op = models.Sequelize.Op;
    let start_pag = req.body.start;
    let limit_pag = req.body.length;
    let search = req.body.search ? req.body.search.value : null;

    let order_column = [];
    req.body.order.forEach(element => {
        let filter_column = req.body.columns[element.column].data;
        switch (filter_column) {
            case 'Product.name':
                order_column.push([models.Product, 'name', element.dir]);
                break;
            case 'Size.description':
                order_column.push([models.Size, 'description', element.dir]);
                break;            
            default:
                break;
        }
    });

    let count_regs = await models.ProductSize.count();

    let existances = await models.ProductSize.findAll({
        attributes: ['price', 'quantity', 'product_id', 'size_id'],
        offset: start_pag,
        limit: limit_pag,
        include:
            [
                { model: models.Product, where: {
                    name: {
                        [Op.like]: '%' + search + '%'
                    }
                } },
                { model: models.Size}
            ],
            order: [order_column]
    });

    return {
        data: existances,
        draw: (count_regs / limit_pag),
        recordsFiltered: count_regs,
        recordsTotal: count_regs
    };
}

//Actualizar existencia.
exports.update = function (data) {
    return new Promise((resolve, reject) => {
        models.ProductSize.update({
            price: data.price,
            quantity: data.quantity,
             
        }, {
                where: {
                    product_id: data.productId,
                    size_id: data.sizeId
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
        price: data.price,
        quantity: data.quantity,
        product_id: data.product,
        size_id: data.size,        
    };

    return new Promise((resolve, reject) => {
        models.ProductSize.findOrCreate({
            where: {
                product_id: data.product,
                size_id: data.size
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

exports.get_sizes = async function () {
    let sizes = await models.Size.findAll()
    if (sizes === null || sizes.length == 0) {
        return {
            status: false,
            msg: 'No hay tallas'
        };
    }
    return {
        status: true,
        obj: sizes
    }
}
