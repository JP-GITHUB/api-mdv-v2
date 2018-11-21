'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: DataTypes.STRING(80),
        lastname: DataTypes.STRING(80),
        rut: DataTypes.CHAR(14),
        mail: DataTypes.STRING(100),
        telephone: DataTypes.CHAR(100),
        password: DataTypes.STRING(255),
        status: DataTypes.BOOLEAN
    }, {
            tableName: 'USER',
            underscored: true
        });
    User.associate = function (models) {
        User.hasMany(models.Sale, { foreignKey: 'user_id', allowNull: false });
        User.belongsTo(models.Profile, { foreignKey: 'profile_id', allowNull: false });
    };
    return User;
};