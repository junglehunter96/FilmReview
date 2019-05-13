// 云函数入口文件
const cloud = require('wx-server-sdk')
var rp = require('request-promise');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return rp(`https://api.douban.com/v2/movie/subject/${event.id}`)
    .then(function (res) {
      return res
    })
    .catch(function (err) {
      console.error(err)
    });
}