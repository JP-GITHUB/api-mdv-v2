'use strict';
module.exports = (sequelize, DataTypes) => {
    const Sexo = sequelize.define('SEXO', {
        descripcion: DataTypes.STRING(100),
    }, {
        tableName: 'SEXO',
        underscored: true
    });
    Sexo.associate = function(models) {
    };
    return Sexo;
};