/**
 * 评星：0   10    20    30    40    50
 *      0 5 10 15 20 25 30 35 40 45 50
 * 40 "40" "4" 循环5次 i<4 [1,1,1,1,0]
 * 45 "45" "4""5" 循环5次 i<4 [1,1,1,1,0.5]
 */
// 星星的数据拆分
function convertToStarsArray(stars){
  // num代表拆分的数字十位
  var num = stars.toString().substring(0,1);
  // num0代表拆分的数字个位
  var num0 = stars.toString().substring(1,2);
  // 声明一个数组
  var starsArr = [];
  for (var i=0;i<5;i++){
    if(i<num){
      starsArr.push(1);
    }else if(i==num){
      if (num0==5){
        starsArr.push(0.5);
      }else{
        starsArr.push(0);
      }
    }else{
      starsArr.push(0);
    }
  }
  return starsArr;
}

// 截取字符串长度替换
function cutTitleString(title, start, end){
  if(title.length > end){
    title = title.substring(start, end) + "...";
  }
  return title;
}

// 公共的网络请求
// 封装网络请求
function http(url, callback) {
  // 网络请求
  wx.request({
    url: url,
    method: "GET",
    header: {
      // 默认值是application/json，因为豆瓣api的问题 修改成application/xml
      'content-type': 'application/xml'
    },
    success(res) {
      callback(res.data)
    }
  })
}

// 演员名字，使用“/”分割
function convertToCastsString(casts){
  var castsJoin = "";
  for(var index in casts){
    castsJoin = castsJoin + casts[index].name + " / ";
  }
  var castsFinal = "";
  castsFinal = castsJoin.substring(0, castsJoin.length - 3);
  return castsFinal;
}

// 处理演员信息：头像+名字
function convertToCastInfo(casts){
  // 存储信息：头像+名字
  var castsArray = [];
  for(var index in casts){
    var cast = {
      img: casts[index].avatars ? casts[index].avatars.large : "",
      name: casts[index].name
    }
    castsArray.push(cast);
  }
  return castsArray;
}

//处理类型,使用“/”分割
function convertToGenresString(genres){
  var genresJoin = "";
  for (var index in genres){
    genresJoin = genresJoin + genres[index] + " / ";
  }
  var genresFinal = genresJoin.substring(0, genresJoin.length-3);
  return genresFinal;
}

module.exports = {
  convertToStarsArray: convertToStarsArray,
  cutTitleString: cutTitleString,
  http: http,
  convertToCastsString: convertToCastsString,
  convertToCastInfo: convertToCastInfo,
  convertToGenresString: convertToGenresString
}
