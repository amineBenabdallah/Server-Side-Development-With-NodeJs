const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocal = require('passport-local-mongoose');

var userSchema = new Schema({
    firstname:{
        type: String,
        default:''
    },
    lastname:{
        type: String,
        default:''
    },
    facebookId: String,
    admin:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

userSchema.plugin(passportLocal);

var Users = mongoose.model('User',userSchema);

module.exports = Users;