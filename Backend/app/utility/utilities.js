'use Strict'

const _ = require('lodash');
const aqp = require('api-query-params');
const ValidObjectId = require('mongoose').Types.ObjectId.isValid;
const defaults = require('../utility/defaults');
const ErrorLibrary = require('../services/customErrorService');
const ClientError = ErrorLibrary.ClientError;
const AppError    = ErrorLibrary.AppError;
const XX = ErrorLibrary.ErrorConstants;

const type = function (data,type) {
    return Object.prototype.toString.call(data) === type;
}

exports.isNumber = function (value) {
      return type(value,"[object Array]");
}

exports.isObject = function (value) {
  return type(value,"[object Object]");
}

exports.isString = function (value) {
  return type(value,"[object String]");
}

exports.isDate = function (value) {
  return type(value,"[object Date]");
}

exports.isBoolean = function (value) {
  return type(value,"[object Boolean]");
}

exports.isArray = function (value) {
  return type(value,"[object Array]");
}

exports.isNull = function (value) {
  return type(value,"[object Null]");
}

exports.isUndefined = function (value) {
  return type(value,"[object Undefined]");
}

exports.isNullOrUndefined = function (value) {
  return (type(value,"[object Null]") || type(value,"[object Undefined]"))
}

exports.isValidObjectId = function (id)
{
if(!ValidObjectId(id)) 
  { 
  throw new ClientError(XX.ParameterValidationError["5005"],400,id);              
  }
}


exports.getQueryParameterInJson = function(queryString,strictvalue) {
  var value = (strictvalue === undefined) ? defaults.getOptions.limit.maxValue : strictvalue;
  const qp = aqp(queryString);
  let limit = qp.limit;
  if(limit === undefined || !Number.isInteger(limit))
  {
    limit = value;
  } else
  {
   if(limit > 0 && value > 0)
   {
      limit = (limit <= value) ? limit : value; 
   }
   else if(limit === 0 && value === 0)
   {
     limit = 0;
   }
  }
  qp.limit = limit;
  return qp;
}

exports.IsAuthorisedBodyParameter = function(getReqBody,filter)
{ 
  const reqBody = getReqBody !== undefined ? Object.keys(getReqBody) : [];
  if (reqBody.length > 0) {
    let result1 = _.intersection(filter.allowed, filter.notallowed);

    if (result1.length === 0) {
      if (reqBody.length === filter.allowed.length) {
        let result2 = _.difference(reqBody, filter.allowed);

        if (result2.length > 0) {
          let result3 = _.intersection(result2, filter.notallowed);

          if (result3.length !== 0) {
            
          throw new ClientError(XX.ParameterValidationError["5001"],400,{needed:filter});
          } else {
            throw new ClientError(XX.ParameterValidationError["5002"],400,{needed:filter});
          }
         
        } else if (result2.length === 0) {
          return null;
        } else {
          throw new AppError(XX.CriticalApplicationError["6001"],500);
        }
      } else {
        throw new ClientError(XX.ParameterValidationError["5003"],400,{needed:filter});
      }
    } else {
     throw new AppError(XX.CriticalApplicationError["6001"],500);
    }
  } else {
    throw new ClientError(XX.ParameterValidationError["5004"],400)
  }
}




exports.getProjection = function(queryfields)
{
    return aqp(queryfields).projection;
}








        

        
