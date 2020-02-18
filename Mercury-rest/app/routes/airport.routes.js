'use strict';

const airport = require('../controllers/airport.controller');

module.exports = (app) => {
    app.route('/station')
        .get(airport.getAirportList)
        .post(airport.createAirport);
    app.route('/station/:id')
        .put(airport.updateAirport)
        .delete(airport.deleteAirport);
}
