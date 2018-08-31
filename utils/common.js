// 公用方法
const wxLogin = require('login.js');
const common = {
  getNowTime: function(){
      let nowTime = this.getNowFormatDate();
      return nowTime;
   },
  // 获取当前时间
  getNowFormatDate:function() {
     var date = new Date();
     var seperator = "-";
     var month = date.getMonth() + 1;
     var strDate = date.getDate();
     if (month >= 1 && month <= 9) {
       month = "0" + month;
     }
     if (strDate >= 0 && strDate <= 9) {
       strDate = "0" + strDate;
     }
    //  console.log(date.getFullYear());
     var currentdate = date.getFullYear() + seperator + month + seperator + strDate;
     return currentdate;
  },
  // 时间戳转化函数
  timetrans: function (date) {
    var date = new Date(date * 1000);//如果date为10位不需要乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D;
  },
  // 正则判断手机号
  ifPhoneAvaliable: function (phone) {
    let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (myreg.test(phone)) {
      return true;
    } else {
      return false;
    }
  },
  // 获取AccessToken
  getAccessToken:function(url,callback){
    wx.request({
      url: url,
      method: 'GET',
      success:function(res){
        if(res.data){
          callback(res.data);
        }else{
          callback('false');
        }
      }
    })
  },
  // 报名成功消息推送
  sendMessage:function(url,callback){
    wx.request({
      url: url,
      method:'GET',
      success:function(res){
        if (res.data.errmsg == 'ok' && res.data.errcode==0){
          callback(res.data);
        }else{
          callback('false');
        }
      }
    })
  },
  // 报名方法
  baoMing: function (reqUrl,formData,callback){
    wx.request({
      url: reqUrl,
      data: formData,
      header: {
        'Content-Type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        callback(res.data);
      }
    })
  },
  // 图片上传更新数据库
  uploadPic:function(aid,imgList){
    for (let i = 0; i < imglist.length; i++) {
      (function (i) {
        wx.uploadFile({
          url: config.requestUrl + 'upload',
          filePath: imglist[0],
          name: 'files',
          formData: {
            'pid': aid
          },
          method: 'POST',
          header: {
            'Content-Type': 'multipart/form-data'
          },
          success: function (res) {
            console.log(res.data);
            if (i >= imglist.length - 1) {
              console.log('i:' + i);
              wx.showToast({
                title: '发布成功',
                icon: 'success',
                duration: 3000
              })
              that.setData({
                imglist: [],
                loading: true,
                disabled: true
              })
              setTimeout(function () {
                wx.switchTab({
                  url: '../index/index',
                })
              }, 2000)
            }
          }
        })
      })(i)
    }
  },
  ifLogin:function(){
    let openid = wxLogin.getOpenId();
    let phone = wxLogin.getPhone();
    if(openid == null){
      wx.showToast({
        title: '请先登录',
        duration: 2000
      })
      setTimeout(function () {
        wx.switchTab({
          url: '../user/user',
        })
      }, 2000)
    }else if(phone == null){
      wx.showToast({
        title: '请先登录',
        duration: 2000
      })
      setTimeout(function () {
        wx.navigateTo({
          url: '../mobile/mobile',
        })
      }, 2000)
    }else{
       return true;
    }
  }
}
module.exports = common;