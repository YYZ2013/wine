// pages/vlog/vlog.js
var app = getApp()
var utils = require("../util/utils.js");

Page({
  // 页面的初始数据
  data: {
    today: [],
    tomorrow: [],
    top250: [],
    vlogPanelShow: true,
    searchPanelShow: false,
    searchData: []
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var today = "/v2/movie/in_theaters?start=0&count=3";
    var tomorrow = "/v2/movie/coming_soon?start=0&count=3";
    var top250 = "/v2/movie/top250?start=0&count=3";
    // 调用网络请求，相当于ajax
    this.http(today, this.callback, "today", "正在热映");
    this.http(tomorrow, this.callback, "tomorrow", "即将上映");
    this.http(top250, this.callback, "top250", "排行榜");
    wx.showNavigationBarLoading();
  },
  // 封装网络请求
  http: function (url, callback, category, categoryName){
    // 网络请求
    wx.request({
      url: app.globalUrl.doubanUrl + url,
      header: {
        // 默认值是application/json，因为豆瓣api的问题 修改成application/xml
        'content-type': 'application/xml'
      },
      success(res) {
        callback(res.data, category, categoryName)
      }
    })
  },
  callback: function (res, category, categoryName){
    // 数据处理(数据的过滤和存储)
    /**
     * 1.id(详情页索引)
     * 2.标题
     * 3.图片
     * 4.评分
     * 5.星星 
     */
    var vlogs = [];
    for (var index in res.subjects){
      var subject = res.subjects[index];
      var title = subject.title;
      // 名字过长处理一下
      title = utils.cutTitleString(title, 0, 6);
      var temp = {
        id: subject.id,
        title: title,
        img: subject.images.large,
        score: subject.rating.average,
        stars: utils.convertToStarsArray(subject.rating.stars)
      }
      vlogs.push(temp);
    }
    //问题：类型不同
    var readyData = {};
    // 注意：key不一样
    readyData[category] = {
      categoryName: categoryName,
      vlogs: vlogs
    }
    /**
     * readyData = {
     *  today: {},
     *  tomorrow: {},
     *  top250: {},
     *  searchData: {}
     * }
     */
    // 更新数据
    this.setData(readyData)
    wx.hideNavigationBarLoading();
  },
  // 跳转到更多页面
  vlogMoreTap:function(event){
    var categoryName = event.currentTarget.dataset.categoryname;
    wx.navigateTo({
      url: 'vlog-more/vlog-more?categoryname=' + categoryName
    })
  },
  // 跳转到详情页面
  goVlogDetail: function (event) {
    var vlogId = event.currentTarget.dataset.vlogid;
    wx.navigateTo({
      url: 'vlog-detail/vlog-detail?vlogid=' + vlogId
    })
  },
  onBindFocus:function(event){
    this.setData({
      vlogPanelShow: false,
      searchPanelShow: true
    })
  },
  onBindBlur: function (event) {
    // 获取用户输入信息
    var text = event.detail.value;
    // 网络请求url，搜索接口由于官方问题暂时无法正常工作
    // var searchUrl = app.globalUrl.doubanUrl + "/v2/movie/search?q=" + text; 
    // this.http(searchUrl, this.callback, "searchData", "");
    // wx.showNavigationBarLoading();
  },
  onCancelImgTap: function (event) {
    this.setData({
      vlogPanelShow: true,
      searchPanelShow: false
    })
  }
})