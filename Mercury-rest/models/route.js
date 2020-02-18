'use strict';
module.exports = (sequelize, DataTypes) => {
    const Route = sequelize.define('Route', {
        fromStation: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Airport', // name of Target model
                key: 'id', // key in Target model that we're referencing
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        toStation: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Airport', // name of Target model
                key: 'id', // key in Target model that we're referencing
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        isDeleted: DataTypes.BOOLEAN,
        deletedAt: DataTypes.DATE,
    }, {});
    Route.associate = (models) => {
        Route.belongsTo(models.Airport, { as: "fromAirportStation", foreignKey: 'fromStation' });
        Route.belongsTo(models.Airport, { as: "toAirportStation", foreignKey: 'toStation' });
    };
    return Route;
};