describe("Airport", () => {
    let Airport;
    beforeAll(() => {
        return require("../../models").sequelize.sync();
    });
  
    beforeEach(() => {
        const models = require("../../models");
        Airport = models.Airport;
    });
  
    it('create airport', async() => {
        const airportService = require('../../app/services/airport.service');
        const data = {
            name: "BGI",
            code: "BGI"
        }
        const result = await airportService.createAirport(data)
        expect(result.data)
    })


    it('get airport', async() => {
        const airportService = require('../../app/services/airport.service');
        const result = await airportService.getAirPortList()
        expect(result.data)
    })

    it('update airport', async() => {
        const airportService = require('../../app/services/airport.service');
        const data = {
            name: "BGI",
            code: "BGI"
        }
        const result = await airportService.updateAirport(data, 1)
        expect(result.data)
    })

    it('delete airport', async() => {
        const airportService = require('../../app/services/airport.service');
        const data = {
            name: "BGI",
            code: "BGI"
        }
        const result = await airportService.deleteAirport(1)
        expect(result.data)
    })
  
    afterAll(() => {
        require("../../models").sequelize.close();
    });
});