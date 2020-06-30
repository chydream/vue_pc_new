import CryptoJS from 'crypto-js'
// url加密
export function encryptStr (word, keyStr) {
    keyStr = keyStr != undefined ? keyStr : 'abcdefgabcdefg12'
    var srcs = CryptoJS.enc.Utf8.parse(word)
    var encrypted = CryptoJS.AES.encrypt(srcs, keyStr)
    return encrypted.toString()
}
// url解密
export function decryptStr (word, keyStr) {  
    keyStr = keyStr != undefined ? keyStr : 'abcdefgabcdefg12'
    var decrypt = CryptoJS.AES.decrypt(word, keyStr)
    return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}
// 给localstorage设置过期时间
export function setLocal (key, value, exp) {
    var cur = new Date().getTime()
    localStorage.setItem(key, value)
    localStorage.setItem('timeSet', JSON.stringify({curTime: cur, expTime: exp}))
}
// 获取localStorage
export function getLocal (key) {
    var itemValue = localStorage.getItem(key)
    var timeSet = localStorage.getItem('timeSet')
    if (itemValue != undefined) {
        var dataObj = JSON.parse(timeSet)
        if (new Date().getTime() - dataObj.curTime > dataObj.expTime) {
            console.log('信息已过期')
            localStorage.removeItem(key)
            return undefined
        } else {
            return itemValue
        }
    } else {
        return undefined
    }
}
// 获取索引
export function getArrIndex (arr, value) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].value == value) {
            return i
        }
    }
}
// 数组去重
export function unique (arr) {
    var newArr = []
    for (var i = 0; i < arr.length; i++) {
        if (newArr.indexOf(arr[i]) < 0) {
            newArr.push(arr[i])
        }
    }
    return newArr
}
// 全屏插件
export const reqFullScreen = () => {
    if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen()
    } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen()
    } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen()
    }
}
export const exitFullScreen = () => {
    if (document.documentElement.requestFullScreen) {
        document.exitFullScreen()
    } else if (document.documentElement.webkitRequestFullScreen) {
        document.webkitCancelFullScreen()
    } else if (document.documentElement.mozRequestFullScreen) {
        document.mozCancelFullScreen()
    }
}
// 复制方法
export function copayData () {
    var copy = document.getElementById('walletAddress')
    copy.select() // 选择对象
    document.execCommand('Copy') // 执行浏览器复制命令
    this.showToast = true
    this.toastData = '复制充值地址成功'
}
// 图片上传base64
export function uploadImg () {
    var self = this
    var imgFiles = document.getElementById('myFile').files
    for (var i = 0; i < imgFiles.length; i++) {
        var reader = new FileReader()
        var imgSrc
        reader.onload = function (e) {
            imgSrc = e.target.result
            self.payImage.push(imgSrc)
        }
        reader.readAsDataURL(imgFiles[i])
    }
}
// 图片上传FormData
export function uploadImgFormData () {
    var self = this
    self.imgLoading = true
    var imgFiles = document.getElementById('myFile').files[0]
    var fd = new FormData()
    fd.append('uploadFile', imgFiles)
}
// 动态获取根地址
export function getUrlRoot () {
    var baseUrl = location.protocol + '//' + location.host
    var pattern = /(127)|(localhost)|(file)/
    if (pattern.test(baseUrl)) {
        baseUrl = 'http://192.168.12.223:8878/fjhswl-server' 
    } else {
        baseUrl = 'http://114.115.148.14:8763/fjhswl-server'
    }
    return baseUrl
}
// 获取页面卷去的高度
export function getScrollTop () {
    var scrollTop = 0
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop
    } else if (document.body) {
        scrollTop = document.body.scrollTop
    }
    return scrollTop
}
// 获取页面客户端高度
export function getClientHeight () {
    var clientHeight = 0
    if (document.body.clientHeight && document.documentElement.clientHeight) {
        clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight
    } else {
        clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight
    }
    return clientHeight
}
// 获取页面滚动高度
export function getScrollHeight () {
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
}
export function getTree (res) {
  var treeData = res.data
  for (var i = 0; i < treeData.length; i++) {
    treeData[i].children = []
    for (var j = 0; j < treeData.length; j++) {
      if (treeData[i].agentId == treeData[j].parentAgentId) {
        treeData[i].children.push(treeData[j])
      }
    }
  }
  var treeDataFix = []
  for (var z = 0; z < treeData.length; z++) {
    if (treeData[z].parentAgentId == '') {
      treeDataFix.push(treeData[z])
    }
  }
  this.treeData = treeData
}
// 递归
export function setDeptData (arr) { 
  arr.forEach((item, index) => {
    if (item.children && item.children.length > 0) {
      // item.disabled = true
      // item.authorityList.forEach((item, i) => {
      //   item.authorityList[i].checked = false
      // })
      this.setDeptData(item.children)
    } else {
      // arr[index].disabled = true
      // arr[index].authorityList.forEach((item, i) => {
      //   arr[index].authorityList[i].checked = false
      // })
    }
  })
  return arr
}
// 扁平化
export function flatNavList (arr) {
  for (let v of arr) {
    if (v.children && v.children.length) {
      this.flatNavList(v.children)
    } else {
      this.permissionList.push(v)
    }
  }
}
// 扁平化生成树
function getTree1 (treeData) {
  for (var i = 0; i < treeData.length; i++) {
    treeData[i].children = []
    for (var j = 0; j < treeData.length; j++) {
      if (treeData[i].Id == treeData[j].RecordNodeParentId) {
        treeData[i].children.push(treeData[j])
      }
    }
  }
  for (i = 0; i < treeData.length; i++) {
    if (treeData[i].RecordNodeParentId == '') {
      var arr = []
      arr.push(treeData[i])
      this.option.data = arr
    }
  }
}

/* eslint-disable */
function openurl(url) {
  //创建A标签
  var a = document.createElement('a')
  // 给创建好的a标签赋值
  a.setAttribute('href', url)
  // 设置css 隐藏属性
  a.setAttribute('style', 'display:none')
  // 设置 a标签为新窗口打开
  a.setAttribute('target', '_blank')
  // 将设置好的a标签，添加到 body 内
  document.body.appendChild(a)
  // 模拟点击
  a.click()
  // 移除a标签
  a.parentNode.removeChild(a)
}

// 附件下载方法 responseType:'blob'
export function exportExcel (res) {
  var fileName = res.headers['content-disposition'].split(';')[1].split('=')[1].split('.')[0]
  var el = document.createElement('a')
  document.body.appendChild(el)
  el.style.display = 'display:none'
  el.download = fileName + '.xls'
  el.href = URL.createObjectURL(res.data)
  el.click()
}
