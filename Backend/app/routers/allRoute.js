const router = require("express").Router();



const userRoutes = require('../routers/userRoutes');
const eateryRoutes = require('../routers/eateryRoute');
const dishRoutes = require('../routers/dishRoute');
const myfavRoutes = require('../routers/myfavRoute');
const reviewRoute  = require('../routers/reviewRoute');
const referenceRoute = require('../routers/reference/all');
const manageRoute    = require('../routers/managerRoute');
const extraRoute   = require('../routers/extraRoute');
const toprecommended=require('../routers/toprecommended');

const testUploadRoute = require('../routers/testuploadRoute');

router.use('/additional',extraRoute);
router.use('/user',userRoutes);
router.use('/eatery',eateryRoutes);
router.use('/dish',dishRoutes);
router.use('/myfav',myfavRoutes);
router.use('/testupload',testUploadRoute);
router.use('/review',reviewRoute);
router.use('/reference',referenceRoute);
router.use('/manage',manageRoute);
router.use('/toprecommended',toprecommended);




module.exports = router;


