'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Routes', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            fromStation: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            toStation: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Date.now,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            isDeleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            deletedAt: {
                type: Sequelize.DATE,
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Routes');
    },
};