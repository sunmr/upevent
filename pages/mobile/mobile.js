const app = getApp()
const maxTime = 60
let currentTime = maxTime 
let interval = null
const config = require('../../utils/config.js');
const util = require('../../utils/util.js');
const common = require('../../utils/common.js');
const wxlogin = require('../../utils/login.js');
Page({
  data: {
    userInfo: {},
    btnName: '获取验证码',
    disabled: false,
    mobile: '1234567890',
    msCodes: '0',
    openid: 0
  },
// 正则判断手机号
  mobileInputEvent: function (ev) {
    let mobile = ev.detail.value;
    let ifAble = common.ifPhoneAvaliable(mobile);
    if (ifAble){
      this.setData({
        mobile: ev.detail.value
      })
    }
  },
// 发送验证码
  reSendPhoneNum: function (e) {
    let that = this;
    let tel = that.data.mobile;
    console.log(tel);
    if (tel == '1234567890') {
      wx.showToast({
        title: '请填正确手机号',
        icon: 'loading',
        duration: 1000
      })
    } else {
        currentTime = maxTime;
        interval = setInterval(function () {
          currentTime--
          that.setData({
            time: '(' + currentTime + 's)',
            disabled: true,
            btnName: '请稍后'
          })
          if (currentTime <= 0) {
            currentTime = -1
            clearInterval(interval)
            that.setData({
              time: '',
              disabled: false,
              btnName: '重新获取'
            })
          }
        }, 1000)
        setTimeout(function () {
          wx.request({          
            url: config.smsUrl + 'sendCode',
            data: {
                'tel':tel
            },
            header: {
              'Content-Type': 'application/json'
            },
            success: function (e) {
              console.log(e.data);
              that.setData({
                msCodes: e.data
              })
            }
          })
        }, 1000)
        wx.showToast({
          title: '发送成功',
          icon: 'success',
          duration: 1000
        })
    }
  },

  formBindsubmit: function (e) {
    let that = this;
    let formData = e.detail.value;
    let openid = that.data.openid;
    let msCode = that.data.msCodes; 
    let telCode = e.detail.value.telCode;
    let mobile = that.data.mobile;
    let nickName = e.detail.value.nickName;
    let avatarUrl = e.detail.value.avatarUrl;
    console.log('avatarUrl:' + avatarUrl);
    console.log('formData:' + JSON.stringify(formData));
    // return 0;
    if (mobile == '1234567890'){
      wx.showToast({
        title: '请填手机号',
        icon: 'loading',
        duration: 1000
      })
    }else{
      if (msCode == telCode) {
        wx.request({
          url: config.smsUrl + 'regUser',
          method : 'POST',
          data: {
            tel:mobile,
            openid : openid,
            nickName : nickName,
            avatarUrl:avatarUrl 
          },
          
          header: {
             "Content-Type": "application/x-www-form-urlencoded" ,
          },
          success: function (e) {
            console.log(e.data);
            try{
               wx.setStorageSync('phone', mobile);
               app.globalData.phone = mobile;
            }catch(e)
            {
              wx.showToast({
                title: '缓存失败',
                icon: 'false',
                duration: 1000
              })
            }
            wx.showToast({
              title: '验证通过',
              icon: 'loading',
              duration: 1000
            })
            setTimeout(function () {
              wx.switchTab({
                url: '../user/user',
              })
            }, 1200)
          }
        })
      } else {
        wx.showToast({
          title: '验证码错误',
          icon: 'loading',
          duration: 1000
        })
      }
    }
  },

  onLoad: function (options) {
    let that = this;
    let openId = app.globalData.openid;
    // console.log(openId);
    let autor = getApp().globalData.autor;
    that.setData({
      autor: autor,
      openid : openId
    });
    // 获取全局常量openid，userinfo 判断是否登录
    
    let userInfo = app.globalData.userInfo;
    if(userInfo&&openId){
      that.setData({
        userInfo:userInfo
      })
    }else{
      // wx.switchTab({
      //   url: '../user/user',
      // })
      console.log('not login');
      wx.showToast({
        title: '请先微信登录',
        icon:false,
        duration:2000,
        success:function(){
          setTimeout(function(){
            wx.switchTab({
              url: '../user/user',
            })
          },2000)
        }
      })
    }
    // console.log(openId);
    // console.log(userInfo);
    // if(openUId)
  }  
})