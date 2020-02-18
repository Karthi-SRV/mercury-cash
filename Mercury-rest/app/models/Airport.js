const sequelize = require('../../config/lib/db').sequelize;
const Sequelize = require('sequelize');

const Airport = sequelize.define('airport_station', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        trim: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
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
module.exports = Airport;
