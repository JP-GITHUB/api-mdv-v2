'use strict';
module.exports = (sequelize, DataTypes) => {
    const Contacto = sequelize.define('CONTACTO', {
        nombre: DataTypes.STRING(80),
        appat: DataTypes.STRING(20),
        apmat: DataTypes.STRING(20),
        telefono: DataTypes.STRING(12),
        email: DataTypes.STRING(50),
        estado: DataTypes.BOOLEAN
    }, {
        tableName: 'CONTACTO',
        underscored: true
    });
    Contacto.associate = function (models) {

    };
    return Contacto;
};