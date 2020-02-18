'use strict'

const airportService = require('../services/airport.service');
const _ = require('lodash');

// Errors
const getError = require('../errors/errors')
exports.getAirportList = async(req, res) => {
    try {
        const airportList = await airportService.getAirPortList();
        return res.success(res, airportList);
    } catch (err) {
        const error = getError.getErrorMessage(err)
        return res.errorMessage(res, error)
    }
}

exports.createAirport = async(req, res) => {
    try {
        await airportService.validateAirportData(req.body)
        const airportList = await airportService.createAirport(req.body);
        return res.success(res, {
            data: airportList,
        });
    } catch (err) {
        const error = getError.getErrorMessage(err)
        return res.errorMessage(res, error)
    }
}

exports.updateAirport = async(req, res) => {
    try {
        const airportId = _.get(req, 'params.id', '')
        await airportService.validateAirportData(req.body, airportId)
        const airportList = await airportService.updateAirport(req.body, airportId);
        return res.success(res, {
            data: airportList,
        });
    } catch (err) {
        const error = getError.getErrorMessage(err)
        return res.errorMessage(res, error)
    }
}

exports.deleteAirport = async(req, res) => {
    try {
        const airportId = _.get(req, 'params.id', '')
        await airportService.validateAirportExists(airportId)
        const airportList = await airportService.deleteAirport(airportId);
        return res.success(res, {
            data: airportList,
        });
    } catch (err) {
        const error = getError.getErrorMessage(err)
        return res.errorMessage(res, error)
    }
}
