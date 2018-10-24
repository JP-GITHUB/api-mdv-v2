'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductCart = sequelize.define('ProductCart', {
  }, {
      tableName: 'PRODUCT_SHOPPINGCART',
      underscored: true
    });
  ProductCart.associate = function (models) {
  };
  return ProductCart;
};