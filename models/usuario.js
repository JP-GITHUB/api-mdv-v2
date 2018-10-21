'use strict';
module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('USUARIO', {
        nombre: DataTypes.STRING(80),
        apellido: DataTypes.STRING(80),
        rut: DataTypes.CHAR(14),
        mail: DataTypes.STRING(100),
        telefono: DataTypes.CHAR(100),
        password: DataTypes.STRING(50),
        estado: DataTypes.BOOLEAN
    }, {
            tableName: 'USUARIO',
            underscored: true
        });
    Usuario.associate = function (models) {
        Usuario.hasMany(models.VENTA, { foreignKey: 'usuario_id' });
        Usuario.belongsTo(models.PERFIL, { foreignKey: 'perfil_id' });
    };
    return Usuario;
};