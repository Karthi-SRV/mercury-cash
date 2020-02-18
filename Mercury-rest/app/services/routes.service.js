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

exports.validateRoute = async(data) => {
    if (
        !_.isNumber(_.get(data, 'fromStation')) &&
        !_.isNumber(_.get(data, 'toStation'))
    ) {
        throw new ApiErrors(errorMessage.RequiredParamsNotFoundError);
    }
    if (
        !_.isNumber(_.get(data, 'fromStation')) ||
        _.isEmpty(await Airport.findOne({ where: { id: _.get(data, 'toStation'), is_deleted: 0 } }))
    ) {
        throw new ApiErrors(errorMessage.FromStationNotFound);
    }
    if (
        !_.isNumber(_.get(data, 'toStation')) ||
        _.isEmpty(await Airport.findOne({ where: { id: _.get(data, 'toStation'), is_deleted: 0 } }))
    ) {
        throw new ApiErrors(errorMessage.ToStationNotFound);
    }
    if (_.get(data, 'toStation') === _.get(data, 'fromStation')) {
        throw new ApiErrors(errorMessage.FromAndToStationNotBeSame);
    }
    await this.validateRouteExists(_.get(data, 'fromStation'), _.get(data, 'toStation'))
}

exports.validateRouteExists = async(fromStation, toStation) => {
    const data = await Route.findOne({
        where: {
            [Op.or]: [
                {
                    [Op.and]: [
                        { fromStation: fromStation },
                        { toStation: toStation },
                    ],
                },
                {
                    [Op.and]: [
                        { fromStation: toStation },
                        { toStation: fromStation },
                    ],
                },
            ],
        },
    });
    if (!_.isEmpty(data)) {
        throw new ApiErrors(errorMessage.RouteAlreadyExists)
    }
}

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

exports.createRoute = async(data) => {
    const route = {
        fromStation: _.get(data, 'fromStation', ''),
        toStation: _.get(data, 'toStation', ''),
        created_at: new Date(),
    };
    await Route.create(route);
    return this.getRoutesList()
}

exports.deleteRoute = async(id) => {
    const upsertData = {
        is_deleted: 1,
        deleted_at: new Date(),
    };
    await Route.update(upsertData, { where: { id: id } });
    return this.getRoutesList()
}

exports.routeExists = async(id) => {
    const route = await Route.findOne({ where: { id: id, is_deleted: 0 } });
    if (_.isEmpty(route)) {
        throw new ApiErrors(errorMessage.RouteNotFound)
    }
}
