const testUpload = require('express').Router();
const fileUpload = require('express-fileupload');
const StorageService =require('../services/storageService');
var Redis = require('ioredis');
 
// default options

 
testUpload.get('/',async function(req, res,next) {
    try {
          
      var redis = new Redis({port: 6379,          // Redis port
            host: '10.160.0.9',   // Redis host
            family: 4,           // 4 (IPv4) or 6 (IPv6)
            password: 'qwerty',
            db: 0});

            redis.on("error", function (err) {
                  console.log("Error " + err);
              });     
      var result =  await redis.set(req.query.key,req.query.value);
      console.log(result);
      var result1 =  await redis.get(req.query.getvalue);
      console.log(result1);
     return res.status(200).send(result + result1)
     
} catch (ex) {
      next(ex)  
}
});


module.exports = testUpload;