'use strict';
module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        name: DataTypes.STRING(50),
        description: DataTypes.STRING(100),
        quantity: DataTypes.INTEGER,
        status: DataTypes.BOOLEAN
    }, {
            tableName: 'PRODUCT',
            underscored: true
        });
    Product.associate = function (models) {
        Product.belongsTo(models.Gender, { foreignKey: 'gender_id' });
        Product.hasMany(models.ProductImage, { foreignKey: 'product_id' });
        Product.belongsToMany(models.Shoppingcart, { through: models.ProductCart, foreignKey: 'product_id', contraints: true });
        Product.belongsToMany(models.Size, { through: models.ProductSize, foreignKey: 'product_id', contraints: true });
    };
    return Product;
};