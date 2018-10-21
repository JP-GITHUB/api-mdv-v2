'use strict';
module.exports = (sequelize, DataTypes) => {
    const MedioDePago = sequelize.define('MEDIO_DE_PAGO', {
        tipo_mp: DataTypes.STRING(50),
        estado: DataTypes.BOOLEAN
    }, {
        tableName: 'MEDIO_DE_PAGO',
        underscored: true
    });
    MedioDePago.associate = function(models) {
        MedioDePago.hasMany(models.VENTA, {foreignKey:'mediodepago_id'})
    };
    return MedioDePago;
};