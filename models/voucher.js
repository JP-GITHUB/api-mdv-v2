'use strict';
module.exports = (sequelize, DataTypes) => {
    const Voucher = sequelize.define('Voucher', {
        retirement_date: DataTypes.DATEONLY,
        retirement_status: DataTypes.BOOLEAN
    }, {
        tableName: 'VOUCHER',
        underscored: true
    });
    Voucher.associate = function (models) {
        // Asociación con contacto
    };
    return Voucher;
};