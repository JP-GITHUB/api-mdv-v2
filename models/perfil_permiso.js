'use strict';
module.exports = (sequelize, DataTypes) => {
  const PerfilPermiso = sequelize.define('PERFIL_PERMISO', {
  }, {
      tableName: 'PERFIL_PERMISO',
      underscored: true
    });
  PerfilPermiso.associate = function (models) {
  };
  return PerfilPermiso;
};