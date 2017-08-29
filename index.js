var express = require('express')
var app = express()
var cookieParser = require('cookie-parser')
// require('./db')
var server = require('http').Server(app)
var io = require('socket.io')(server)
server.listen(8080)

// cookie
app.use(cookieParser())

var fs = require('fs')  // 文件读取
var userData = JSON.parse(fs.readFileSync('./json/user.json'))

// 使 public 文件夹变成静态资源
app.use(express.static('public'))

// 路由
var i = 0  // 根据登录顺序，依次分配 user.json 里面的角色
app.get('/getId', function(req, res){
    var userInfo = JSON.stringify(userData[i])
    res.cookie('id', userData[i].id)
    res.end(userInfo)
    i++
})
app.get('/getUserList', function(req, res) {
    var userList = []
    userData.forEach((item) => {
        if (item.id !== i) {
            userList.push(item)
        }
    })
    res.end(JSON.stringify(userList))
})

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
})

var users = []
var userId = '', userCookie
var exp = /id=[\d]+/
var msgId = ''

function getCookie(cookie) {
    var exp = /id=[\d]+/
    var userCookie = exp.exec(cookie)
    return userCookie[0].split('=')[1]
}
// 聊天部分
io.on('connection', function(socket) {
    userId = getCookie(socket.request.headers.cookie)
    users.push({id: userId, socket: socket})
    socket.on('private', function(data) {
        console.log(users)
        msgId = getCookie(socket.request.headers.cookie)
        for (var i = 0; i < users.length; i++) {
            if (users[i].id == data.toId) {
                users[i].socket.emit('private', {
                    fromId: msgId,
                    msg: data.msg
                })
            }
        }
    })
    socket.on('disconnect', function() {
        console.log('user disconnected')
    })
})

// server.listen(8080)