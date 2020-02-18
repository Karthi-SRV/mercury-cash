'use strict'

const airportService = require('../services/airport.service');
const _ = require('lodash');

// Errors
const getError = require('../errors/errors')

/**
    * @api {get} 
    * @apiName /station
    * @apiGroup Public
    *
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
      *       "success": true,
      *       "data": {}
    *     }
    *
    *
    * @apiErrorExample Error-Response:
    *     HTTP/1.1 404 Not Found
    *     {
      *        "success":false,
      *        "message": "Some error"
    *     }
*/
exports.getAirportList = async(req, res) => {
    try {
        const airportList = await airportService.getAirPortList(); // Get Airport List
        return res.success(res, airportList);
    } catch (err) {
        const error = getError.getErrorMessage(err)
        return res.errorMessage(res, error)
    }
}

/**
    * @api {post} 
    * @apiName /station
    * @apiGroup Public
    * 
    * @apiBody {Sting} name Airport Name.
    * @apiBody {String} code Airport Unique Code.
    *
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
      *       "success": true,
      *       "data": {}
    *     }
    *
    *
    * @apiErrorExample Error-Response:
    *     HTTP/1.1 404 Not Found
    *     {
      *        "success":false,
      *        "message": "Some error"
    *     }
*/
exports.createAirport = async(req, res) => {
    try {
        await airportService.validateAirportData(req.body) // validate the given data
        const airportList = await airportService.createAirport(req.body); // Add new data into the tables
        return res.success(res, {
            data: airportList,
        });
    } catch (err) {
        const error = getError.getErrorMessage(err)
        return res.errorMessage(res, error)
    }
}

/**
    * @api {put} 
    * @apiName /station/:id
    * @apiGroup Public
    * 
    * @apiParams {int} id Airport id.
    * 
    * @apiBody {Sting} name Airport Name.
    * @apiBody {String} code Airport Unique Code.
    *
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
      *       "success": true,
      *       "data": {}
    *     }
    *
    *
    * @apiErrorExample Error-Response:
    *     HTTP/1.1 404 Not Found
    *     {
      *        "success":false,
      *        "message": "Some error"
    *     }
*/
exports.updateAirport = async(req, res) => {
    try {
        const airportId = _.get(req, 'params.id', '') // station id
        await airportService.validateAirportData(req.body, airportId) // validate the given data
        const airportList = await airportService.updateAirport(req.body, airportId); // Update the station 
        return res.success(res, airportList);
    } catch (err) {
        const error = getError.getErrorMessage(err)
        return res.errorMessage(res, error)
    }
}

/**
    * @api {delete} 
    * @apiName /station/:id
    * @apiGroup Public
    * 
    * @apiParams {int} id Airport id.
    * 
    *
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
      *       "success": true,
      *       "data": {}
    *     }
    *
    *
    * @apiErrorExample Error-Response:
    *     HTTP/1.1 404 Not Found
    *     {
      *        "success":false,
      *        "message": "Some error"
    *     }
*/
exports.deleteAirport = async(req, res) => {
    try {
        const airportId = _.get(req, 'params.id', '') // Station id
        await airportService.validateAirportExists(airportId) // validate the station exists
        const airportList = await airportService.deleteAirport(airportId); // Delete the station
        return res.success(res, airportList);
    } catch (err) {
        const error = getError.getErrorMessage(err)
        return res.errorMessage(res, error)
    }
}
