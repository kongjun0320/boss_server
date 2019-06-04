const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/boss',{
    useNewUrlParser:true
})

const UserModel = mongoose.model('User',{
    username:{type:String,required:true},
    password:{type:String,required:true},
    type:{type:String,required:true},
    header:{type:String},
    post:{type:String},
    info:{type:String},
    company:{type:String},
    salary:{type:String},
})

exports.UserModel = UserModel