let express = require('express');
let router = express.Router();
const {UserModel,ChatModel} = require('../db/models')
const md5 = require('blueimp-md5')

const filter = {password: 0, __v: 0}

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
                    res.send({code: 0, data: user})
                }
            })
        }
    })
})
//登录路由
router.post('/login', (req, res) => {
    const {username, password} = req.body
    UserModel.findOne({username, password: md5(password)}, filter, (error, data) => {
        if (error) {
            res.send({code: 5, msg: '服务器正忙...'})
        } else {
            if (data) {
                res.cookie('userid', data._id, {maxAge: 1000 * 60 * 60 * 24})
                res.send({code: 0, data})
            } else {
                res.send({code: 1, msg: '用户名或者密码错误'})
            }
        }
    })
})
//登录路由
router.post('/update', (req, res) => {
    let user = req.body
    let userid = req.cookies.userid
    if (!userid) {
        return res.send({code: 1, msg: '请先登录'})
    }
    UserModel.findByIdAndUpdate({_id: userid}, user, (error, oldUser) => {
        if (error) {
            res.send({code: 5, msg: '服务器忙，请稍后重试'})
        } else {
            if (oldUser) {
                let {_id, username, type} = oldUser
                let data = Object.assign(user, {_id, username, type})
                res.send({code: 0, data})
            } else {
                req.clearCookie('userid')
                res.send({code: 1, msg: '请先登陆'})
            }
        }
    })
})
//获取登录用户的路由
router.get('/user', (req, res) => {
    const userid = req.cookies.userid
    if (!userid) {
        res.send({code: 1, msg: '请先登录'})
    }
    UserModel.findOne({_id: userid}, filter, (error, user) => {
        res.send({code: 0, data: user})
    })
})
//获取用户列表
router.get('/userlist',(req,res)=>{
    const {type} = req.query
    UserModel.find({type},filter,(error,users)=>{
      res.send({code:0,data:users})
    })
})


router.get('/msglist', function (req, res) {
// 获取 cookie 中的 userid
    const userid = req.cookies.userid
// 查询得到所有 user 文档数组
    UserModel.find(function (err, userDocs) {
// 用对象存储所有 user 信息: key 为 user 的_id, val 为 name 和 header 组成的 user 对象
        const users = {} // 对象容器
        userDocs.forEach(doc => {
            users[doc._id] = {username: doc.username, header: doc.header}
        })
        /*查询 userid 相关的所有聊天信息
        参数 1: 查询条件
        参数 2: 过滤条件
        参数 3: 回调函数
        */
        ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, function (err,
                                                                                  chatMsgs) {
// 返回包含所有用户和当前用户相关的所有聊天消息的数据
            res.send({code: 0, data: {users, chatMsgs}})
        })
    })
})
/*修改指定消息为已读
*/
router.post('/readmsg', function (req, res) {
// 得到请求中的 from 和 to
    const from = req.body.from
    const to = req.cookies.userid

    /*更新数据库中的 chat 数据
    参数 1: 查询条件
    参数 2: 更新为指定的数据对象
    参数 3: 是否 1 次更新多条, 默认只更新一条
    参数 4: 更新完成的回调函数
    */
    ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function (err,
                                                                                     doc) {
        console.log('/readmsg', doc)
        res.send({code: 0, data: doc.nModified}) // 更新的数量
    })
})

module.exports = router;
