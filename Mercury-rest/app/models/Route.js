const sequelize = require('../../config/lib/db').sequelize;
const Sequelize = require('sequelize');

// Models
const Airport = require('./Airport')
const Route = sequelize.define('route', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fromStation: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    toStation: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    is_deleted: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
    },
    created_at: {
        type: Sequelize.DATE,
    },
    updated_at: {
        type: Sequelize.DATE,
    },
    deleted_at: {
        type: Sequelize.DATE,
    },
});
Route.belongsTo(Airport, { as: "fromAirportStation", foreignKey: 'fromStation' });
Route.belongsTo(Airport, { as: "toAirportStation", foreignKey: 'toStation' });
module.exports = Route;
