'use strict';
module.exports = (sequelize, DataTypes) => {
    const BranchOffice = sequelize.define('BranchOffice', {
        name: DataTypes.STRING(80),
        location: DataTypes.STRING(50),
        telephone: DataTypes.STRING(12),
        status: DataTypes.BOOLEAN
    }, {
            tableName: 'BRANCHOFFICE',
            underscored: true
        });
    BranchOffice.associate = function (models) {
        BranchOffice.hasMany(models.School, { foreignKey: 'branchoffice_id' })
    };
    return BranchOffice;
};