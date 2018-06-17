const allReferenceRoute  = require('express').Router();
const establishment      = require('./establishment');
const feature      = require('./feature');
const locality      = require('./locality');
const cuisine      = require('./cuisine');
const dishRef      = require('./dishref');


allReferenceRoute.use('/establishment',establishment);
allReferenceRoute.use('/feature',feature);
allReferenceRoute.use('/locality',locality);
allReferenceRoute.use('/cuisine',cuisine);
allReferenceRoute.use('/dishref',dishRef);

module.exports = allReferenceRoute;