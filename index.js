var express = require('express')
var app = express()

var server = require('http').Server(app)
var io = require('socket.io')(server)

var fs = require('fs')  // 文件读取
var userData = JSON.parse(fs.readFileSync('./json/user.json'))

// 使 public 文件夹变成静态资源
app.use(express.static('public'))

var randomId = Math.ceil(Math.random() * 7)

app.get('/getId', function(req, res){
    console.log(userData[randomId])
    var userInfo = JSON.stringify(userData[randomId])
    console.log(userInfo)
    res.end(userInfo)
})

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
})

server.listen(80)