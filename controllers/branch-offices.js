'use strict'

const models = require('../models');

//Registrar sucursal
exports.register = async function() {
    let branchOffice_data = {
        name: data.name,
        location: data.location,
        telephone: data.telephone,
        status: true
    };

    return new Promise((resolve, reject) => {
        models.BranchOffice.findOrCreate({
            where: {
                name: branchOffice_data.name,
            },
            defaults: branchOffice_data
        }).spread((BranchOffice, created) => {
            if (created == true) {
                resolve({ status: true, msg: "Sucursal creada exitosamente." });
            } else {
                resolve({ status: false, msg: "Sucursal ya existe en nuestros registros." });
            }
        });
    });
}

exports.get_all_dt = async function() {
    let branchOffices = await models.BranchOffice.findAll({
        attributes: ['name', 'location','telephone','id',],        
    });

    let count_regs = branchOffices.length;

    return {
        data: branchOffices,
        draw: 0,
        recordsFiltered: count_regs,
        recordsTotal: count_regs
    };
}

//Listar todas las sucursales.
exports.get_all = async function() {
    let branchOffices = await models.BranchOffice.findAll();
    return branchOffices;
}

//Listar una sucursal.
exports.get_by_id = async function(branchOffice_id) {
    return await models.BranchOffice.findOne({
        where: {
            id: branchOffice_id
        }
    });
}

//Actualizar sucursal.
exports.update = async function(data) {
    return new Promise((resolve, reject) => {
        models.BranchOffice.update({
            name: data.name,
            location: data.location,
            telephone: data.telephone
        }, {
            where: {
                id: data.id
            }
        }).then(function(rowsUpdated) {
            resolve({ status: true, msg: 'Sucursal actualizada correctamente' });
        }).catch(err => {
            reject({ status: false, msg, err });
        });
    });
}

//Eliminar sucursal.
exports.delete = async function(branchOffice_id) {
    console.log(user_id)
    return new Promise((resolve, reject) => {
        models.BranchOffice.update({
                status: false
            }, {
                where: {
                    id: branchOffice_id
                }
            }).then(function(rowsUpdated) {
                resolve({ status: true, msg: 'Sucursal deshabilitada correctamente' });
            })
            .catch(err => {
                reject({ status: false, msg, err });
            })
    });
}