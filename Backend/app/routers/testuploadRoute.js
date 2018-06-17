const testUpload = require('express').Router();
const fileUpload = require('express-fileupload');
const Jimp = require('jimp');
 
// default options

 
testUpload.post('/',fileUpload(),async function(req, res,next) {
    try {
        
    
  if (!req.files){
    return res.status(400).send('No files were uploaded.');
      }
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  console.log(req.files);

//   for(let x in req.files)
//   {
//       req.files[x].mv('../../' + req.files[x].name, function(err) {
//         if (err)
//         {
//           return res.status(500).send(err);
//         }
        
//       });
      
//   }

    var img = await Jimp.read(sampleFile.data);
     await  img.resize(256, 256)     
    .quality(60)                 // set JPEG quality
    .greyscale()                 // set greyscale
    .write("lena-small-bw.jpg");
    


  return res.send('Files uploaded!');
  
 
  // Use the mv() method to place the file somewhere on your server
//   sampleFile.mv('../../filename.jpg', function(err) {
//     if (err)
//     {
//       return res.status(500).send(err);
//     }
//     res.send('File uploaded!');
//   });
} catch (ex) {
      next(ex)  
}
});


module.exports = testUpload;