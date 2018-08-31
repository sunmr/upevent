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
    url: config.requestUrl + 'index/',
    data: {
      page: page,
      page_size: page_size
    },
    header: {
      'Content-Type': 'application/json'
    },
    success: function (res) {
      console.log('data'+res.data);
      var whdthNum = res.data;
      if (whdthNum == 0) {
        that.setData({
          ShdthNum: whdthNum
        });
      }
      if(res.data != 0){
        var listData = wx.getStorageSync('infoList') || []
        for (var i = 0; i < res.data.length; i++) {
          listData.push(res.data[i]);
        }
        // console.log(listData);
        wx.setStorageSync('infoList', listData)
        setTimeout(function () {
          that.setData({
            infoList: listData
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
    picUrl: config.host,
    infoList:[],
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
      wx.removeStorageSync('infoList')
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
          var value = wx.getStorageSync('infoList')
          if (value) {
            that.setData({
              infoList: value,
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
          url: '../view/view?id=' + viewid,
        })
      },2000)
    }
  },

  onPullDownRefresh: function () {
    page = 0;
    this.setData({
      display: true,
      infoList: []
    })
    wx.removeStorageSync('infoList')
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
