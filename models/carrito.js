'use strict';
module.exports = (sequelize, DataTypes) => {
    const Carrito = sequelize.define('CARRITO', {
        valortotal: DataTypes.INTEGER,
        estado: DataTypes.BOOLEAN
    }, {
        tableName: 'CARRITO',
        underscored: true
    });
    
    Carrito.associate = function (models) {
        Carrito.belongsTo(models.VENTA, { foreignKey: 'venta_id' });
        Carrito.belongsToMany(models.PRODUCTO, { through: models.PRODUCTO_CARRITO, foreignKey: 'carrito_id', contraints: true });
    };
    return Carrito;
};