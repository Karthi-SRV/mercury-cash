'use strict';

module.exports = {
    app: {
        publicResources: [
            '/',
            '/auth/signin',
            '/auth/user',
        ],
    },
    environment: 'dev',
    port: 7000,
    db: {
        host: 'timer.crhofpllzrki.us-east-1.rds.amazonaws.com',
        name: 'airport1',
        username: 'timer',
        password: 'Spider$05',
        connectionTimeout: 3000,
        dialect: "mysql",
        operatorsAliases: false
    },
    frontEndUrl: [
        'http://localhost:7000',
        'http://localhost:9000',
    ],
    JWTSecretKey: 'VQuGMDwLXfJXEDhAqleOlL6BtiUhRnKz',
};
