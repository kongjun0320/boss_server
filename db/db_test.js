const  mongoose = require('mongoose')
const md5 = require('blueimp-md5')
//连接数据库
mongoose.connect('mongodb://localhost:27017/boss_test',{
    useNewUrlParser:true
})

const UserModel =  mongoose.model('User',{
    username:{type:String,required:true},
    password:{type:String,required:true},
    type:{type:String,required:true},
    header:{type:String}
})

//保存
// const userModel = new UserModel({username:'kbbbb',password:md5('333'),type:'laoban'})
//
// userModel.save((error,data)=>{
//     console.log(error,data)
// })
//查询 查询不到返回空
// UserModel.find((error,data)=>{
//     console.log(error,data)
// })
// UserModel.findOne({username:'kdb'},(error,data)=>{
//     console.log(error,data)
// })
//修改
// UserModel.findByIdAndUpdate({_id: '5cf606266b8f530cb8a8933a'},{username:'zms'},(error,data)=>{
//     console.log(error,data)
// })
//删除
UserModel.remove({_id: '5cf606266b8f530cb8a8933a'},(error,data)=>{
    console.log(error,data)
})