'use strict';
module.exports = (sequelize, DataTypes) => {
    const Gender = sequelize.define('Gender', {
        description: DataTypes.STRING(100),
    }, {
            tableName: 'GENDER',
            underscored: true
        });
    Gender.associate = function (models) {
    };
    return Gender;
};