const route = require('express').Router();
const textController = require('../controllers/testController');
const textController2 = require('../controllers/ReferenceController');

route.use('/hello',textController);
route.use('/Establishment',textController2);

module.exports = route;