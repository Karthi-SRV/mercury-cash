'use strict';

const _ = require('lodash');

exports.getUniqueArrayWithTrim = (array, flag) => {
    var uniqueArray = [], found, uniqueArrayKey = [];
    _.map(array, (value, x) => {
        found = false;
        _.map(uniqueArray, (item) => {
            if (_.toLower(_.trim(value)) === _.trim(_.toLower(item))) {
                found = true;
            }
        });
        if (!found) {
            uniqueArray.push(_.trim(value));
            uniqueArrayKey.push(x);
        }
    });
    if (flag) {
        return uniqueArrayKey;
    }
    return uniqueArray;
};

exports.getUniqueArrayObjectWithTrim = (array, name) => {
    let dataArray = _.map(array, name),
        uniqueArrayKey = this.getUniqueArrayWithTrim(dataArray, true),
        uniqueArrayObject = _.compact(_.map(array, (item, key) => {
            if (_.includes(uniqueArrayKey, key)) {
                return item;
            }
        }));
    return uniqueArrayObject;
}
