'use strict';

const airportController = require('../controllers/airport.controller');

module.exports = (app) => {
    app.route('/station')
        .get(airportController.getAirportList)
        .post(airportController.createAirport);
    app.route('/station/:id')
        .put(airportController.updateAirport)
        .delete(airportController.deleteAirport);
}
