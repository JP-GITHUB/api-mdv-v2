'use strict';
module.exports = (sequelize, DataTypes) => {
    const School = sequelize.define('School', {
        name: DataTypes.STRING(80),
        rut: DataTypes.STRING(11),
        location: DataTypes.STRING(100),
        telephone: DataTypes.STRING(12),
        status: DataTypes.BOOLEAN
    }, {
        tableName: 'SCHOOL',
        underscored: true
    });
    School.associate = function (models) {
        School.hasMany(models.Contact, {foreignKey:'school_id'});
        School.hasMany(models.Product, {foreignKey:'school_id'});
    };
    return School;
};