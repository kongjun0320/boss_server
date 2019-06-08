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
//定义chats聊天schema
const chatSchema = mongoose.Schema({
    from: {type: String, required: true}, // 发送用户的 id
    to: {type: String, required: true}, // 接收用户的 id
    chat_id: {type: String, required: true}, // from 和 to 组成的字符串
    content: {type: String, required: true}, // 内容
    read: {type:Boolean, default: false}, // 标识是否已读
    create_time: {type: Number} // 创建时间
})
// 定义能操作 chats 集合数据的 Model
const ChatModel = mongoose.model('chat', chatSchema)
// 向外暴露 Model
exports.ChatModel = ChatModel