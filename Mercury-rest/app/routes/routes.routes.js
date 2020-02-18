'use strict';

const route = require('../controllers/route.controller');

module.exports = (app) => {
    app.route('/route')
        .get(route.getRoutes)
        .post(route.createRoute);
    app.route('/route/:id')
        .delete(route.deleteRoute);
    app.route('/analyse')
        .post(route.analyseRoute);
}
