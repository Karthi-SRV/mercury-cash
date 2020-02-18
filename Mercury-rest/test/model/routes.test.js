const expect = require('expect.js');

describe('models/routes', () => {

    it('return routes', () => {
        var models = require('../../models');
        expect(models.Route).to.be.ok();
    });
});