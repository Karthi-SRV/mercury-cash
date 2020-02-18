'use strict'

const _ = require('lodash');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Errors
const ApiErrors = require('../errors/api.error')
const errorMessage = require('../errors/error.messages')

// Model
const { Airport, Route } = require('../../models');

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
        _.isEmpty(await Airport.findOne({ where: { id: _.get(data, 'toStation'), isDeleted: 0 } }))
    ) {
        throw new ApiErrors(errorMessage.FromStationNotFound);
    }
    // is toStation exits then check toStation exits if fails throw error
    
    if (
        !_.isNumber(_.get(data, 'toStation')) ||
        _.isEmpty(await Airport.findOne({ where: { id: _.get(data, 'toStation'), isDeleted: 0 } }))
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
                        { isDeleted: 0 }
                    ],
                },
                {
                    [Op.and]: [
                        { fromStation: toStation },
                        { toStation: fromStation },
                        { isDeleted: 0 }
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
        where: { isDeleted: 0 },
    });
}

// Create Route
exports.createRoute = async(data) => {
    const route = {
        fromStation: _.get(data, 'fromStation', ''),
        toStation: _.get(data, 'toStation', ''),
        createdAt: new Date(),
    };
    await Route.create(route);
    return this.getRoutesList()
}

// Delete Route
exports.deleteRoute = async(id) => {
    const upsertData = {
        isDeleted: 1,
        deletedAt: new Date(),
    };
    await Route.update(upsertData, { where: { id: id } });
    return this.getRoutesList()
}

// Verify given route id exits
exports.routeExists = async(id) => {
    const route = await Route.findOne({ where: { id: id, isDeleted: 0 } });
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

// Algorithm to find shortest distance
exports.performShortestPathAlgorithm = async( airports, sourcePort, destinationPorts, adjacentNodes) => {
    let maximumLimit = Object.keys(adjacentNodes).length; // maximum number of nodes that can be traversed to reach destination
    let distanceArray = [];

    // looping through destination array to find distance from source
    for (let j=0; j< destinationPorts.length; j++) {
        let endValue = destinationPorts[j]; // current end node 
        let currentNodes = [sourcePort]; // start from source node
        let visitedNodes = [];
        let distance = 0;

        if (sourcePort === endValue) {
            distance = 0; // if start and end nodes are same
        } else if(_.includes(adjacentNodes[`${sourcePort}`], endValue )) {
            distance = 1; // if end nodes and adjacent nodes of start node  are same
        } else {
            traversingThroughNodes(); 
        }

        /* Function to traverse through the child nodes to find the destination node  */ 
        function traversingThroughNodes() {
            for (let i = 0; i < currentNodes.length; i++) {
                if (!_.includes(visitedNodes, currentNodes[i])) {
                    visitedNodes.push(currentNodes[i]); // marking current nodes as visited nodes
                    currentNodes[i] = adjacentNodes[`${currentNodes[i]}`]; // replacing the current nodes with its child nodes
                } else {
                    currentNodes.splice(i, 1, ''); // removing already visited nodes
                }
            }

            /* Transforming [[[], [1,2], [1,2]]] into [1,2] by removing 
            repeated values(_uniq), invalid values(compact) and
            flattening the inner array(flattenDeep) */
            currentNodes = _.compact(_.flattenDeep(_.uniq(currentNodes)));

            if (_.includes(currentNodes, endValue)) {
                distance++; // if end node is found in child nodes
                return;
            } else if (distance > maximumLimit) {
                distance = 0; // if node is not found even after traversing through all nodes
                return; 
            }   else {
                distance++; // if node is not found in child nodes
                traversingThroughNodes(); // continues traversing through next set of child nodes
            }
        }
        distanceArray[j] = distance;
    }
    let reachableNodes = [];
    let nonReachableNodes = [];
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