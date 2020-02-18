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

exports.validateSourceAndDestination = async(data) => {
    const source = _.get(data, 'sourcePort', null);
    const destination = _.get(data, 'destinationPorts', []);
    let stationId = _.concat(source, destination);
    
    if (!_.isNumber(source)
        || (_.isEmpty(destination)
        || !_.isArray(destination))
    ) {
        throw new ApiErrors(errorMessage.RequiredParamsNotFoundError);
    }

    const airports = await Airport.findAll({ where: {
        id: {
            [Op.in]: stationId,
        },
        is_deleted: 0,
    } });

    // check if all given station is present
    if (airports.length !==  _.uniq(stationId).length) {
        throw new ApiErrors(errorMessage.AirportNotFound);
    }
    return airports;
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

exports.calculatingShortestPath = async(requestData, airports) => {
    let routes = await this.getRoutesList();
    let sourceDestinationPair = [];
    _.map(routes, route => {
        sourceDestinationPair.push([route.fromStation, route.toStation])
    });
    let sources = _.uniq(_.flattenDeep(sourceDestinationPair));
    let adjacentNodes = {};
    for(let i=0; i<sources.length; i++) {
        const nodes = []
        for(let j=0; j<sourceDestinationPair.length; j++) {
            if(_.includes(sourceDestinationPair[j], sources[i])) {
                nodes.push(_.difference(sourceDestinationPair[j], [sources[i]])[0]);
            }
        }
        _.set(adjacentNodes, sources[i], nodes);
    }
    return this.performShortestPathAlgorithm(airports, requestData.sourcePort, requestData.destinationPorts, adjacentNodes);
}

exports.performShortestPathAlgorithm = async( airports, sourcePort, destinationPorts, adjacentNodes) => {
    // Algorithm to find shortest distance
    let maximumLimit = Object.keys(adjacentNodes).length;
    let distanceArray = [];
    for (let j=0; j< destinationPorts.length; j++) {
        let endValue = destinationPorts[j];
        let temp = [sourcePort];
        let queue = [];
        let distance = 0;
        if (sourcePort === endValue) {
            distance = 0;
        }
        else if(_.includes(adjacentNodes[`${sourcePort}`], endValue )) {
            distance = 1;
        } else {
            recursiveFun();
        }
        function recursiveFun() {
            for (let i = 0; i < temp.length; i++) {
                if (!_.includes(queue, temp[i])) {
                    queue.push(temp[i]);
                    temp[i] = adjacentNodes[`${temp[i]}`];
                } else {
                    temp.splice(i, 1, '');
                }
            }
            // Removing empty values, Performing unique values in an array and store in uniq
            const uniq = _.compact(_.flattenDeep(_.uniq(temp)));
            if (_.includes(_.flattenDeep(temp), endValue)) {
                distance++;
                return;
            } else {
                temp = uniq;
                distance++;
                if(distance <= maximumLimit ) {
                    recursiveFun();
                } else {
                    distance = 0;
                    return;
                }
            }
        }
        distanceArray[j] = distance;
    }
    let reachableNodes = [];
    let  nonReachableNodes = [];
    for (let i =0; i < destinationPorts.length; i++) {
        if (distanceArray[i] > 0) {
            reachableNodes.push({ id: destinationPorts[i], distance: distanceArray[i], code: _.find(airports, { id: destinationPorts[i] }).code})
        } else {
            nonReachableNodes.push({ id: destinationPorts[i], distance: distanceArray[i], code: _.find(airports, { id: destinationPorts[i] }).code})
        }
    }

    return {
        reachableNodes,
        nonReachableNodes,
        optimalOutput: Math.max(...distanceArray)
    }
}