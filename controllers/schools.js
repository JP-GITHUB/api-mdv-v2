'use strict'

const models = require('../models');

exports.get_all = async function () {
    let schools = await models.School.findAll(
        {
            where:
            {
                status: true,
            }
        }
    )

    if (schools === null || schools.length == 0) {
        return {
            status: false,
            msg: 'No hay colegios que mostrar'
        };
    }

    return {
        status: true,
        obj: schools
    };
}
//falta filtro