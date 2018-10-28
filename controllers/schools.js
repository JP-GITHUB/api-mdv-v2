'use strict'

const models = require('../models');

//Listar colegios
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
}//falta filtro


//Crear colegio
exports.new = function (data) {
    let school_data = {
        name: data.name,
        rut: data.rut,
        location: data.location,
        telephone: data.telephone,
        status: true
    };

    return new Promise((resolve, reject) => {
        models.School.findOrCreate({
            where: {
                name: school_data.name,
                $or: [
                    { rut: school_data.rut }
                ]
            },
            defaults: school_data
        }).spread((name, created) => {
            if (created == true) {
                resolve({ status: true, msg: "Colegio creado exitosamente" });
            } else {
                resolve({ status: false, msg: "El colegio ya se encuentra registrado" });
            }
        });
    });
}