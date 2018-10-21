'use strict';
module.exports = (sequelize, DataTypes) => {
    const Venta = sequelize.define('VENTA', {
        rut_retiro: DataTypes.STRING(12),
        nombre_retiro: DataTypes.STRING(80),
        descuento: DataTypes.INTEGER,
        valor_final: DataTypes.INTEGER,
        estado: DataTypes.BOOLEAN
    }, {
        tableName: 'VENTA',
        underscored: true 
    });
    
    Venta.associate = function (models) {
        Venta.belongsTo(models.COMPROBANTE, { foreignKey: 'comprobante_id' });
    };
    return Venta;
};