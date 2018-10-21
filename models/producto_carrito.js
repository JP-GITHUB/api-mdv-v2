'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductoCarrito = sequelize.define('PRODUCTO_CARRITO', {
  }, {
      tableName: 'PRODUCTO_CARRITO',
      underscored: true
    });
  ProductoCarrito.associate = function (models) {
  };
  return ProductoCarrito;
};