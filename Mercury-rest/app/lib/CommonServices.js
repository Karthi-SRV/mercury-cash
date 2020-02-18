
const _ = require('lodash');
const ObjectId = require('mongodb').ObjectID;
exports.groupBy = async(data, groupBy) => {
    let countryList = [];
    _.map(data, state => {
        let index = _.findIndex(countryList, country => {
            return country.name === state.countryId.name;
        });
        if (index === -1) {
            let country = state.countryId;
            country.states = [];
            country.states.push(state.stateId);
            countryList.push(country);
        } else {
            countryList[index].states.push(state.stateId);
        }
    });
    return countryList;
};

exports.convertToObjectId = async(values) => {
    values = _.compact(_.castArray(values));
    return _.map(values, value => {
        value = ObjectId(value);
        return value;
    });
};

exports.convertToInteger = async(values) => {
    values = _.compact(_.castArray(values));
    return _.map(values, value => {
        value = parseInt(value);
        return value;
    });
};

exports.convertToArray = async(values) => {
    return _.compact(_.castArray(values));
};