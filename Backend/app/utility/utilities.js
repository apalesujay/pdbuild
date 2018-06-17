'use Strict'

const _ = require('lodash');
const aqp = require('api-query-params');
const defaults = require('../utility/defaults');
const ErrorLibrary = require('../services/customErrorService');
const ClientError = ErrorLibrary.ClientError;
const AppError    = ErrorLibrary.AppError;
const XX = ErrorLibrary.ErrorConstants;


//promise example
//using promise
    // return new Promise(resolve => {
    //     setTimeout(() => {
    //         if(id && RegExp("^[0-9a-fA-F]{24}$").test(id)) {
    //           return  resolve(true);
    //               }else
    //               {
    //           return  resolve(false);
    //               }
               
          
    //     }, 3000);
    //   });

exports.IsValidObjectId = function (id)
{
if(!(id !== undefined && RegExp("^[0-9a-fA-F]{24}$").test(id))) 
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
            
          throw new ClientError(XX.ParameterValidationError["5001"],400,result3);
          } else {
            throw new ClientError(XX.ParameterValidationError["5002"],400,result2);
          }
         
        } else if (result2.length === 0) {
          return null;
        } else {
          throw new AppError(XX.CriticalApplicationError["6001"],500);
        }
      } else {
        throw new ClientError(XX.ParameterValidationError["5003"],400,filter.allowed.length)
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



        

        
