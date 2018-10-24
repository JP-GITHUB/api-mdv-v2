'use strict';
module.exports = (sequelize, DataTypes) => {
    const ProductImage = sequelize.define('ProductImage', {
        location: DataTypes.STRING(255),
        status: DataTypes.BOOLEAN
    }, {
        tableName: 'PRODUCT_IMAGE',
        underscored: true
    });
    ProductImage.associate = function (models) {

    };
    return ProductImage;
};