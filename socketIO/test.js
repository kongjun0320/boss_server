module.exports = function(server){
    const io = require('socket.io')(server)

    io.on('connection',function(socket){
        console.log('有一个客户端连接过来了')
        socket.on('sendMsg',function(data){
            console.log(data)
        })
        socket.emit('receiveMsg',{msg:'我收到了消息'})
    })

}