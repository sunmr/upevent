const config = require('../../utils/config.js');
const common = require('../../utils/common.js');
const app = getApp();
Page({
  data: {
    picUrl: config.host,
    openid: null,
    items: [],
    startX: 0, 
    startY: 0,
    nav_select_a:'nav-select',
    nav_select_b: '',
    starEndTime :{
      startTime :'',
      endTime :''
    },
    flag: ''
  },

  onLoad: function (e) {
    let that = this;
    try{
        common.ifLogin();
    }catch(e){

    }
    let openid = app.globalData.openid;
    console.log(openid);
    wx.showNavigationBarLoading();
    that.setData({
      openid : openid
    });
    // console.log(config.requestUrl + 'userMore/openid/' + openid);
    wx.request({
      url: config.requestUrl + 'bmOrder/openid/' + openid,
      data: '',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let datas = res.data;
        console.log(datas);
        if(datas == 0){
          // wx.navigateTo({
          //   url: '../mobile/mobile',
          // })
          console.log(datas);
          that.setData({
            items: res.data,
            openid: openid,
             flag:'暂未参与的活动'
          })
        }else{
          for (let i = 0; i < res.data.length; i++) {
            that.data.items.push({
              isTouchMove: false 
            })
          }
          let datas = res.data;
          for(let i=0; i<res.data.length;i++){
            datas[i]['kdate'] = common.timetrans(datas[i]['kdate']);
            datas[i]['jdate'] = common.timetrans(datas[i]['jdate']);
          }
          
          console.log(datas);
          that.setData({
            items: res.data,
            openid: openid
          })
        }
      },
      complete: function () {
        wx.hideNavigationBarLoading();
      },
    })
  },

  touchstart: function (e) {
    this.data.items.forEach(function (v, i) {
      if (v.isTouchMove)
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: this.data.items
    })
  },

  touchmove: function (e) {
    // console.log('touchmove');
    var that = this,
      index = e.currentTarget.dataset.index,
      startX = that.data.startX,
      startY = that.data.startY,
      touchMoveX = e.changedTouches[0].clientX,
      touchMoveY = e.changedTouches[0].clientY,
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.items.forEach(function (v, i) {
      v.isTouchMove = false
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) 
          v.isTouchMove = false
        else 
          v.isTouchMove = true
      }
    })
    that.setData({
      items: that.data.items
    })
  },

  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  del: function (e) {
    // var that = this;
    // var txtId = e.currentTarget.dataset.id;
    // that.data.items.splice(e.currentTarget.dataset.index, 1)
    wx.showModal({
      title: '操作提示',
      content: '删除请发送邮件uplism@uplism.com',
      showCancel: false
    })
    // wx.request({
    //   url: config.requestUrl + 'delTxt/id/' + txtId,
    //   data: '',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     that.clearData();
    //     wx.showToast({
    //       title: '已删除',
    //       icon: 'success',
    //       duration: 2000
    //     })
    //     that.setData({
    //       items: that.data.items
    //     })
    //   }
    // })

  },
  clearData: function () {
    console.log('clearData');
    var that = this;
    var openid = that.data.openid;
    wx.request({
      url: config.requestUrl + 'userMore/openid/' + openid,
      data: '',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          views: res.data,
          openid: openid
        });
      },
      complete: function () {
        wx.hideNavigationBarLoading(); 
      },
    })


  },

  tabClick: function (e) {
    console.log('tabClick');
  //   var openid = e.currentTarget.dataset.opid;
  //   this.setData({
  //     activeIndex: e.currentTarget.id,
  //     items: []
  //   });
  //   this.onLoad(openid);
  },
  swichNavA:function(){
    var that = this;
    console.log('swichA');
    let openid = that.data.openid;
    that.setData({
      nav_select_a: 'nav-select',
      nav_select_b: ''
    });
    wx.request({
      url: config.requestUrl + 'bmOrder/openid/' + openid,
      data: '',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        let datas = res.data;
        if (datas == 0) {
          // wx.navigateTo({
          //   url: '../mobile/mobile',
          // })
          that.setData({
            items: res.data,
            openid: openid,
            flag:'暂未参与的活动'
          })
        } else {
          // for (let i = 0; i < res.data.length; i++) {
          //   that.data.items.push({
          //     isTouchMove: false
          //   })
          // }
          let datas = res.data;
          for (let i = 0; i < res.data.length; i++) {
            datas[i]['kdate'] = common.timetrans(datas[i]['kdate']);
            datas[i]['jdate'] = common.timetrans(datas[i]['jdate']);
          }

          // console.log(datas);
          that.setData({
            items: res.data,
            openid: openid
          })
        }
      },
      complete: function () {
        wx.hideNavigationBarLoading();
      },
    })
  },
  swichNavB:function(){
    let that = this;
    let openid = that.data.openid;
    console.log('swichB');
    that.setData({
      nav_select_a: '',
      nav_select_b: 'nav-select'
    });
    console.log(config.requestUrl + 'userMore/openid/' + openid);
    wx.request({
      url: config.requestUrl + 'userMore/openid/' + openid,
      data: '',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let datas = res.data;
        console.log(datas);
        if (datas == 0) {
          // wx.navigateTo({
          //   url: '../mobile/mobile',
          // })
          that.setData({
            items: null,
            openid: openid,
            flag:'暂未发布的活动'
          })
        } else {
          // for (let i = 0; i < 10; i++) {
          //   that.data.items.push({
          //     isTouchMove: false
          //   })
          // }
          let datas = res.data;
          console.log(datas);
          for (let i = 0; i < res.data.length; i++) {
            datas[i]['kdate'] = common.timetrans(datas[i]['kdate']);
            datas[i]['jdate'] = common.timetrans(datas[i]['jdate']);
          }

          console.log(datas);
          that.setData({
            items: res.data,
            openid: openid
          })
        }
      },
      complete: function () {
        wx.hideNavigationBarLoading();
      },
    })
  }
})