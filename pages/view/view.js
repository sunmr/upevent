const app = getApp();
const util = require("../../utils/util.js");
const network = require('../../utils/network.js');
const config = require('../../utils/config.js');
const wxLogin = require('../../utils/login.js');
const common = require('../../utils/common.js')
Page({
  data: {
    views:'',
    picUrl: config.host,
    openid:'',
    vid:'',
    view_id: 0,
    userInfo: {},
    isSelf: false,
    tel: '0123456789',
    gzList: [],
    // 个人活动报名
    cate:'1'  
  },

  onShow: function () {
  },


  onLoad: function (params) {
    let phone = wxLogin.getPhone();
    // ifSelf 判断是否自己发布的程序
    let ifSelf = false;
    console.log('phone:'+phone);
    var that = this;
    wx.showNavigationBarLoading(); 
    wx.request({
      url: config.requestUrl + 'view/id/' + params.id,
      data: {},
      method: 'GET',
      success: function (res) {
        console.log(res.data);
        if(phone == res.data.phone){
           ifSelf = true;
        }
        that.setData({
          views: res.data,
          vid: res.data.id,
          view_id: params.id,
          tel: res.data.phone,
          gzList: res.data.gzlist,
          ifSelf:ifSelf
        })
        wx.showLoading({
          title: '加载中'
        })
      },
      complete: function () {
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
        wx.hideNavigationBarLoading() 
      }
    })
    wx.login({
      success: function (loginCode) {
        wx.request({
          url: config.requestUrl + '/GetOpenid/code/' + loginCode.code,
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            that.setData({
              openid: res.data
            })
          }
        })
      }
    })

    // app.getUserInfo(function (userInfo) {
    //   that.setData({
    //     userInfo: userInfo
    //   })
    // })
  },

  callmeTap: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.tel
    })
  },


  bMingBtn:function(){
    try {
      common.ifLogin();
    } catch (e) {

    } 
     
      // 通过vid phone 判断用户是否已报名
    let that = this;
    let phone = wxLogin.getPhone();
    let vid = that.data.vid;
    console.log(vid);
    wx.request({
      url: config.requestUrl +'/ifBaoMing',
      data:{
        phone:phone,
        vid:vid,
      },
      method:'GET',
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        console.log(res.data);
        if(res.data!=0){
            wx.showModal({
              title: '提示',
              content: '请不要重复报名',
              showCancel:false
            })
        }else{
          wx.redirectTo({
            url: '../baoming/baoming?vid=' + that.data.vid+'&cate='+that.data.cate,
          })
        }
      }
    })     
  },


  openMaps:function(e){
    var lat = e.currentTarget.dataset.lat;
    var long = e.currentTarget.dataset.long;
    var address = e.currentTarget.dataset.address;
    wx.openLocation({
      latitude: Number(lat),
      longitude: Number(long),
      scale: 28,
      name:'信息发出位置',
      address: address
    })
  },

onShareAppMessage: function (res) {
  var that = this;
  return {
    title: '【推荐活动】'+that.data.views.title,
    path: '/pages/index/index?id=' + that.data.vid,
    imageUrl: that.data.picUrl+that.data.views.photo
  }
}

})