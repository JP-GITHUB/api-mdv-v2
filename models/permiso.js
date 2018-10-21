'use strict';
module.exports = (sequelize, DataTypes) => {
  const Permiso = sequelize.define('PERMISO', {
    nombre: DataTypes.STRING,
    estado: DataTypes.BOOLEAN
  }, {
      tableName: 'PERMISO',
      underscored: true
    });
  Permiso.associate = function (models) {
    Permiso.belongsToMany(models.PERFIL, { through: { model: models.PERFIL_PERMISO }, foreignKey: 'permiso_id', contraints: true });
  };
  return Permiso;
};