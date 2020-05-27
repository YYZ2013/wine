// pages/vlog/vlog-detail/vlog-detail.js
var app = getApp();
var utils = require("../../util/utils.js");
Page({
  // 页面的初始数据
  data: {
    vlog: {}
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    // 页面初始化 options是页面跳转带来的参数
    var vlogId = options.vlogid;
    // 获取url
    var vlogDetailUrl = app.globalUrl.doubanUrl + "/v2/movie/subject/" + vlogId;
    utils.http(vlogDetailUrl, this.callback);
    wx.showNavigationBarLoading();
  },
  callback:function(data){
    /**
     * 1.电影图片：vlogImg
     * 2.制片国家/地区：country
     * 3.电影名称：title
     * 4.繁体名称：originalTitle
     * 5.想看人数：wishCount
     * 6.短评数量：commentCount
     * 7.年代：year
     * 8.电影类型：genres
     * 9.评星：stars
     * 10.评分：score
     * 11.导演：director
     * 12.主演：casts
     * 13.主演信息：castsInfo
     * 14.简介：summary
     */
    // 在整理数据之前，需要对字段进行判断，因为有些字段可能没有
    if (!data){
      return;
    }
    // 处理一下导演
    var director = {
      avatars: "",
      name: "",
      id: ""
    }
    if (data.directors[0] != null){
      if (data.directors[0].avatars != null) {
        director.avatars = data.directors[0].avatars.large;
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }

    var temp = {
      vlogImg: data.images.large,
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      genres: utils.convertToGenresString(data.genres),
      stars: utils.convertToStarsArray(data.rating.stars),
      score: data.rating.average,
      director: director.name,
      casts: utils.convertToCastsString(data.casts),
      castsInfo: utils.convertToCastInfo(data.casts),
      summary: data.summary
    }
    console.log(temp);
    this.setData({
      vlog: temp
    })
    wx.hideNavigationBarLoading();
    //动态设置导航条
    wx.setNavigationBarTitle({
      title: utils.cutTitleString(this.data.vlog.title, 0, 6)
    })
  }
})