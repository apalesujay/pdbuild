'use strict'
const config = require('../../config'); 
const jwt    = require('jsonwebtoken'); 
const _      = require('lodash');
const ClientError = require('../services/customErrorService').ClientError;
const AppError    = require('../services/customErrorService').AppError;
const XX          = require('../services/customErrorService').ErrorConstants;

//TODO:remove orignal jwt use authtokenLibrary custom
let authenticate = function (token) {
  return new Promise(resolve => {
    if (token) {
      jwt.verify(token, config.secret, { "ignoreExpiration": true }, function (failed, decoded) {
        if (failed) {
          return resolve(new ClientError(XX.AuthError["1002"], 498, token))    //Code 498 indicates an expired or otherwise invalid token  
        } else {
          console.log(decoded);
          if (decoded.id === undefined || decoded.role === undefined) {
            return resolve(new ClientError(XX.AuthError["1003"], 401, token));
          }
          else {
            return resolve(decoded);
          }

        }
      });

    } else {
      throw new ClientError(XX.AuthError["1001"], 400, token); //401 Unauthorized ie unauthenticated

    }
  });
}


//middleware not tested
let Authentication = async function (req, res, next) {
  try {
    let decoded = await authenticate(req.headers['x-access-token']);
    req.id = decoded.id;
    req.role = decoded.role;
    next();
  }
  catch (ex) {
    next(ex);
  }
}
   //Similar to 403 Forbidden, but specifically for use when 

let authorize = function(decodedrole,definedroles)
{
  if(definedroles === undefined)
  {
    return true;
  }
  else
  {
    let result = _.intersection(decodedrole,definedroles)
    if(result.length === 0){
      throw new ClientError(XX.AuthError["1100"],403,{"decodedrole":decodedrole,"definedroles":definedroles}); // TODO:dont pass this data in production
    }
    else
    {
      return true;
    }
  }
    
}

//middleware not tested                
let Authorization = function(definedroles)  // should be used after authentication otherwise will give error
{
  return function(req,res,next)
  {
    try {
      if(req.roles)
      {
    if(authorize(req.roles,definedroles))
    {
      next();
    }
    else
    {
      throw new AppError(XX.CriticalApplicationError["6001"],500);
    }
   }
      else
      {
        throw new AppError(XX.CriticalApplicationError["6001"],500);   //no use found
      }
  } catch (ex) {
      next(ex);
  }
  }
}

//mix of two  both Authentication and authorisation
let Auth = function(definedroles)
{
  return async function(req,res,next)
  {
    try {
    let decoded = await authenticate(req.headers['x-access-token']);
    req.id = decoded.id;
    req.role = decoded.role;
    if(authorize(req.role,definedroles))
    {
      next();
    }
    else
    {
    throw new AppError(XX.CriticalApplicationError["6001"],500);
    }
  } catch (ex) {
      next(ex);
  }
  }
}


exports.Authentication = Authentication;
exports.Authorization = Authorization;
exports.Auth = Auth;