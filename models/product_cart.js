'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductCart = sequelize.define('ProductCart', {
    shop_quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER
  }, {
      tableName: 'PRODUCT_SHOPPINGCART',
      underscored: true
    });
  ProductCart.associate = function (models) {
  };
  return ProductCart;
};