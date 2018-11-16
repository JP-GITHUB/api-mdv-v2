'use strict'

var jwt = require('jsonwebtoken');
const models = require('../models');

//Listar productos
exports.get_all = async function () {
    let product = await models.Product.findAll({
        where: {
            status: true,
        }
    })

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
        attributes: ['id', 'name', 'description'],
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
                model: models.ProductSize,
                attributes: ['quantity', 'price'],
                include: [{
                    model: models.Size,
                    attributes: ['id', 'description']
                }]

            },
            {
                model: models.ProductImage 
            }
        ]
    });

    console.log(product);
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

    return {
        status: true,
        obj: product
    }
}

//Listar precios de producto p de menor a mayor (por validar)
exports.get_by_product_price = async function (req, res) {
    let product_id = req.params.product_id
    product
        .findById(product_id).then((price) => {
            var minval, maxval = price
            for (var val = 0; val < price; val += 1) {
                if (price[val] < price) {
                    minval = price[val]
                }
                if (price[val] > price) {
                    maxval = price[val]
                }
            }
            res({
                minval,
                maxval
            })
                .catch(handleError1.bind(this, res));
        });

    return {
        status: true,
        obj: res
    };

}

function handleError1(res, e) {
    res
    if (product === null || product.length == 0) {
        return {
            status: false,
            msg: 'No hay valores para mostrar.'
        };
    }

}
//Ver disponibilidad de productos (por validar)
exports.prod_availability = async function (res, req) {
    var shopp_quantity;
    let product_id = req.params.product_id
    product
        .findById(product_id).then((quantity) => {
            if (quantity === null || quantity == 0) {
                if (shopp_quantity > quantity) {
                    return {
                        status: false,
                        msg: '(No disponible)'
                    };
                }
            } else {
                return {
                    status: true,
                    msg: '(Disponible)'
                };
            }
        })
        .catch(handleError2.bind(this, res));
}

function handleError2(res, e) {
    res
    return {
        status: false,
        msg: 'Ha ocurrido un error'
    };

}


//Actualizar producto.
exports.update = function (data) {
    models.Product.update({
        name: data.name,
        description: req.bode.description,
        price: data.price,
    }, {
            where: {
                id: data.id
            }
        })
        .then(function (rowsUpdated) {
            return rowsUpdated;
        })
        .catch(next)

    return {};
}

//Actualizar cantidad de producto.
exports.update_quantity = async function (data) {
    models.Product.update({
        quantity: data.quantity
    }, {
            where: {
                id: data.id
            }
        })
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
    models.Product.update({ status: 0 }, {
        where: {
            id: product_id
        }
    })
        .then(function (rowsUpdated) {
            return rowsUpdated;
        })
        .catch(next)

    return {};
}