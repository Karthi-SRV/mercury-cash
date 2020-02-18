const expect = require('expect.js');

describe('models/airport', () => {
    it('airport', () => {
        const models = require('../../models');
        expect(models.Airport).to.be.ok();
    });
});