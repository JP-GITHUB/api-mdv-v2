'use strict';
module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    name: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
      tableName: 'PROFILE',
      underscored: true
    });
  Profile.associate = function (models) {
    Profile.hasMany(models.User, { foreignKey: 'profile_id'});
    Profile.belongsToMany(models.Permission, { through: { model: models.ProfilePermission }, contraints: true });
  };
  return Profile;
};