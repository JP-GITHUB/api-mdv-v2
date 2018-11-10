'use strict';
module.exports = (sequelize, DataTypes) => {
    const PaymentMethod = sequelize.define('PaymentMethod', {
        type: DataTypes.STRING(50),
        status: DataTypes.BOOLEAN
    }, {
        tableName: 'PAYMENT_METHOD',
        underscored: true
    });
    PaymentMethod.associate = function(models) {
        PaymentMethod.hasMany(models.Sale, {foreignKey:'payment_method_id'})
    };
    return PaymentMethod;
};