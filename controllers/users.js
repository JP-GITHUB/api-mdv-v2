'use strict'

const models = require('../models');

exports.register = async function (data) {
    let user_data = {
        nombre: data.nombre,
        apellido: data.apellido,
        rut: data.run,
        mail: data.mail,
        telefono: data.telefono,
        password: data.password,
        estado: true,
        perfil_id: 3
    };

    if (user_data.nombre == "" || user_data.apellido == "" || user_data.rut == "" || user_data.mail == "" || user_data.telefono == "" || user_data.password == "") {
        return {
            status: false
        };
    };

    if (user_data.password != data.rptpassword) {
        return {
            status: false
        };
    };

    models.USUARIO
        .findOrCreate({
            where: {
                mail: user_data.mail,
                $or: [
                    { rut: user_data.rut }
                ]
            },
            defaults: user_data
        })
        .spread((user, created) => {
            if (created == true) {
                return { status: true, msg: "Usuario creado exitosamente" };
            } else {
                return { status: false, msg: "Usuario ya existe en nuestros registros" };
            }
        });
}

exports.change_password = async function (data) {
    let mail = data.mail;
    let old_pass = data.old_pass;
    let new_pass = data.new_pass;
    let new_pass_confirm = data.new_pass_confirm;

    if (new_pass !== new_pass_confirm) {
        return { status: false, msg: 'No coinciden las contraseñas' };
    } else {
        models.USUARIO.update({
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
        models.USUARIO.update({
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

exports.get_all = async function () {
    let usuarios = await models.USUARIO.findAll();
    return { data: usuarios };
}

exports.update = async function (data) {
    models.USUARIO.update({
        nombre: data.nombre,
        apellido: data.apellido,
        rut: data.rut,
        mail: data.mail,
        telefono: data.telefono,
        password: data.password,
        perfil_id: data.perfil
    }, {
            where: {
                id: data.id
            }
        }
    ).then(function (rowsUpdated) {
        return rowsUpdated;
    }).catch(err => {
        return { status: false, msg, err };
    });
}

exports.delete = async function (user_id) {
    models.USUARIO.update({
        estado: 0
    },
        {
            where: {
                id: user_id
            }
        })
        .then(function (rowsUpdated) {
            return rowsUpdated;
        })
        .catch(next)

    return {};
}