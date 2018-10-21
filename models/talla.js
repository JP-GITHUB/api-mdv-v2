'use strict';
module.exports = (sequelize, DataTypes) => {
    const Talla = sequelize.define('TALLA', {
        descripcion: DataTypes.STRING(100),
    }, {
        tableName: 'TALLA',
        underscored: true
    });
    Talla.associate = function(models) {
        Talla.belongsToMany(models.PRODUCTO, { through: models.PRODUCTO_TALLA, foreignKey: 'talla_id', contraints: true });
    };
    return Talla;
};