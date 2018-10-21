'use strict';
module.exports = (sequelize, DataTypes) => {
    const Sucursal = sequelize.define('SUCURSAL', {
        nombre: DataTypes.STRING(80),
        direccion: DataTypes.STRING(50),
        telefono: DataTypes.STRING(12),
        estado: DataTypes.BOOLEAN
    }, {
        tableName: 'SUCURSAL',
        underscored: true
    });
    Sucursal.associate = function(models) {
        Sucursal.hasMany(models.COLEGIO, { foreignKey: 'sucursal_id' })
    };
    return Sucursal;
};