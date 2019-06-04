let express = require('express');
let router = express.Router();
const {UserModel} = require('../db/models')
const md5 = require('blueimp-md5')

const filter = {password:0,__v:0}

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', {title: 'Express'});
});
//注册路由
router.post('/register', (req, res) => {
    let {username, password, type} = req.body
    UserModel.findOne({username}, (error, data) => {
        if (data) {
            res.send({code: 1, msg: '用户名已存在'})
        } else {
            new UserModel({username, password: md5(password), type}).save((error, data) => {
                if (error) {
                    res.send({code: 5, msg: '服务器正忙...'})
                } else {
                    const user = {username, type, _id: data._id}
                    res.cookie('userid', data._id, {maxAge: 1000 * 60 * 60 * 24})
                    res.send({code: 0, data:user})
                }
            })
        }
    })
})
//登录路由
router.post('/login',(req,res)=>{
    const {username,password} = req.body
    UserModel.findOne({username,password:md5(password)},filter,(error,data)=>{
        if(error){
            res.send({code:5,msg:'服务器正忙...'})
        }else{
            if(data){
                res.cookie('userid',data._id,{maxAge:1000*60*60*24})
                res.send({code:0,data})
            }else{
                res.send({code:1,msg:'用户名或者密码错误'})
            }
        }
    })
})

module.exports = router;
