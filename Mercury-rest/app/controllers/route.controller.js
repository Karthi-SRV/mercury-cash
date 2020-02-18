'use strict'

const routeService = require('../services/routes.service');
const _ = require('lodash');

// Errors
const getError = require('../errors/errors')
exports.getRoutes = async(req, res) => {
    try {
        const routes = await routeService.getRoutesList();
        return res.success(res, routes);
    } catch (err) {
        const error = getError.getErrorMessage(err)
        return res.errorMessage(res, error)
    }
}

exports.createRoute = async(req, res) => {
    try {
        await routeService.validateRoute(req.body)
        const routes = await routeService.createRoute(req.body);
        return res.success(res, routes);
    } catch (err) {
        const error = getError.getErrorMessage(err)
        return res.errorMessage(res, error)
    }
}

exports.deleteRoute = async(req, res) => {
    try {
        const routeId = _.get(req, 'params.id', '')
        await routeService.routeExists(routeId)
        const routes = await routeService.deleteRoute(routeId);
        return res.success(res, routes);
    } catch (err) {
        const error = getError.getErrorMessage(err)
        return res.errorMessage(res, error)
    }
}
