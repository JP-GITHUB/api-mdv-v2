'use strict';
module.exports = (sequelize, DataTypes) => {
    const Contact = sequelize.define('Contact', {
        name: DataTypes.STRING(80),
        mother_lastname: DataTypes.STRING(20),
        father_lastname: DataTypes.STRING(20),
        telephone: DataTypes.STRING(12),
        mail: DataTypes.STRING(50),
        status: DataTypes.BOOLEAN
    }, {
        tableName: 'CONTACT',
        underscored: true
    });
    Contact.associate = function (models) {

    };
    return Contact;
};