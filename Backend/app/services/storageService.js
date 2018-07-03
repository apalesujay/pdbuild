'use strict'
const config = require('../../config');
const Storage = require('@google-cloud/storage');
const storage = new Storage({keyFilename:'configStorage.json'});
const Bucket  = storage.bucket('joint-207510.appspot.com');
const stream = require('stream');
const ClientError = require('../services/customErrorService').ClientError;
const XX          =require('../services/customErrorService').ErrorConstants;



exports.uploadFiles = async function (path, files, fieldname) {

  let Report;
  if (fieldname === undefined || fieldname === null) {
    throw new ClientError(XX.FILE_UPLOAD_ERROR["8001"], 400, null);
  }

  if (files === undefined || files === null) {
    throw new ClientError(XX.FILE_UPLOAD_ERROR["8002"], 400, null);
  }

  fieldname = String(fieldname);
  files = files[fieldname];
  if (!Array.isArray(files)) {
    let arr = [];
    arr.push(files);
    files = arr;
  }


  for (let file of files) {
    if (file.mimetype !== 'image/jpeg') {
      throw new ClientError(XX.FILE_UPLOAD_ERROR["8003"], 400, { msg: "incorrect mimefound => " + file.mimetype });
    }
  };

  let _uploadedfilesname = [];
  
  for (let file of files) {
    let localReadStream = new stream.PassThrough();
    localReadStream.end(file.data);

    let writefile = Bucket.file(path + file.name).createWriteStream({
      metadata: {
        contentType: file.mimetype
      },
      public: true
    });

    await new Promise((resolve, reject) => {
      localReadStream.pipe(writefile)
        .on('error', (err) => { err.report = Report; reject(err) })
        .on('finish', () => { _uploadedfilesname.push(file.name); resolve(); });
    });
    Report = { totalfiles: files.length, uploadedfiles: _uploadedfilesname.length, uploadedfilesname: _uploadedfilesname }
  }


  return Report;
}

