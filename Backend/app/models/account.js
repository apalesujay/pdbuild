var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
//User = require('./user');

let User = mongoose.model('User', new Schema({ 
    Name: String, 
    Password: String,
    Email:{ type:String },
    Mob:{ type:String,unique:true },
    IsAuthenticatedEmail:{ type:Boolean,default:false },
    TempEmailLink:{ type:String,default:null },
    IsAuthenticatedMob:{ type:Boolean,default:false },
    TempMobLink:{ type:String,default:null },
    Role:[{ type:String, enum:['USER','OWNER','ADMIN'],default:'USER' }],
    Created:{ type:Date,default:Date.now }
    
},{_id:false}));


let Account = mongoose.model('Account', new Schema({ 
    User: User.schema,
    FavEatery:[{type:Schema.Types.ObjectId}],
    FavDish:[{type:Schema.Types.ObjectId}]
}));

module.exports = {Account,User}
