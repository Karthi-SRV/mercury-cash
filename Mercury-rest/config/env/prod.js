'use strict';

module.exports = {
    app: {
        publicResources: [
            '/',
            '/auth/signin',
            '/auth/user',
        ],
    },
    environment: 'prod',
    port: 7000,
    db: {
        host: 'timer.crhofpllzrki.us-east-1.rds.amazonaws.com',
        name: 'airport',
        username: 'timer',
        password: 'Spider$05',
        connectionTimeout: 3000,
    },
    frontEndUrl: [
        'http://localhost:3000',
    ],
    JWTSecretKey: 'VQuGMDwLXfJXEDhAqleOlL6BtiUhRnKz',
};
