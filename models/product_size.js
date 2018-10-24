'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductSize = sequelize.define('ProductSize', {
    price: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
      tableName: 'PRODUCT_SIZE',
      underscored: true
    });
  ProductSize.associate = function (models) {
  };
  return ProductSize;
};