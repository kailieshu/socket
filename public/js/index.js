window.onload = function() {
    ajax({
        method: 'GET',
        url: '/getId'
    }, function(data) {
        console.log(data)
    })

    var submitBtn = document.getElementsByClassName('btn')[0]  // 发送按钮
    var inputText = document.querySelector('textarea')
    
    submitBtn.onclick = function() {
        inputText.value = ''
    }
}

function ajax(data, callback) {
    var xhr = new XMLHttpRequest()
    xhr.open(data.method, data.url, true)
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            callback(JSON.parse(this.responseText))
        }
    }
    var params = data.params || ''
    xhr.send(params)
}