'use strict';
module.exports = (sequelize, DataTypes) => {
    const ImagenProducto = sequelize.define('IMAGEN_PRODUCTO', {
        ubicacion: DataTypes.STRING(255),
        estado: DataTypes.BOOLEAN
    }, {
        tableName: 'IMAGEN_PRODUCTO',
        underscored: true
    });
    ImagenProducto.associate = function (models) {

    };
    return ImagenProducto;
};