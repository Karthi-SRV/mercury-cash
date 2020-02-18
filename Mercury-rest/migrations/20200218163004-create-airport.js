'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Airports', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            code: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            isDeleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            deletedAt: {
                type: Sequelize.DATE,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Airports');
    },
};