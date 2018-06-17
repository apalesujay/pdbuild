const router = require("express").Router();



const userRoutes = require('../routers/userRoutes');
const eateryRoutes = require('../routers/eateryRoute');
const dishRoutes = require('../routers/dishRoute');
const myListRoutes = require('../routers/myListRoute');
const reviewRoute  = require('../routers/reviewRoute');
const referenceRoute = require('../routers/reference/all');

const testUploadRoute = require('../routers/testuploadRoute');


router.use('/user',userRoutes);
router.use('/eatery',eateryRoutes);
router.use('/dish',dishRoutes);
router.use('/mylist',myListRoutes);
router.use('/testupload',testUploadRoute);
router.use('/review',reviewRoute);
router.use('/reference',referenceRoute);




module.exports = router;


