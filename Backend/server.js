// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file



//modals
var Account   = require('./app/models/account'); // get our mongoose model
var Restaurant   = require('./app/models/restaurant'); // get our mongoose model
var User   = require('./app/models/user'); // get our mongoose model
// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens

mongoose.Promise = global.Promise;
mongoose.connect(config.database,{ useMongoClient: true },function(err){
    if(err)
    {
         //error handle recretion left poc
    console.log(err);

    }
  }); // connect to database

//kind of middleware for unauthenticated user cleaner.
// function intervalFunc() {
//   console.log('Cant stop me now!');
// }

// setInterval(intervalFunc, 1500);

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));



//[test method-Mic testing 123]
app.get('/', function(req,res) {
  return res.status(200).send({message:"all route are good in PORT=>"+port});
});

//[CORS middleware may be {research}]
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
res.header('Access-Control-Allow-Headers', 'Cache-Control,Content-Type, x-access-token');
if (req.method == 'OPTIONS') {
  res.send(200);              //refactor this
}
else {
next();
}
});

//precheck request
// app.use(function(req, res, next) {
 
//  if (req.get("content-type") !== "application/json") {
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
// get an instance of the router for api routes
var apiRoutes = express.Router();
// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);  


//unauthenticated api controllers
var unauthentecatedRoutes=require('./app/routes/unauthenticated');
unauthentecatedRoutes(apiRoutes);

 
//TODO: route middleware to verify a token
var authMiddleware=require('./app/middlewares/authMiddleware');
apiRoutes.use(authMiddleware);


//authenticated api controllers
var routes=require('./app/routes/route');
routes(apiRoutes);


//error handling middleware
var exceptionMiddleware = require('./app/middlewares/exceptionMiddleware');
apiRoutes.use(exceptionMiddleware);


// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);