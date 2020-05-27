// pages/vlog/vlog-more/vlog-more.js
var app = getApp();
var utils = require("../../util/utils.js");

Page({
  // 页面的初始数据
  data: {
    vlogs: [],
    totalCount: 0,
    totalVlogs: [],
    isEmpty: true
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var categoryName = options.categoryname;
    this.setData({
      categoryName: categoryName
    })
    var publicUrl = app.globalUrl.doubanUrl;
    var allUrl = "";
    switch (categoryName){
      case "正在热映":
        allUrl = publicUrl + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        allUrl = publicUrl + "/v2/movie/coming_soon";
        break;
      case "排行榜":
        allUrl = publicUrl + "/v2/movie/top250";
        break;
    }
    this.setData({
      allUrl: allUrl
    })
    // 进行网络请求数据
    utils.http(allUrl, this.callback);
    wx.showNavigationBarLoading();
  },
  //下拉刷新
  onPullDownRefresh() {
    var refreshUrl = this.data.allUrl;
    this.data.totalVlogs = [];
    this.data.isEmpty = true;
    utils.http(refreshUrl, this.callback);
  },
  //上拉加载
  onReachBottom: function (event) {
    //上拉加载的url需要变化，start:0 20 40 60，count=20
    var nextUrl = this.data.allUrl + "?start=" + this.data.totalCount +"&count=20";
    utils.http(nextUrl, this.callback);
    wx.showNavigationBarLoading();
  },
  callback:function(res){
    console.log(res)
    // 数据处理(数据的过滤和存储)
    /**
     * 1.id(详情页索引)
     * 2.标题
     * 3.图片
     * 4.评分
     * 5.星星 
     */
    var vlogs = [];
    for (var index in res.subjects) {
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
    var totalVlogs = [];
    /**
     * concat 合并数组
     * 第一次进入不需要累加，非第一次进入的时候进行累加
     */
    if(!this.data.isEmpty){
      // 非第一次进入 以前更新到data的vlogs + 刚刚获取的vlogs
      totalVlogs = this.data.vlogs.concat(vlogs);
    }else{
      // 第一次进入
      totalVlogs = vlogs;
      this.data.isEmpty = false;
    }
    this.setData({
      vlogs: totalVlogs
    })
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
  },
  // 生命周期函数--页面渲染完成
  onReady:function(){
    //动态设置导航条
    wx.setNavigationBarTitle({
      title: this.data.categoryName
    })
  },
  // 跳转到详情页面
  goVlogDetail:function(event){
    var vlogId = event.currentTarget.dataset.vlogid;
    wx.navigateTo({
      url: '../vlog-detail/vlog-detail?vlogid=' + vlogId
    })
  }
  
})