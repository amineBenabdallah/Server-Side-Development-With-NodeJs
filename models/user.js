const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    admin:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

var Users = mongoose.model('User',userSchema);

module.exports = Users;