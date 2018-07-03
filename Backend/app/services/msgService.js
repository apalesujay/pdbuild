'use Strict'
const SendOtp = require('sendotp');
const config  = require('../../config');


exports.createOTP = () => {
return Math.floor((Math.random() * (99999 - 10000) + 10000));
};


//for msgotp

let sendOtp = new SendOtp(config.SMSAuthKey,'Please use {{otp}} to verify your NewDish account.');

exports.sendSMS = function (number,otp) {
   return new Promise((resolve,reject) => {
  sendOtp.send(number,config.SMSTitle,otp,function (error,data,response) {
    if (error) {
        console.log(error);
      reject(error);
    }
    if (data) {
        console.log(data);
      resolve(data);  //TODO log it somewhere
    }
  });
});
}


exports.resendSMS = function(number,otp)
{
    return new Promise((resolve,reject) => {
    sendOtp.retry(number, false, function (error, data, response) {
        if(error)
        {
            reject(error);
        }
        if(data)
        {
            resolve(data);
        }
      });
    });
}

exports.verifySMS = function (number,otp)
{
    return new Promise((resolve,reject) => {
    sendOtp.verify(number,otp, function (error, data, response) {
        if(error)
        {
            reject(error);
        }
        console.log(data); // data object with keys 'message' and 'type'
        if(data.type === 'success') resolve(1);  //otp verification success
        if(data.type === 'error') resolve(0); //otp verification failed
      });
    });
}