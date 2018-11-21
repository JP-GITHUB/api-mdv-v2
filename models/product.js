'use strict';
module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        name: DataTypes.STRING(50),
        description: DataTypes.STRING(100),
        status: DataTypes.BOOLEAN
    }, {
            tableName: 'PRODUCT',
            underscored: true
        });
    Product.associate = function (models) {
        Product.belongsTo(models.Gender, { foreignKey: 'gender_id' });
        Product.belongsTo(models.School, { foreignKey: 'school_id' });
        Product.hasMany(models.ProductImage, { foreignKey: 'product_id' });
        Product.belongsToMany(models.Shoppingcart, { through: models.ProductCart, foreignKey: 'product_id', contraints: true });
        Product.hasMany(models.ProductSize);
        Product.belongsToMany(models.Size, { through: models.ProductSize, foreignKey: 'product_id', contraints: true });
    };
    return Product;
};