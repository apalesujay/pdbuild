'use strict'

const jwt = require('jsonwebtoken');
const config = require('../../config');


exports.sign = (payloadId,payloadRole) => {
    return jwt.sign({"id": payloadId,"role":payloadRole}, config.secret ,{}); //TODO:never expire Implement redis to invalidate token
};