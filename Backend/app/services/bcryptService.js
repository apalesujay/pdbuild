'use Strict'

const bcrypt = require('bcryptjs');

exports.hash = function (passwprd) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(passwprd, salt);
    return hash;
} 

exports.compare= function(password,hash) {
 return bcrypt.compareSync(password,hash);
}