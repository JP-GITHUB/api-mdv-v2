'use strict'

var userDB = require('../models/user');
var jwt = require('jsonwebtoken');
const models = require('../models');
var bcrypt = require('bcrypt');

exports.login = async function (mail, password) {

    let user = await models.User.findOne({
        attributes: ['id', 'name', 'lastname', 'rut', 'mail', 'status', 'profile_id', 'password'],
        where: {
            mail: mail
        }
    });
    
    const match = await bcrypt.compare(password, user.password);
    
        if (!match) {
            return { status: false, msg: 'Las credenciales son inválidas' };
        } else {
            if (user.estado == false) {
                return { status: false, msg: 'El usuario se encuentra en estado deshabilitado' };
            }
        }

    let tmp_user = {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        rut: user.rut,
        mail: user.mail,
        status: user.status,
        profile_id: user.profile_id
    }



    let profile = await models.Profile.findOne({
        include: [{
            model: models.Permission,
            attributes: ['id', 'name']
        }]
    });

    let permissions = await profile.Permissions || [];

    if (user === null) {
        return { status: false, msg: 'Las credenciales son inválidas' };
    } else {
        if (user.estado == false) {
            return { status: false, msg: 'El usuario se encuentra en estado deshabilitado' };
        }
    }

    var tokenData = {
        mail: mail,
        user: tmp_user,
        profile_permission: profile
    }

    var token = jwt.sign(tokenData, 'estoesultrasecreto', {
        expiresIn: 60 * 60 * 24 // expires in 24 hours
    })

    return {
        status: true,
        token: token,
        user_data: tmp_user,
        permissions: permissions
    };
}