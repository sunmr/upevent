const bmap = require('../../utils/bmap-wx.js');
const config = require('../../utils/config.js');
const wxLogin = require('../../utils/login.js');
const common = require('../../utils/common.js');
let wxMarkerData = [];  
Page({
  data: {
    ak: config.baiduAk, 
    markers: [],
    longitude: '',   
    latitude: '',    
    address: '获取中...',     
    openid: 0,
    loading: false,
    disabled: false,
    loadingHide: true,
    loadingText: "位置获取中",
    content: '',
    vid:0,
    phone: '',
    xingming: '',
    conpany:'',
    cate:''
  },

  formSubmit: function (e) {
    let that = this;
    let formData = e.detail.value;
    let openid = that.data.openid;
    let vid = that.data.vid;
    let phone = that.data.phone;
    let realname = formData.xingming;
    let conpany = formData.conpany;
    let job = formData.content;
    // cate=2官方活动 cate=1个人活动
    let cate = that.data.cate;
    // sendmessage 消息推送
    let formId = e.detail.formId;
    let messageUrl = config.tokenUrl + '?openId=' + openid + '&formId=' + formId+'&eventid='+vid+'&cate='+cate;
    console.log(messageUrl); 
    console.log('formData'+formData);
    // return 0;
    let reqUrl;
    if(cate==1){
      reqUrl = config.requestUrl + 'baoMing/openid/' + openid + '/tels/' + phone;
    }else if(cate==2){
      reqUrl = 'https://www.upcoll.com/event/'+vid+'/orderWechat/'+phone;
    }
    if(realname==''){
       wx.showToast({
         title: '请填写真实姓名',
         duration: 2000,
         icon:'none'
       })
       return 0;
    }
    if(conpany == ''){
      wx.showToast({
        title: '请填写单位',
        icon:'none',
        duration:2000
      })
      return 0;
    }
    if(job == ''){
      wx.showToast({
        title: '请填写职位',
        duration: 2000,
        icon: 'none'
      })
      return 0;
    }
    // console.log('p:'+phone);
      wx.showToast({
        title: '请稍后',
        icon: 'loading',
        duration: 4000
      })
      common.baoMing(reqUrl,formData,function(data){
          wx.setStorageSync('realname', formData.xingming);
          wx.setStorageSync('job', formData.content);
          wx.setStorageSync('conpany',formData.conpany);
          common.sendMessage(messageUrl, function (res) {
          wx.showToast({
            title: '报名成功',
            icon: 'success',
            duration: 3000
          })
          that.setData({
            loading: true,
            disabled: true
          })
          if(cate==1){
            setTimeout(function () {
              wx.redirectTo({
                url: '../view/view?id=' + vid
              })
            }, 2000)
          }
          if(cate==2){
            setTimeout(function () {
              wx.redirectTo({
                url: '../vipview/vipview?id=' + vid
              })
            }, 2000)
          }
        })
      })
      // wx.request({
      //   url: reqUrl,
      //   data: formData,
      //   header: {
      //     'Content-Type': 'application/json'
      //   },
      //   method: 'GET',
      //   success: function (res) {
      //     console.log(res.data);
      //     wx.setStorageSync('realname', formData.xingming);
      //     wx.setStorageSync('job', formData.content);
      //     wx.setStorageSync('conpany',formData.conpany);
      //     wx.showToast({
      //       title: '报名成功',
      //       icon: 'success',
      //       duration: 3000
      //     })
      //     that.setData({
      //       loading: true,
      //       disabled: true
      //     })
      //     if(cate==1){
      //       setTimeout(function () {
      //         wx.redirectTo({
      //           url: '../view/view?id=' + vid
      //         })
      //       }, 2000)
      //     }
      //     if(cate==2){
      //       setTimeout(function () {
      //         wx.redirectTo({
      //           url: '../vipview/vipview?id=' + vid
      //         })
      //       }, 2000)
      //     }
      //   }
      // })
  },

  onLoad: function (res) {
    try{
      common.ifLogin();
    }catch(e){

    }
    let phone = wxLogin.getPhone();
    let openid = wxLogin.getOpenId();
    console.log('res:'+res.vid);
    this.setData({
      vid: res.vid,
      phone: phone,
      openid:openid,
      cate:res.cate
    })
    this.getBaiduMap(); 

    
  },

  onShow: function () {
    var that = this;
    let realname = wx.getStorageSync('realname');
    let job = wx.getStorageSync('job');
    let conpany = wx.getStorageSync('conpany')
    console.log('realname:'+realname+'job:'+job);
    that.setData({
      realname: realname,
      job:job,
      conpany:conpany,
      disabled: false,
      loading: false
    })
  },

  clearGps: function () {
    this.getBaiduMap();
  },
  getBaiduMap: function () {
    var that = this;
    that.setData({ loadingHide: false });
    var BMap = new bmap.BMapWX({
      ak: that.data.ak
    });
    var fail = function (data) {
      var errMsg = data.errMsg;
      if (errMsg == 'getLocation:fail auth deny') {
        that.setData({
          latitude: 0,
          longitude: 0,
          address: '火星网友一枚'
        })
      } else {
        that.setData({
          latitude: 0,
          longitude: 0,
          address: '火星网友一枚'
        })
      }
      setTimeout(function () {
        that.setData({ loadingHide: true });
      }, 1000)
    };
    var success = function (data) {
      wxMarkerData = data.wxMarkerData;
      that.setData({
        markers: wxMarkerData,
        latitude: wxMarkerData[0].latitude,
        longitude: wxMarkerData[0].longitude,
        address: wxMarkerData[0].address,
      });
      setTimeout(function () {
        that.setData({ loadingHide: true });
      }, 1000)
    }; 
    BMap.regeocoding({
      fail: fail,
      success: success
    });
  }

})