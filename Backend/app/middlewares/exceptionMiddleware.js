'use strict'
const serializeError = require('serialize-error');
var Logger = require('../services/loggerService');
var Slack = require('../services/slackService');

module.exports = function(err,req,res,next)
{
    console.log(err);
    console.log(req.url);
    var _id;
    if(req && req.decoded && req.decoded.id)
    {
       _id = req.decoded.id; 
    }
    else
    {
        _id = null
    }
    var error = serializeError(err);
    error.userid = _id;
    error.location = req.url;
    error.paramlist = {body:req.body,query:req.query,params:req.params};
//Logger.logger(err,_id,req.body,'Exception MiddleWare',err.stack);
  Slack.sendToSlack(error.name,error.status);
res.status(500).send(error);
}
//{linenumber:error.linenumber,message:error.message,status:error.stack,number:error.number,guid:error.guid,full:error}

////520 Unknown Error////
//The 520 error is used as a "catch-all response for when the origin server returns something unexpected", listing connection resets, large headers, and empty or invalid responses as common triggers.