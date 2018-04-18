var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
var User = require('./user');


module.exports = mongoose.model('Account', new Schema({ 
    User: User.schema,
    BookMarks:[{type:Schema.Types.ObjectId}]
}));
