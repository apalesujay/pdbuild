'use strict';



module.exports = function(apiRoutes) {
//[Mic Testing 123]
apiRoutes.get('/', function(req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
  });

var appManagement = require('../controllers/appManagementController');
apiRoutes.post('/checkAppUpgradation',appManagement.checkAppUpgradation);


var restaurant=require("../controllers/RestaurantController");
apiRoutes.get('/test',restaurant.test);

//Register[no authentication middleware interfere]
var user=require('../controllers/UserController');
apiRoutes.post('/addAccount',user.addAccount);

apiRoutes.post('/createLoginOtp',user.createLoginOtp);

apiRoutes.post('/checkUserExists',user.checkUserExists);

//Authentication[no authentication middleware interfere]
apiRoutes.post('/authenticate',user.authentication);

//Authentication[no authentication middleware interfere]
apiRoutes.post('/otpAuthentication',user.otpAuthentication);


var dishController=require('../controllers/DishController');
//New Architecture Api


apiRoutes.post('/addDish',dishController.addDish);

var geoController = require('../controllers/GeoController');
apiRoutes.get('/getLocation/:lat?/:lon?',geoController.getLoctaion);

//reference
// var reference = require('../controllers/ReferenceController');
// apiRoutes.post('/Establishment',reference.postEstablishment);
// apiRoutes.get('/Establishment',reference.getEstablishment);
// apiRoutes.put('/Establishment',reference.putEstablishment);
// apiRoutes.get('/Establishment/:id',reference.preRequest,reference.middletest,reference.getEstablishmentById);
// apiRoutes.patch('/Establishment/:id',reference.preRequest,reference.patchEstablishment);
// apiRoutes.delete('/Establishment/:id',reference.preRequest,reference.deleteEsablishment)

//apiRoutes.post('/Establishmentx',reference.testEsablishment);
//testing
var testcon = require('../controllers/testController');
//apiRoutes.get('/apitest',testcon.testapi);

}
