const airportController = require('./airport.controller')

describe('practiceSolution', function() {
    it('should be a function', function() {
        expect(airportController).toBeInstanceOf(Function);
    });
});