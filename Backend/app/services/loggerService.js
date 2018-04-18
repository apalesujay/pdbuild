'use strict'
var Account = require('../models/account');
var Logger = require('../models/logger');
//custom error handler
exports.logger = function (statusCode,err, userid, params, location, msg) {

    var _logger = new Logger({
        StatusCode:statusCode,
        UserId: userid,
        Params: JSON.stringify(params),
        Location: location,
        Msg: msg,
        Error: err
    });
console.log(_logger);
    

    _logger.save(function (er, result) {
        if (er) {
         return  console.log(er);
        }
        if (result) {
          return  console.log('error saved to DB');   
        }
    });

}