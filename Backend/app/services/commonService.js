'use strict'

var config = require('../../config');
var Logger = require('../services/loggerService');
var nodemailer = require('nodemailer');
var NodeGeocoder = require('node-geocoder');
//initialisation
var options = {
  provider: 'google',
 
  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyAnVIIstT4dTPQsWioqw_4v5MpyT-vWBWo', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};
 
var geocoder = NodeGeocoder(options);



exports.sendEmail = function () {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'shivamsharma1000@gmail.com',
      pass: 'voidmainsd'
    }
  });

  var mailOptions = {
    from: 'shivamsharma1000@gmail.com',
    to: 'shivamsharma1000@outlook.com',
    subject: 'Sending Email using Node.js',
    text: 'he bro'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}





//will return city
exports.detectLocation=function(lati,long)
{
 return geocoder.reverse({lat:lati, lon:long});
  
}