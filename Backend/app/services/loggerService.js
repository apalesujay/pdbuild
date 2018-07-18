'use strict'
var Logger = require('../models/logger');
//custom error handler
exports.logger = async function (error) {

    let _logger = new Logger({
        name:        error._name,
        status:      error._status,
        url:         error._url,
        parameters:  JSON.stringify(error._parameters),
        userId:      error._userId,
        errorStack:  error._errorStack,
        error :      JSON.stringify(error.err)
    });

     let logged =  await _logger.save(); 
       
    };