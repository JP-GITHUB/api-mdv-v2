'use strict';
module.exports = (sequelize, DataTypes) => {
    const Shoppingcart = sequelize.define('Shoppingcart', {
        totalvalue: DataTypes.INTEGER,
        status: DataTypes.BOOLEAN
    }, {
        tableName: 'SHOPPINGCART',
        underscored: true
    });
    
    Shoppingcart.associate = function (models) {
        Shoppingcart.belongsTo(models.Sale, { foreignKey: 'sale_id' });
        Shoppingcart.belongsToMany(models.Product, { through: models.ProductCart, foreignKey: 'shoppingcart_id', contraints: true });
    };
    return Shoppingcart;
};