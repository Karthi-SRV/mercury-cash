describe("Routes", () => {
    let Route;
    beforeAll(() => {
        return require("../../models").sequelize.sync();
    });
  
    beforeEach(() => {
        const models = require("../../models");
        Route = models.Route;
    });
  
    it('create route', async() => {
        const routeService = require('../../app/services/routes.service');
        const data = {
            fromStation: 1,
            toStation: 2,
        }
        const result = await routeService.createRoute(data)
        expect(result.data)
    })
    it('get route', async() => {
        const routeService = require('../../app/services/routes.service');
        const result = await routeService.getRoutesList()
        expect(result.data)
    })


    it('delete airport', async() => {
        const routeService = require('../../app/services/routes.service');
        const result = await routeService.deleteRoute(1)
        expect(result.data)
    })
  
    afterAll(() => {
        require("../../models").sequelize.close();
    });
});