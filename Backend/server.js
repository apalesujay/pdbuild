'use strict'

const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const mongoose    = require('mongoose');
//custom
const config      = require('./config'); 
//dev
const morgan      = require('morgan');  


// =======================
// configuration =========
// =======================
//prod
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let port = process.env.PORT || 8080; 

mongoose.Promise = global.Promise;

//dev
mongoose.set('debug', true);   
app.use(morgan('dev'));



//connecting to db
mongoose.connect(config.database, { useMongoClient: true } ,function(err) {
   if(err)
   {
         //error handle recretion left poc
         //log error
         throw err;
   }
 }); // connect to database




//[test method-Mic testing 123]
app.get('/', function(req,res) {
  return res.status(200).send({message:"all route are good in PORT=>" + port});
});

//TODO:[CORS middleware may be {research}]  
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Cache-Control,Content-Type,x-access-token');
if (req.method === 'OPTIONS') {
  res.send(200);              //refactor this
}
else {
next();
}
});

//precheck request
// app.use(function(req, res, next) {
 
//  if ((req.method === 'POST' || req.method === 'PATCH' || req.method === 'PUT') && req.get("content-type") !== "application/json") {
//   return res
//     .status(415)
//     .send(
//       "Wrong Content Type:" +
//         req.get("content-type") +
//         "Please use /'application/json/'"
//     );
// }

// next();
// });    

// API ROUTES -------------------
const apiRoutes = require('./app/routers/allRoute');
app.use('/api', apiRoutes);  



//error handling middleware
let exceptionMiddleware = require('./app/middlewares/exceptionMiddleware');
app.use(exceptionMiddleware);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Server is listening at port =>' + port);

