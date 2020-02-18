'use strict'

const _ = require('lodash');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Errors
const ApiErrors = require('../errors/api.error')
const errorMessage = require('../errors/error.messages')

// Model
const { Airport } = require('../../models/');

/**
 * Validate the given body data
 */
exports.validateAirportData = async(data, id = '') => {
    // Validate the given field exits
    if (
        _.isEmpty(_.get(data, 'name')) &&
        _.isEmpty(_.get(data, 'code'))
    ) {
        throw new ApiErrors(errorMessage.RequiredParamsNotFoundError);
    }
    // Check whether the name is empty or not
    if (_.isEmpty(_.get(data, 'name'))) {
        throw new ApiErrors(errorMessage.NameNotExists);
    }
    // Check whether the code is empty or not
    if (_.isEmpty(_.get(data, 'code'))) {
        throw new ApiErrors(errorMessage.CodeNotExists);
    }
    
    if (id) {
        // If update validate given id exists
        await this.validateAirportExists(id)
        // If validate given code mapped to some other airport
        await this.findAirportExists(id, _.get(data, 'code', ''))
    } else {
        //  Verify the code already mapped to some other airport
        await this.findAirpotyByCondition({
            code: _.get(data, 'code', ''),
            isDeleted: 0,
        })
    }
}

// validate given code mapped to some other airport
exports.findAirportExists = async(id, code) => {
    const airport = await Airport.findOne({ where: {
        id: {
            [Op.ne]: id,
        },
        code,
        isDeleted: 0,
    } });
    // station is present throw error
    if (!_.isEmpty(airport)) {
        throw new ApiErrors(errorMessage.CodeAlreadyExists)
    }
}

// Find Station by differnt where case
exports.findAirpotyByCondition = async(condition) => {
    const airport = await Airport.findOne({ where: condition });
    if (!_.isEmpty(airport)) {
        throw new ApiErrors(errorMessage.CodeAlreadyExists)
    }
}

// Get the Station List
exports.getAirPortList = async() => {
    return Airport.findAll({ where: {
        isDeleted: 0,
    } });
}

// Create a station 
exports.createAirport = async(data) => {
    const airport = {
        name: _.get(data, 'name', ''),
        code: _.get(data, 'code', ''),
        createdAt: new Date(),
    };
    await Airport.create(airport);
    return this.getAirPortList()
}

// Update the station by station id
exports.updateAirport = async(data, id) => {
    const upsertData = {
        name: _.get(data, 'name', ''),
        code: _.get(data, 'code', ''),
        updated_at: new Date(),
    };
    return this.updateAirportData(upsertData, id)
}

// Delete the station by station id
exports.deleteAirport = async(id) => {
    const upsertData = {
        isDeleted: 1,
        deletedAt: new Date(),
    };
    return this.updateAirportData(upsertData, id)
}

// Dynamic update query for Airport
exports.updateAirportData = async(upsertData, id) => {
    await Airport.update(upsertData, { where: { id } });
    return this.getAirPortList()
}

// Validate station already exists
exports.validateAirportExists = async(id) => {
    const airport = await Airport.findOne({ where: {
        id,
        isDeleted: 0,
    } });
    if (_.isEmpty(airport)) {
        throw new ApiErrors(errorMessage.AirportNotFound)
    }
}
