'use strict'

const _ = require('lodash');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Errors
const ApiErrors = require('../errors/api.error')
const errorMessage = require('../errors/error.messages')

// Model
const Route = require('../models/Route');
const Airport = require('../models/Airport');

// Validate given data exits
exports.validateRoute = async(data) => {
    if (
        !_.isNumber(_.get(data, 'fromStation')) &&
        !_.isNumber(_.get(data, 'toStation'))
    ) {
        throw new ApiErrors(errorMessage.RequiredParamsNotFoundError);
    }
    // is fromStation exits then check fromStation exits if fails throw error
    if (
        !_.isNumber(_.get(data, 'fromStation')) ||
        _.isEmpty(await Airport.findOne({ where: { id: _.get(data, 'toStation'), is_deleted: 0 } }))
    ) {
        throw new ApiErrors(errorMessage.FromStationNotFound);
    }
    // is toStation exits then check toStation exits if fails throw error
    
    if (
        !_.isNumber(_.get(data, 'toStation')) ||
        _.isEmpty(await Airport.findOne({ where: { id: _.get(data, 'toStation'), is_deleted: 0 } }))
    ) {
        throw new ApiErrors(errorMessage.ToStationNotFound);
    }

    // Verify from and to station are same
    if (_.get(data, 'toStation') === _.get(data, 'fromStation')) {
        throw new ApiErrors(errorMessage.FromAndToStationNotBeSame);
    }
    // Validate given route already exits
    await this.validateRouteExists(_.get(data, 'fromStation'), _.get(data, 'toStation'))
}

// Validate given route already exits
exports.validateRouteExists = async(fromStation, toStation) => {
    const data = await Route.findOne({
        where: {
            [Op.or]: [
                {
                    [Op.and]: [
                        { fromStation: fromStation },
                        { toStation: toStation },
                        { is_deleted: 0 }
                    ],
                },
                {
                    [Op.and]: [
                        { fromStation: toStation },
                        { toStation: fromStation },
                        { is_deleted: 0 }
                    ],
                },
            ],
        },
    });
    // Routes exits throw a error
    if (!_.isEmpty(data)) {
        throw new ApiErrors(errorMessage.RouteAlreadyExists)
    }
}

// Get Route list
exports.getRoutesList = async() => {
    return Route.findAll({
        include: [
            {
                model: Airport,
                as: 'fromAirportStation',
            }, {
                model: Airport,
                as: 'toAirportStation',
            },
        ],
        where: { is_deleted: 0 },
    });
}

// Create Route
exports.createRoute = async(data) => {
    const route = {
        fromStation: _.get(data, 'fromStation', ''),
        toStation: _.get(data, 'toStation', ''),
        created_at: new Date(),
    };
    await Route.create(route);
    return this.getRoutesList()
}

// Delete Route
exports.deleteRoute = async(id) => {
    const upsertData = {
        is_deleted: 1,
        deleted_at: new Date(),
    };
    await Route.update(upsertData, { where: { id: id } });
    return this.getRoutesList()
}

// Verify given route id exits
exports.routeExists = async(id) => {
    const route = await Route.findOne({ where: { id: id, is_deleted: 0 } });
    if (_.isEmpty(route)) {
        throw new ApiErrors(errorMessage.RouteNotFound)
    }
}
