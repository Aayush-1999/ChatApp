const mongoose = require("mongoose");

const UserSchema=new mongoose.Schema({
    id:String,
    userName:{
        type:String,
        default:null
    },
    email:{
        type:String, 
        unique:true, 
        required:true
    },
    password:String
});

module.exports=mongoose.model("User",UserSchema);