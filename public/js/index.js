window.onload = function () {
    var socket = io.connect('http://localhost')
  var myInfo, userInfo, otherInfo
  var friend = document.getElementsByClassName('friend-inside')[0]
  ajax({
    method: 'GET',
    url: '/getId'
  }, function (data) {
    myInfo = JSON.parse(data)
    document.cookie = 'id=' + myInfo.id
    console.log(document.cookie)
    ajax({
      method: 'GET',
      url: '/getUserList'
    }, function (data) {
      userInfo = JSON.parse(data)
      var fragment = document.createDocumentFragment()
      // for (var i = 0; i < d.length; i++)
      userInfo.forEach((item) => {
        var node = document.createElement('div')
        node.className = 'friend-item'
        node.innerHTML = `
            <img src=${item.img} class="friend-img"/>
            <div class="friend-text">
                <p class="friend-name">${item.name}</p>
                <p class="friend-describe">${item.des}</p>
            </div>
        `
        fragment.appendChild(node)
      })
      friend.appendChild(fragment)
    })
  });

  // 发送消息
  (function () {
    var submitBtn = document.getElementsByClassName('btn')[0] // 发送按钮
    var inputText = document.querySelector('textarea')
    submitBtn.onclick = function () {
        var chatClass = 'chat-' + otherInfo.id
        var chatDetail = document.getElementsByClassName(chatClass)[0]
      var fragment = document.createDocumentFragment()
      var li = document.createElement('li')
      li.className = 'chat-item chat-mine'
      li.innerHTML = `
        <img src=${myInfo.img} class="chat-img"/>
        <div class="chat-text">
            <div class="chat-name">
                ${myInfo.name}
            </div>
            <div class="chat-content">
                ${inputText.value}
            </div>
        </div>
    `
      chatDetail.appendChild(li)
      
      socket.emit('private', {from: myInfo.id, to: otherInfo.id, msg: inputText.value})

      inputText.value = ''
    }
  })();


  // 好友列表事件
  (function () {
    var friends = document.getElementsByClassName('friend-inside')[0]
    friends.onclick = function (e) {
      friends.childNodes.forEach((item) => {
        item.className = 'friend-item'
      })

      var target = e.target
      var currentTarget = e.currentTarget
      while (target !== currentTarget) {
        target = target.parentNode
        if (target.className === 'friend-item') {
            var userName = target.getElementsByClassName('friend-name')[0]
            for (var i = 0; i < userInfo.length; i++) {
                if (userInfo[i].name === userName.innerText) {
                    otherInfo = userInfo[i]
                }
            }
            var chatClass = 'chat-' + otherInfo.id
            var chatDetails = document.getElementsByClassName('chat-detail') || []
            if (chatDetails.length > 0) {
                for (var i = 0; i < chatDetails.length; i++) {
                    chatDetails[i].style.opacity = 0
                    chatDetails[i].style.zIndex = 1
                }
            }
            
            var element = document.getElementsByClassName(chatClass)[0] || ''
            var chatHistory = document.querySelector('.chat-history')
            if (element == '') {
                var chatDetailN = document.createElement('ul')
                chatDetailN.className = 'chat-detail chat-' + otherInfo.id
                chatDetailN.style.zIndex = 100
                chatDetailN.style.opacity = 1
                chatHistory.appendChild(chatDetailN)
            } else {
                element.style.zIndex = 100
                element.style.opacity = 1
            }
            
          target.className = 'friend-item active'
          break
        }
      }
    }
  })()
}

function ajax (data, callback) {
  var xhr = new XMLHttpRequest()
  xhr.open(data.method, data.url, true)
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      callback(this.responseText)
    }
  }
  var params = data.params || ''
  xhr.send(params)
}
