'use strict'

const models = require('../models');
var middle_auth = require('../middlewares/auth');
var bcrypt = require('bcrypt');
const BCRYPT_SALT_ROUNDS = 10;

//Registrar usuario
exports.register = async function (data, profile_id = 2) {
    let user_data = {
        name: data.name,
        lastname: data.lastname,
        rut: data.rut,
        mail: data.mail,
        telephone: data.telephone,
        password: data.password,
        status: true,
        profile_id: profile_id //perfil id de cliente por defecto
    };

    return new Promise((resolve, reject) => {
        bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS).then(function (hashedPassword) {
            user_data.password = hashedPassword;

            models.User.findOrCreate({
                where: {
                    mail: user_data.mail,
                    $or: [
                        { rut: user_data.rut }
                    ]
                },
                defaults: user_data
            }).spread((user, created) => {
                if (created == true) {
                    resolve({ status: true, msg: "Usuario creado exitosamente." });
                } else {
                    resolve({ status: false, msg: "Usuario ya existe en nuestros registros." });
                }
            });
        }).catch(function (error) {
            console.log("Error");
            console.log(error);
            resolve({ status: false, msg: "Usuario ya existe en nuestros registros." });
        });
    });
}

//Cambiar contraseña
exports.change_password = async function (data) {
    let mail = data.mail;
    let old_pass = data.old_pass;
    let new_pass = data.new_pass;
    let new_pass_confirm = data.new_pass_confirm;

    if (new_pass !== new_pass_confirm) {
        return { status: false, msg: 'No coinciden las contraseñas' };
    } else {
        models.User.update({
            password: new_pass
        }, {
                where: {
                    mail: mail,
                    password: old_pass
                }
            })
            .then(function (rowsUpdated) {
                return { status: true, msg: 'Se actualizo correctamente' };
            })
            .catch(err => {
                return { status: false, code: 2 };
            });
    }
}

//Recuperar contraseña
exports.forgot_password = async function (email) {
    const sgMail = require('@sendgrid/mail');
    const random_hash = require('random-hash');

    let tmp_pass = random_hash.generateHash({ length: 20 });

    sgMail.setApiKey('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');
    const msg = {
        to: email,
        from: 'contacto@mdv.com',
        subject: 'Password provisoria MDV Express',
        text: 'Se ha generado una password provisoria para ingresar a tu cuenta : "' + tmp_pass + '" [No olvides cambiarla por una personalizada].',
    };

    let response = sgMail.send(msg);
    response.then(result => {
        models.User.update({
            password: tmp_pass
        }, {
                where: {
                    mail: email
                }
            })
            .then(function (rowsUpdated) {

            })
            .catch(err => {
                return res.json({ status: false, code: 2 })
            });

        return res.json({ status: true, msg: 'Correo enviado' });
    });

    response.catch(err => {
        console.log(err);
        return res.json({ status: false, msg: 'Error al enviar el correo' });
    });
}


exports.get_all_dt = async function (req = null) {
    const Op = models.Sequelize.Op;
    let start_pag = req.body.start;
    let limit_pag = req.body.length;
    let search = req.body.search ? req.body.search.value : null;

    let order_column = [];
    req.body.order.forEach(element => {
        let filter_column = req.body.columns[element.column].data;
        switch (filter_column) {
            case 'name':
                order_column.push(['name', element.dir]);
                break;
            case 'lastname':
                order_column.push(['lastname', element.dir]);
                break;
            default:
                break;
        }
    });

    let count_regs = await models.User.count();

    let users = await models.User.findAll({
        attributes: {
            include: ['id', 'name', 'lastname', [models.sequelize.col('Profile.id'), 'profile_id'], [models.sequelize.col('Profile.name'), 'profile_name']],
            exclude: ['rut', 'mail', 'telephone', 'password', 'created_at', 'updated_at']
        },
        offset: start_pag,
        limit: limit_pag,
        where: {
            status: true,
            [Op.or]: [
                {
                    name: {
                        [Op.like]: '%' + search + '%'
                    }
                }, {
                    lastname: {
                        [Op.like]: '%' + search + '%'
                    }
                }

            ]
        },
        order: order_column.length > 0 ? [order_column] : null,
        include: [
            {
                model: models.Profile,
                attributes: []
            }
        ],
        raw: true
    });

    return {
        data: users,
        draw: (count_regs / limit_pag),
        recordsFiltered: count_regs,
        recordsTotal: count_regs
    };
}

//Listar todos los usuarios.
exports.get_all = async function () {
    let users = await models.User.findAll();
    return users;
}

//Listar todos los usuarios.
exports.get_by_id = async function (user_id) {
    return await models.User.findOne({
        attributes: {
            include: ['id', 'name', 'lastname', [models.sequelize.col('Profile.id'), 'profile_id'], [models.sequelize.col('Profile.name'), 'profile_name']],
            exclude: ['password']
        },
        where: {
            id: user_id
        },
        include: [
            {
                model: models.Profile,
                attributes: []
            }
        ],
        raw: true
    });
}

exports.get_user_in_token = function (token) {
    let data_jwt = middle_auth.get_data_token(token);
    return data_jwt;
}

//Actualizar usuario.
exports.update = async function (data) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS).then(function (hashedPassword) {
            models.User.update({
                name: data.name,
                lastname: data.lastname,
                rut: data.rut,
                mail: data.mail,
                telephone: data.telephone,
                password: hashedPassword,
                profile_id: data.profile_id
            }, {
                where: {
                    id: data.id
                }
                }).then(function (rowsUpdated) {
                    resolve({ status: true, msg: 'Usuario actualizado correctamente' });
                }).catch(err => {
                    reject({ status: false, msg, err });
                });
        }).catch(function (error) {
            console.log("Error");
            console.log(error);
            resolve({ status: false, msg: "Error al actualizar el usuario." });
        });
    });
}

//Eliminar usuario.
exports.delete = async function (user_id) {
    console.log(user_id)
    return new Promise((resolve, reject) => {
        models.User.update({
            status: false
        }, {
                where: {
                    id: user_id
                }
            }).then(function (rowsUpdated) {
                resolve({ status: true, msg: 'Usuario deshabilitado correctamente' });
            })
            .catch(err => {
                reject({ status: false, msg, err });
            })
    });
}