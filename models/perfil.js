'use strict';
module.exports = (sequelize, DataTypes) => {
  const Perfil = sequelize.define('PERFIL', {
    nombre: DataTypes.STRING,
    estado: DataTypes.BOOLEAN
  }, {
      tableName: 'PERFIL',
      underscored: true
    });
  Perfil.associate = function (models) {
    Perfil.hasMany(models.USUARIO, { foreignKey: 'perfil_id' });
    Perfil.belongsToMany(models.PERMISO, { through: { model: models.PERFIL_PERMISO }, foreignKey: 'perfil_id', contraints: true });
  };
  return Perfil;
};