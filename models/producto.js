'use strict';
module.exports = (sequelize, DataTypes) => {
    const Producto = sequelize.define('PRODUCTO', {
        nombre: DataTypes.STRING(50),
        descripcion: DataTypes.STRING(100),
        cantidad: DataTypes.INTEGER,
        estado: DataTypes.BOOLEAN
    }, {
            tableName: 'PRODUCTO',
            underscored: true
        });
    Producto.associate = function (models) {
        Producto.belongsTo(models.SEXO, { foreignKey: 'sexo_id' })
        Producto.hasMany(models.IMAGEN_PRODUCTO, { foreignKey: 'producto_id' });
        Producto.belongsToMany(models.CARRITO, { through: models.PRODUCTO_CARRITO, foreignKey: 'producto_id', contraints: true });
        Producto.belongsToMany(models.TALLA, { through: models.PRODUCTO_TALLA, foreignKey: 'producto_id', contraints: true });
    };
    return Producto;
};