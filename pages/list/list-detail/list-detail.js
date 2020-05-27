// pages/list/list-detail/list-detail.js
var listData = require("../../data/listdata.js")
const backgroundAudioManager = wx.getBackgroundAudioManager();
Page({
  // 页面的初始数据
  data: {
    
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    // 页面初始化，options为页面跳转所带来的参数
    this.setData(listData.initData[options.listId])
    this.setData({
      listId: options.listId
    })
    // 测试本地存储
    //wx.setStorageSync('key', 'value')
    //console.log(wx.getStorageSync('key'))
    //wx.removeStorageSync('key')
    //wx.clearStorageSync()

    // 收藏存储数据格式
    /**已收藏为true，未收藏为false
     * 注意：读取或者存储，操作的都是整体
     * var collections = {
     *  0:true,
     *  1:false,
     *  2:true
     * }
     */

    // 第一次进入的时候判断是否存在本地存储以及是否收藏
    var collections = wx.getStorageSync('collections');
    // 如果collections存在，则表示以前收藏过或者表示以前取消收藏过
    if (collections){
      var collection = collections[options.listId];
      this.setData({
        collected: collection
      })
    }else{
      // 第一次进入，根本不存在数据
      var collections = {};
      // 把当前唯一id扔到collections对象中，然后默认指定false
      collections[options.listId] = false;
      // 扔到本地存储中
      wx.setStorageSync('collections', collections);
    }
  },
  // 生命周期函数--监听页面初次渲染完成
  onReady: function(){
    backgroundAudioManager.src = listData.initData[this.data.listId].music.dataUrl;
    backgroundAudioManager.title = listData.initData[this.data.listId].music.title;
    backgroundAudioManager.coverImgUrl = listData.initData[this.data.listId].music.coverImgUrl;
    backgroundAudioManager.play();
    this.setData({
      isPlay: true
    });
  },
  toggleCollect:function(event){
    // collections是所有数据的集合
    var collections = wx.getStorageSync('collections');
    // collection是当前一条数据
    var collection = collections[this.data.listId];
    // 点击时，如果收藏 则取消收藏；如果未收藏 则收藏
    collection = !collection;
    // 更新到本地存储中
    collections[this.data.listId] = collection;
    wx.setStorageSync('collections', collections);
    // 更新视图
    this.setData({
      collected: collection
    })
    wx.showToast({
      title: collection ? "收藏成功" : "取消收藏成功",
      icon: 'success',
      duration: 800,
      mask: true
    })
  },
  goComment: function (event){
    

    // wx.showModal({
    //   title: '提示',
    //   content: '这是一个模态弹窗',
    //   confirmColor: "#A52829",
    //   success(res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })

    // wx.showActionSheet({
    //   itemList: ['分享到 微信', '分享到 QQ'],
    //   itemColor: "#A52829",
    //   success(res) {
    //     console.log(res.tapIndex)
    //   },
    //   fail(res) {
    //     console.log(res.errMsg)
    //   }
    // })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: listData.initData[this.data.listId].wineBrand,
      path: '/pages/list/list-detail/list-detail'
    }
  },
  togglePlay:function(event){
    if (backgroundAudioManager.paused){
      backgroundAudioManager.play();
      this.setData({
        isPlay: true
      });
    }else{
      backgroundAudioManager.pause();
      this.setData({
        isPlay: false
      });
    }
  }
})