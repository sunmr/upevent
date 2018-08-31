const config = require('../../utils/config.js');
const common = require('../../utils/common.js');
let page = 0;
let page_size = 5; 
let GetList = function (that) {
  that.setData({
    hidden: false
  });
  wx.showNavigationBarLoading(); 
  console.log('page:'+page);
  wx.request({
    url: config.vipUrl + '/index/',
    data: {
      page: page,
      page_size: page_size
    },
    header: {
      'Content-Type': 'application/json'
    },
    success: function (res) {
      // console.log('data' + res.data[0].plnum);
      var whdthNum = res.data;
      if (whdthNum == 0) {
        that.setData({
          ShdthNum: whdthNum
        });
      }
      if(res.data != 0){
        var listData = wx.getStorageSync('vipinfoList') || []
        for (var i = 0; i < res.data.length; i++) {
          listData.push(res.data[i]);
        }
        // console.log(listData);
        wx.setStorageSync('vipinfoList', listData)
        setTimeout(function () {
          that.setData({
            vipinfoList: listData
          });
        }, 800)
        page++;
        setTimeout(function () {
          that.setData({
            hidden: true
          });
        }, 2000)
      }else{
        that.setData({
          hidden: true,
          display: false
        });
      }
      
    },
    complete: function () {
      wx.hideNavigationBarLoading(); 
      wx.stopPullDownRefresh();
    }
  })
}
// -------------------------------
Page({
  data: {
    picUrl: config.viphost,
    vipinfoList:[],
    hidden: true,
    display: true,
    ShdthNum: 1,
    viewid : 0
  },
  onLoad: function (data) {
    let that = this;
    console.log('load1');
    if(data.id){
      page = 0;
      that.setData({
        viewid:data.id
      })
    }
    try {
      wx.removeStorageSync('vipinfoList')
    } catch (e) {
    }
  },
  onShow: function () {
    var that = this;
    var ShdthNum = that.data.ShdthNum;
    console.log('indeshow:'+ShdthNum);
    if (ShdthNum == 1) {
      console.log('show1');
      GetList(that);
    }else{
      setTimeout(function () {
        try {
          var value = wx.getStorageSync('vipinfoList')
          if (value) {
            that.setData({
              vipinfoList: value,
            })
          }
        } catch (e) {
          console.log('error');
        }
      }, 1000) 
    }
    let viewid = that.data.viewid;
    console.log('viewid1:' + viewid);
    that.setData({
      viewid:0
    })   
    if (viewid!=0) {
      console.log('viewid:'+viewid);
      wx.showToast({
        title: '',
        icon: 'loading',
        duration: 2000
      })
      setTimeout(function () {
        wx.navigateTo({
          url: '../vipview/vipview?id=' + viewid,
        })
      },2000)
    }
  },

  onPullDownRefresh: function () {
    page = 0;
    this.setData({
      display: true,
      vipinfoList: []
    })
    wx.removeStorageSync('vipinfoList')
    GetList(this)
  },
  onReachBottom: function () {
    var that = this;
    setTimeout(function () {
      GetList(that)
    }, 1000)
  },
  onShareAppMessage: function () {
    var that = this;
    var picUrl = that.data.picUrl;
    return {
      title: '【向上活动】整合各类资源',
      path: '/pages/index/index?id=0'
    }
  }
})
