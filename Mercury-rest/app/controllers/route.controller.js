'use strict'

const routeService = require('../services/routes.service');
const _ = require('lodash');

// Errors
const getError = require('../errors/errors')

/**
    * @api {get} 
    * @apiName /route
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
exports.getRoutes = async(req, res) => {
    try {
        const routes = await routeService.getRoutesList(); // Get Routes List
        return res.success(res, routes);
    } catch (err) {
        const error = getError.getErrorMessage(err)
        return res.errorMessage(res, error)
    }
}

/**
    * @api {post} 
    * @apiName /route
    * 
    * @apiBody {int} fromStation station id.
    * @apiBody {int} toStation station id.
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
exports.createRoute = async(req, res) => {
    try {
        await routeService.validateRoute(req.body) // Validate the given data
        const routes = await routeService.createRoute(req.body); // Craete a new route
        return res.success(res, routes);
    } catch (err) {
        const error = getError.getErrorMessage(err)
        return res.errorMessage(res, error)
    }
}

/**
    * @api {delete} 
    * @apiName /route/:id
    * 
    * @apiParam {int} id  route id.
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
exports.deleteRoute = async(req, res) => {
    try {
        const routeId = _.get(req, 'params.id', '') // Route Id
        await routeService.routeExists(routeId) // validate route exits
        const routes = await routeService.deleteRoute(routeId); // Delete the route
        return res.success(res, routes);
    } catch (err) {
        const error = getError.getErrorMessage(err)
        return res.errorMessage(res, error)
    }
}
