'use strict';
module.exports = (sequelize, DataTypes) => {
    const Size = sequelize.define('Size', {
        description: DataTypes.STRING(100),
    }, {
        tableName: 'SIZE',
        underscored: true
    });
    Size.associate = function(models) {
        Size.belongsToMany(models.Product, { through: models.ProductSize, foreignKey: 'size_id', contraints: true });
    };
    return Size;
};