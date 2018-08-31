const app = getApp();
const config = require('../../utils/config.js');
const common = require('../../utils/common.js');
Page({
  data: {
    userInfo: {},
    hasUserInfo : false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openid: null,
    autor:''
  },
  
  txtMore:function(){
    let that = this;
    let openid = that.data.openid;
    if(openid != null){
        wx.switchTab({
          url: '../index/index',
        })
    }else{
      console.log('尚未登录');
    }
  },
  onLaunch:function(){

  },
  onLoad: function () {
    let openid = app.globalData.openid;
    console.log(openid);
    let that = this;
    let autor = app.globalData.autor;
    that.setData({
      autor: autor
    });
    // console.log(app.globalData.userInfo);
    if(app.globalData.userInfo){
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },
  onShow:function(){

  },
  getUserInfo: function (e) {
    // console.log(e)
    let that = this;
    if(e.detail.userInfo){
      app.globalData.userInfo = e.detail.userInfo;
      console.log(e.detail.userInfo);
      let loginUserInfo = {
        avatarUrl: e.detail.userInfo.avatarUrl,
        nickName: e.detail.userInfo.nickName
      }
      try{
        wx.setStorageSync('userInfo', loginUserInfo);
        console.log(loginUserInfo);
      }catch(e){
        wx.showToast({
          title: '写入缓存失败',
          duration: 1000
        })
      }
      
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      }),
      wx.login({
        success: function (loginCode) {
          console.log('logincode = '+loginCode.code);
          console.log(config.requestUrl + 'GetOpenid/code/' + loginCode.code);
          wx.request({
            url: config.requestUrl + 'GetOpenid/code/' + loginCode.code,
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log('openid= '+res.data);
              app.globalData.openid = res.data;
              try{
                wx.setStorageSync('openid', res.data);
              }catch(e){
                wx.showToast({
                  title: '微信请求失败',
                  duration: 1000
                })
              }
              that.setData({
                openid: res.data
              })
              wx.showToast({
                title: '请验证手机',
                duration:2000
              })
              setTimeout(function(){
                  wx.navigateTo({
                    url: '../mobile/mobile',
                  })
              },2000);
            }
          })
        }
      })
    }else{
      console.log('用户拒绝了授权');
      wx.showToast({
        title: '为了更好的体验，请先授权',
        icon:'none',
        duration:2000
      })
    }    
  },
  // quitOut:function(){
  //   try{
  //     wx.clearStorageSync();
  //     wx.showToast({
  //       title: '退出成功',
  //       duration: 1000
  //     })
  //   }catch(e){
  //     wx.showToast({
  //       title: '出现错误',
  //       duration: 1000
  //     })
  //   }  
  // }

})