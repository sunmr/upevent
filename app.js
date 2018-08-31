//app.js
const userLogin = require("utils/login.js");
// console.log(user.getUser());
App({

  //监听小程序初始化，当小程序初始化完成时会触发发，且全局只触发一次
  onLaunch: function() {
    //console.log('app----------------执行');
    //调用API从本地缓存中获取数据
    //var logs = wx.getStorageSync('logs') || []
    //logs.unshift(Date.now())
    //wx.setStorageSync('logs', logs)
    // 获取用户openid判断是否登录
    if (userLogin.getOpenId()){
      this.globalData.openid = userLogin.getOpenId();
    }
    // 获取用户userinfo
    if (userLogin.getUser()){
      this.globalData.userInfo = userLogin.getUser();
    }
    // 获取用户手机号
    if(userLogin.getPhone()){
      this.globalData.phone = userLogin.getPhone();
    }
  },
  //用户自定义的全局数据，可以通过var app = getApp()获取app实例，再通过app.globalData.userInfo获取数据
  getUserInfo: function(cb) {
    let that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    userInfo: null,
    autor:'@2018 向上创业 版权所有',
    openid :'',
    phone:''
  }
})
