'use strict';
module.exports = (sequelize, DataTypes) => {
    const Sale = sequelize.define('Sale', {
        rut_retirement: DataTypes.STRING(12),
        name_retirement: DataTypes.STRING(80),
        discount: DataTypes.INTEGER,
        final_value: DataTypes.INTEGER,
        code: DataTypes.STRING(50),
        payment_id: DataTypes.STRING(100),
        payment_status: DataTypes.INTEGER,
        delivered: DataTypes.BOOLEAN,
        status: DataTypes.BOOLEAN
    },
        {
            tableName: 'SALE',
            underscored: true
        });

    Sale.associate = function (models) {
        Sale.belongsTo(models.Shoppingcart, { foreignKey: 'shoppingcart_id' });
    };
    return Sale;
};