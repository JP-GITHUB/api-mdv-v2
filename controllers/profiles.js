'use strict'

var jwt = require('jsonwebtoken');
const models = require('../models');

//Obtener todos los perfiles.
exports.get_all = async function () {
    let Profiles = await models.Profile.findAll();
    return { data: Profiles };
}

//Crear nuevo perfil.
exports.new = function (name) {

    return new Promise((resolve, reject) => {
        models.Profile.findOrCreate({
            where: {
                name: name,
                status: true
            },
            defaults: name
        }).spread((name, created) => {
            if (created == true) {
                resolve({ status: true, msg: "El perfil ha sido creado." });
            } else {
                resolve({ status: false, msg: "Perfil ya existe." });
            }
        });
    });
}

//Actualizar perfil.
exports.update = function (profile_id, name) {
    models.Profile.update(
        { name: name }, {
            where: {
                id: profile_id
            }
        }
    )
        .then(function (rowsUpdated) {
            return rowsUpdated;
        })
        .catch(next)

    return {};
}

//Eliminar perfil
exports.delete = async function (profile_id) {
    models.Profile.update(
        { status: 0 }, {
            where: {
                id: profile_id
            }
        }
    )
        .then(function (rowsUpdated) {
            return rowsUpdated;
        })
        .catch(next)

    return {};
}