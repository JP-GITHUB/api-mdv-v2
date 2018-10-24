'use strict'

var jwt = require('jsonwebtoken');
const models = require('../models');

exports.get_all = async function () {
    let Profiles = await models.Profile.findAll();
    return { data: Profiles };
}

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

exports.new = async function (name) {
    models.Profile.create(
        {
            name: name,
            status: true
        }
    )
        .then(function (rowCreated) {
            return rowCreated;
        })
        .catch(next)

    return {};
}

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