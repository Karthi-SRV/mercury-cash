'use strict';
module.exports = (sequelize, DataTypes) => {
    const Airport = sequelize.define('Airport', {
        name: DataTypes.STRING,
        code: DataTypes.STRING,
        isDeleted: DataTypes.BOOLEAN,
        deletedAt: DataTypes.DATE,
    }, {});
    Airport.associate = function(models) {
    // associations can be defined here
    };
    return Airport;
};