
Page({
  data: {
    autor:"",
    loadingHide: true,
    loadingText: "加载中"
  },
  callmeTap: function () {
    wx.makePhoneCall({
      phoneNumber: '0351-7171839'
    })
  },
  onLoad: function (options) {
    var autor = getApp().globalData.autor;
    this.setData({
      autor:autor
    });
    var that = this;
    that.setData({ loadingHide: false });
    setTimeout(function () {
      that.setData({ loadingHide: true });
    }, 1000)
  }
})