'use strict'

const _ = require('lodash');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Errors
const ApiErrors = require('../errors/api.error')
const errorMessage = require('../errors/error.messages')

// Model
const Airport = require('../models/Airport');

exports.validateAirportData = async(data, id = '') => {
    if (
        _.isEmpty(_.get(data, 'name')) &&
        _.isEmpty(_.get(data, 'code'))
    ) {
        throw new ApiErrors(errorMessage.RequiredParamsNotFoundError);
    }
    if (_.isEmpty(_.get(data, 'name'))) {
        throw new ApiErrors(errorMessage.NameNotExists);
    }
    if (_.isEmpty(_.get(data, 'code'))) {
        throw new ApiErrors(errorMessage.CodeNotExists);
    }
    if (id) {
        await this.validateAirportExists(id)
        await this.findAirpotyExists(id, _.get(data, 'code', ''))
    } else {
        await this.findAirpotyByCondition({
            code: _.get(data, 'code', ''),
            is_deleted: false,
        })
    }
}

exports.findAirpotyExists = async(id, code) => {
    const airport = await Airport.findOne({ where: {
        id: {
            [Op.ne]: id,
        },
        code,
        is_deleted: false,
    } });
    if (!_.isEmpty(airport)) {
        throw new ApiErrors(errorMessage.CodeAlreadyExists)
    }
}

exports.findAirpotyByCondition = async(condition) => {
    const airport = await Airport.findOne({ where: condition });
    if (!_.isEmpty(airport)) {
        throw new ApiErrors(errorMessage.CodeAlreadyExists)
    }
}

exports.getAirPortList = async() => {
    return Airport.findAll({ where: {
        is_deleted: false,
    } });
}

exports.createAirport = async(data) => {
    const airport = {
        name: _.get(data, 'name', ''),
        code: _.get(data, 'code', ''),
        created_at: new Date(),
    };
    await Airport.create(airport);
    return this.getAirPortList()
}

exports.updateAirport = async(data, id) => {
    const upsertData = {
        name: _.get(data, 'name', ''),
        code: _.get(data, 'code', ''),
        updated_at: new Date(),
    };
    return this.updateAirportData(upsertData, id)
}

exports.deleteAirport = async(id) => {
    const upsertData = {
        is_deleted: 1,
        deleted_at: new Date(),
    };
    return this.updateAirportData(upsertData, id)
}

exports.updateAirportData = async(upsertData, id) => {
    await Airport.update(upsertData, { where: { id: id } });
    return this.getAirPortList()
}

exports.validateAirportExists = async(id) => {
    const airport = await Airport.findOne({ where: {
        id,
        is_deleted: false,
    } });
    if (_.isEmpty(airport)) {
        throw new ApiErrors(errorMessage.AirportNotFound)
    }
}
