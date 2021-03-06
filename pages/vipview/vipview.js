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
    cate:'2',
    hidden:true,
    username:'向上创业'
  },

  onShow: function () {
  },


  onLoad: function (params) {
    var that = this;
    if(wxLogin.getUser()){
      let user = wxLogin.getUser();
      that.setData({
        username:user.nickName
      })
    }
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
        // 初始化canvas
        that.canvansInit();
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
  //分享
  onShareAppMessage: function (res) {
    var that = this;
    console.log('url:' + that.data.view_id);
    return {
      title: '【官方活动】'+that.data.views.title,
      path: '/pages/vipevent/vipevent?id=' + that.data.view_id,
      imageUrl: that.data.picUrl + that.data.views.cover
    }
  },
  //分享图片 到朋友圈
  canvansInit:function(){
    let that = this;
    let title = that.data.views.title;
    let username = that.data.username+"@你，加入向上活动";
    console.log('ti', title);
    let promise1 = new Promise(function(resolve,reject){
       wx.getImageInfo({
         src: '../../image/qrcode.jpg',
         success:function(res){
           resolve(res);
         }
       })
    })
    let promise2 = new Promise(function(resolve,reject){
      wx.getImageInfo({
        src: '../../image/bg.png',
        success:function(res){
          resolve(res);
        }
      })
    })
    Promise.all([promise1,promise2]).then(res => {
        console.log('canvas'+res);
        const ctx = wx.createCanvasContext('shareImg')
        
        ctx.drawImage('../../'+res[1].path,0,0,545,770);
        ctx.drawImage('../../' + res[0].path, 190, 500, 180, 180);
        ctx.setTextAlign('center');
        ctx.setFillStyle('#ffffff');
        ctx.setFontSize(24);
        ctx.fillText(title,545/2,771/2);
        ctx.fillText(username, 545 / 2, 800/2+30);

        ctx.stroke();
        ctx.draw();
        
    })
  },
  share:function(){
    let that = this;
    wx.showLoading({
      title: '努力生成中...',
    })
    wx.canvasToTempFilePath({
      x:0,
      y:0,
      width: 545,
      height: 771,
      destWidth: 545,
      destHeight: 771,
      canvasId: 'shareImg',
      success:function(res){
        console.log(res.tempFilePath);
        that.setData({
          prurl:res.tempFilePath,
          hidden:false
        })
        wx.hideLoading()
      },
      fail:function(res){
        console.log(res);
      }
    })
  },
  save:function(){
    let that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.prurl,
      success(res){
        wx.showModal({
          title: '保存分享图',
          content: '图片已保存到相册，赶紧分享给朋友吧',
          showCancel:false,
          confirmText:'确认',
          confirmColor:'#72B9C3',
          success:function(res){
            if(res.confirm){
              console.log('用户点击确定');
              that.setData({
                hidden:true
              })
            }
          }
        })
      }
    })
  }
})