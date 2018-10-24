'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProfilePermission = sequelize.define('ProfilePermission', {
  }, {
      tableName: 'PROFILE_PERMISSION',
      underscored: true
    });
  ProfilePermission.associate = function (models) {
  };
  return ProfilePermission;
};