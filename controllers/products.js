'use strict'

var jwt = require('jsonwebtoken');
const models = require('../models');
const DIR_UPLOADS_IMAGES = '/uploads/images/';

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

//productos para cargar el dtt
exports.get_all_dt = async function () {
    let products = await models.Product.findAll({
        attributes: ['id', 'name', 'description', 'status'],
        include:
            [
                { model: models.School },
                { model: models.Gender }
            ]
    });

    let count_regs = products.length;

    return {
        data: products,
        draw: 0,
        recordsFiltered: count_regs,
        recordsTotal: count_regs
    };
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
    return new Promise((resolve, reject) => {
        models.Product.update({
            name: data.name,
            description: data.description,
            gender_id: data.gender_id,
            school_id: data.school_id
        }, {
                where: {
                    id: data.id
                }
            }).then(function (rowsUpdated) {
                resolve({ status: true, msg: 'Producto actualizado correctamente' });
            }).catch(err => {
                reject({ status: false, msg, err });
            });
    });
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
exports.new = async function (obj, files) {
    let err_image_uploads = [];
    let images = null;
    let data = JSON.parse(obj.data);

    let product_data = {
        name: data.name,
        description: data.description,
        status: true,
        school_id: data.school,
        gender_id: data.gender
    };

    if (files != null) {
        images = files.images;
    }

    return new Promise((resolve, reject) => {
        models.Product.findOrCreate({
            where: {
                name: data.name,
                status: true
            },
            defaults: product_data
        }).spread((product, created) => {
            if (created == true) {
                /** Despues de crear el producto agregaremos las imagenes que fueron seleccionadas. */
                if (images instanceof Array) {
                    images.forEach(element => {
                        let full_path = DIR_UPLOADS_IMAGES + element.name;
                        element.mv('.' + full_path, function (err) {
                            if (err) {
                                console.log(err);
                                err_image_uploads.push({ name: element.name, msg: 'Error al subir la imagen', err: err });
                            }

                            insertProductImage(full_path, product.id);
                        });
                    });
                } else {
                    let full_path = DIR_UPLOADS_IMAGES + images.name;
                    images.mv('.' + full_path, function (err) {
                        if (err) {
                            console.log(err);
                            err_image_uploads.push({ name: images.name, msg: 'Error al subir la imagen', err: err });
                        }

                        insertProductImage(full_path, product.id);
                    });
                }

                resolve({ status: true, msg: "Producto creado." });
            } else {
                reject({ status: false, msg: "El produto ya existe en la base de datos." });
            }
        });
    });
}

async function insertProductImage(full_path, product_id) {
    try {
        let result = await models.ProductImage.create({
            location: full_path,
            status: true,
            product_id: product_id
        });

        if (result) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
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