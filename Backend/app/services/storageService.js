'use strict'
const config = require('../../config');
const Storage = require('@google-cloud/storage');
const storage = new Storage({ keyFilename: 'keyfile.json' });
const Bucket  = storage.bucket('nodeshivam.appspot.com');
const stream = require('stream');
const UUID = require('uuid');

//add size and name in function 
exports.uploadFiles = async function(path,files)
{
  for(let x in files)
  { 

    /*    stream method 
    let localReadStream = new stream.PassThrough();
    localReadStream.end(files[x].data);

    let writefile = Bucket.file(path+ files[x].name).createWriteStream({ 
      metadata : { 
         contentType : files[x].mimetype 
      },
      public:true
   });
 
   await new Promise((resolve, reject) => { localReadStream.pipe(writefile)
   .on('error',resolve )
   .on('finish',resolve);
   });
   */

   /** save and upload method*/  //TODO:clean file after use
   let fileobj = UUID();
   await files[x].mv('temp/'+ fileobj);
   await Bucket.upload('temp/'+fileobj,{destination: path + files[x].name,public:true,metadata:{contentType : files[x].mimetype}});
   ////  
  }

  return 'alluploaded';

}