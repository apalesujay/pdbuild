'use Strict'

exports.createOTP = () => {
return Math.floor((Math.random() * (99999 - 10000) + 10000));
};