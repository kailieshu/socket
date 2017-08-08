var express = require('express')
var app = express()
require('./db')
var server = require('http').Server(app)
var io = require('socket.io')(server)


var fs = require('fs')  // 文件读取
var userData = JSON.parse(fs.readFileSync('./json/user.json'))

// 使 public 文件夹变成静态资源
app.use(express.static('public'))

var randomId = Math.ceil(Math.random() * 7)


var i = 0
app.get('/getId', function(req, res){
    var userInfo = JSON.stringify(userData[i])
    
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

// 聊天部分
io.on('connection', function(socket) {
    socket.on('private', function(data) {
        console.log(socket.request.headers.cookie)
    })
    socket.on('disconnect', function() {
        console.log('user disconnected')
    })
})

server.listen(80)