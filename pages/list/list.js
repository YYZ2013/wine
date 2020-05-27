// pages/list/list.js
// 引入
var listData = require("../data/listdata.js")
Page({
  // 页面的初始数据
  data: {
    index: 1,
    useData: ""
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    // this.setData可以让view视图重绘
    this.setData({
      useData: listData.initData
    })
  },
  // 跳转详情页
  goListDetail:function(event){
    wx.navigateTo({
      // event.currentTarget.dataset.xxx获取自定义属性
      url: 'list-detail/list-detail?listId=' + event.currentTarget.dataset.listid
    })
  }
})