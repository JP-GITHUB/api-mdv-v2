'use strict'

var jwt = require('jsonwebtoken');
const models = require('../models');

exports.get_all = async function () {
    let Profiles = await models.Profile.findAll();
    return { data: Profiles };
}


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
                resolve({ status: false, msg: "Perfil ya existe" });
            }
        });
    });
}


//     if (result) {
//         return { status: true, msg: "El perfil ha sido creado." };

//     } else {
//         return { status: false, msg: "No ha sido posible crear el perfil." }
//     }
// } catch (error) {
//     console.log(error)
//     return { msg: "Error" }
// }


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