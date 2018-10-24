'use strict'

var jwt = require('jsonwebtoken');
const models = require('../models');

exports.login = async function(mail, password) {
    let user = await models.User.findOne({
        attributes: ['id', 'name', 'lastname', 'rut', 'mail', 'status'],
        where: {
            mail: mail,
            password: password
        },
        include: [{
            model: models.Profile,
            attributes: ['id', 'name']
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
        mail: mail,
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