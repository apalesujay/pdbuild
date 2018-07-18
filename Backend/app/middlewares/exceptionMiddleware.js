'use strict'

var Logger = require('../services/loggerService');
var Slack = require('../services/slackService');

module.exports = function(err,req,res,next)
{
    console.log(err.status);
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
    var error = {};
    error._name = err.name;
    error._status = err.status;
    error._url = req.url;
    error._parameters = {body:req.body,query:req.query,params:req.params};
    error._userId = _id;
    error._errorStack = err.stack;
    error._error = err;

    if(error.status == 400)
    {
        Slack.sendToSlack(error);
        Logger.logger(error);
        res.status(400).send(error);
    }
    else
    {
        error._status = "500";
        Slack.sendToSlack(error);
        Logger.logger(error);
        res.status(500).send(error);
    }



}
