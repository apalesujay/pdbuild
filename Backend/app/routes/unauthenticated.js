'use strict';



module.exports = function(apiRoutes) {
//[Mic Testing 123]
apiRoutes.get('/', function(req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
  });

var appManagement=require('../controllers/appManagementController');
apiRoutes.post('/checkAppUpgradation',appManagement.checkAppUpgradation);


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

var geoController=require('../controllers/GeoController');
apiRoutes.get('/getLocation/:lat?/:lon?',geoController.getLoctaion);


}
