'use strict'

var jwt = require('jsonwebtoken');
const models = require('../models');

exports.login = async function (email, password) {
    let user = await models.USUARIO.findOne({
        attributes: ['id', 'nombre', 'apellido', 'rut', 'mail', 'estado'],
        where: {
            mail: email,
            password: password
        },
        include: [{
            model: models.PERFIL,
            attributes: ['id', 'nombre']
        }]
    });

    if (user === null) {
        return { status: false, msg: 'Las credenciales son inválidas' };
    } else {
        if (user.estado == false) {
            return { status: false, msg: 'El usuario se encuentra en estado deshabilitado' };
        }
    }

    var tokenData = {
        email: email,
        user: user
    }

    var token = jwt.sign(tokenData, 'estoesultrasecreto', {
        expiresIn: 60 * 60 * 24 // expires in 24 hours
    })

    return {
        status: true,
        token: token,
        user_data: user
    };
}