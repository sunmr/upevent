let app = getApp();
const config = require('../../utils/config.js');
const bmap = require('../../utils/bmap-wx.js');
const common = require('../../utils/common.js');
const wxLogin = require('../../utils/login.js');
let wxMarkerData = [];  
Page({
  data: {
    ak: config.baiduAk, 
    markers: [],    
    longitude:'',   
    latitude:'',     
    address:'获取中...',     
    openid: 0,
    imglist: [],
    item: '../../image/upic.png',
    loading: false,
    disabled: false,
    loadingHide: true,
    loadingText: "位置获取中",
    content:'',
    kdate: '',
    jdate: ''
  },

  kbindDateChange: function (e) {
    this.setData({
      kdate: e.detail.value
    })
  },

  jbindDateChange: function (e) {
    this.setData({
      jdate: e.detail.value
    })
  },

  formSubmit: function (e) {
    let that = this;
    let imglist = that.data.imglist;
    let formData = e.detail.value;
    let content = e.detail.value.content;
    let openid = app.globalData.openid;
    let kdate = that.data.kdate;
    let jdate = that.data.jdate;
    console.log(imglist);
    if (content.length === 0){
      wx.showToast({
        title: '内容不能为空',
        icon: 'loading',
        duration: 2000
      })
    }else{
      wx.showToast({
        title: '请稍后',
        icon: 'loading',
        duration: 4000
      })
      wx.request({
        url: config.requestUrl + 'addData/openid/' + openid + '/kdate/' + kdate + '/jdate/' + jdate,
        data: formData,
        header: {
          'Content-Type': 'application/json'
        },
        method: 'GET',
        success: function (res) {
            let aid = res.data;
            console.log('aid='+aid);
            if (imglist != '') {
              for (let i = 0; i < imglist.length; i++) {
                (function(i){wx.uploadFile({
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
                })})(i)
              }
              // common.uploadPic();
            }else {
                wx.showToast({
                  title: '发布成功',
                  icon: 'success',
                  duration: 3000
                })
                that.setData({
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
    }
  }, 

  // upsUid: function(e){
  //   let openid = e.data;
  //   wx.request({
  //     url: config.requestUrl + 'seachUser/openid/' + openid,
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     success: function (res) {
  //       if(res.data != 0){
  //         wx.navigateTo({
  //           url: '../mobile/mobile',
  //         })
  //       }
  //     }
  //   })
  // },

  onLoad:function(){
    this.getBaiduMap(); 
    let nowTime = common.getNowTime();
    this.setData({
      kdate: nowTime,
      jdate: nowTime
    });
    
    // console.log(nowTime);
  },

  onShow: function(){
    // 判断是否登录
    try {
      common.ifLogin();
    } catch (e) {

    }   
  },


  checkimg: function () {
    self = this
    // console.log('chooseImg:');
    wx.chooseImage({
      count: 1, 
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'], 
      success: function (res) {
        let tempFilePaths = res.tempFilePaths
        self.setData({
          imglist: tempFilePaths
        })
      }
    })
  },

  clearGps: function(){
    this.getBaiduMap();
  },
  getBaiduMap: function (){     
    let that = this;    
    that.setData({ loadingHide: false });
    let BMap = new bmap.BMapWX({     
        ak: that.data.ak     
    });    
    let fail = function(data) { 
        let errMsg = data.errMsg;
        if(errMsg == 'getLocation:fail auth deny'){
          that.setData({  
            latitude: 0,    
            longitude: 0,
            address:'火星网友一枚'
          })
        }else{
          that.setData({
            latitude: 0,    
            longitude: 0,
            address:'火星网友一枚'
          })
        }
        setTimeout(function () {
          that.setData({ loadingHide: true });
        }, 1000)  
    };     
    let success = function(data) {  
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