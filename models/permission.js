'use strict';
module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
    name: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
      tableName: 'PERMISSION',
      underscored: true
    });
  Permission.associate = function (models) {
    Permission.belongsToMany(models.Profile, { through: { model: models.ProfilePermission }, contraints: true });
  };
  return Permission;
};