'use strict'

var jwt = require('jsonwebtoken');
const models = require('../models');

exports.get_all = async function () {
    let perfiles = await models.PERFIL.findAll();
    return { data: perfiles };
}

exports.update = function (profile_id, name) {
    models.PERFIL.update(
        { nombre: name }, {
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

exports.new = async function (name) {
    models.PERFIL.create(
        {
            nombre: name,
            estado: true
        }
    )
        .then(function (rowCreated) {
            return rowCreated;
        })
        .catch(next)

    return {};
}

exports.delete = async function (profile_id) {
    models.PERFIL.update(
        { estado: 0 }, {
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