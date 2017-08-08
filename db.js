var mongoose = require('mongoose')

var db = mongoose.connection

var ChatSchema = new mongoose.Schema({
    user_id: String, // 定义一个属性 user_id，类型为 String
    content: String, // 定义一个属性 content，类型为 String
    updated_at: Date // 定义一个属性 updated_at，类型为 Date
})
mongoose.model('Chat', ChatSchema)  // 将该 Schema 发布为 Model

db.on('error', function () {
    console.log('Connection error')
})
db.once('open', function() {
    console.log('connected!')
})

mongoose.connect('mongodb://localhost/chat')
module.exports = mongoose