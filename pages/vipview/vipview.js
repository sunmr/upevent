const app = getApp();
const util = require("../../utils/util.js");
const network = require('../../utils/network.js');
const config = require('../../utils/config.js');
const wxLogin = require('../../utils/login.js');
const common = require('../../utils/common.js')
const wxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    views:'',
    picUrl: config.viphost,
    openid:'',
    vid:'',
    view_id: 0,
    userInfo: {},
    isSelf: false,
    tel: '0123456789',
    gzList: [],
    //官方活动报名
    cate:'2' 
  },

  onShow: function () {
  },


  onLoad: function (params) {
    var that = this;
    wx.showNavigationBarLoading(); 
    wx.request({
      url: config.vipUrl + '/view/id/' + params.id,
      data: {},
      method: 'GET',
      success: function (res) {
        console.log('list'+res.data.gzlist);
        console.log('params'+params.id);
        wxParse.wxParse('content', 'html', res.data['content'], that, 5);
        that.setData({
          views: res.data,
          view_id: params.id,
          gzList: res.data.gzlist
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
    // wx.login({
    //   success: function (loginCode) {
    //     wx.request({
    //       url: config.requestUrl + '/GetOpenid/code/' + loginCode.code,
    //       header: {
    //         'content-type': 'application/json'
    //       },
    //       success: function (res) {
    //         that.setData({
    //           openid: res.data
    //         })
    //       }
    //     })
    //   }
    // })

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
    let vid = that.data.view_id;
    console.log('view_id'+vid);
    wx.request({
      url: config.requestUrl +'/ifVipBm',
      data:{
        phone:phone,
        vid:vid
      },
      method:'GET',
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        console.log('resl:'+res.data);
        if(res.data!=0){
            wx.showModal({
              title: '提示',
              content: '请不要重复报名',
              showCancel:false
            })
        }else{
          wx.redirectTo({
            url: '../baoming/baoming?vid=' + that.data.view_id+'&cate='+that.data.cate,
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
    console.log('url:' + that.data.view_id);
    return {
      title: '【官方活动】'+that.data.views.title,
      path: '/pages/vipevent/vipevent?id=' + that.data.view_id,
      imageUrl: that.data.picUrl + that.data.views.cover
    }
  },
  share:function(){
     console.log('share');
  }

})