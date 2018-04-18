'use strict'
var config=require('../../config');
var Logger=require('../services/loggerService');
var azure = require('azure-storage');
var blobService = azure.createBlobService(config.AzureStorageDB);
var jimp=require('jimp');
var streamifier = require('streamifier');
var uuid=   require("uuid/v1");
var AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId:'AKIAJG7T6UQSTJBTAA5Q',
  secretAccessKey:'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',
  region: 'ap-south-1'
});

var s3 = new AWS.S3();



//add size and name in function 
exports.uploadFile=function(file,callback)
{
  
  
  var params = {
    Body: file.buffer, 
    Bucket: "joint007", 
    Key: "menu1.jpg",
    ACL: 'public-read'
   };
   s3.putObject(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     console.log(data);           // successful response
     /*
     data = {
      ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"", 
      ServerSideEncryption: "AES256", 
      VersionId: "Ri.vC6qVlA4dEnjgRV4ZHsHoFIjqEMNt"
     }
     */
   });
  // var res = imagename.split(".");
  //   imagename=res[0]+'.jpg';
  // while(exist==true)
  // {
  //  blobService.doesBlobExist('jointcontainer',imagename,function(err,result,response){
  //  if(err)
  //  {
  //   console.log(err);
  //  }
  //  console.log(result);
  //  if(result.exists===true)
  //  {
  //   var random=Math.floor((Math.random()*(9-1)+1));
  //   var res = imagename.split(".");
  //   imagename=res[0]+random+'.'+res[1];
  //   console.log(imagename);
  //   exist=true;
  //  }
  //  else if(result.exists===false)
  //  {
  //    exist=false;
  //    console.log('false');
  //  }
  //  });
  // }
  
  // jimp.read(file.buffer,function(err,image)
  // {
  //   if(err)
  //     {
  //       console.log(err);
  //       console.log('Hi');
  //     }

  //     image.resize(600,600).
  //     getBuffer( jimp.MIME_JPEG, uploadToAzure);
  //   });

 // uploadToService(file.buffer);

      function uploadToService(buffer)
      {
 

 //creating uuid name 
 var imageName=uuid()+'.jpg';

 //search in azure if exist***********

 //exporting to azure
 blobService.createBlockBlobFromStream(config.ContainerStandard,imageName,stream, file.size, function(error, result,response) {
   console.log(file.size);
  if (error) {
     console.log(error);
   }
   if(response.isSuccessful==true)
     {
       
       callback(error,imageName);
       
     }
     else
     {
      callback(error,null);
     }
     
 });

}
}