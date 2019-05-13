// pages/commit/commit.js
var db = wx.cloud.database();
Page({
  // 初始化云数据库
  /**
   * 页面的初始数据
   */
  data: {
    moviedetail:{},
    content:'',
    score: 4 ,//默认评价
    showpc:[],
    fileid:[],
    movieid:-1
  },
  onContentChange(event){
    this.setData({
      content:event.detail
    })
  },
  onScoreChange(event){
    this.setData({
      score:event.detail
    })
  },
  imgadd(){
    // 从本地相册获取图片
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res=> {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        this.setData({
          showpc:this.data.showpc.concat(tempFilePaths)
        })
      }
    })
  },
  onSubmit(){
    wx.showToast({
      title: '正在上传'
    })
    let promiseArr = [];
      for(var i=0,length=this.data.showpc.length;i<length;i++) {
        promiseArr.push(new Promise((resolve,reject) => {
          let item = this.data.showpc[i];
          let suffix = /\.\w+$/g.exec(item);
          // 把图片上传到云存储
          wx.cloud.uploadFile({
            cloudPath: new Date().getTime() + suffix,//上传到云储存的路径
            filePath: item,// 文件路径 因为tempFilePaths为数组
            success: res => {
              this.setData({
                fileid:this.data.fileid.concat(res.fileID)
              })
              resolve()
            },
            fail: console.error
          })
        }))
      }
      Promise.all(promiseArr).then(res =>{
        db.collection('commit').add({
          data:{
            content: this.data.content,
            score: this.data.score,
            fileid: this.data.fileid,
            movieid:this.data.movieid
          }
        })
      }).then(res =>{
          wx.showToast({
            title:'评价成功'
          })
      }).catch(res =>{
        wx.showToast({
          title:'评价失败'
        })
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      movieid:options.movieid
    })
    wx.cloud.callFunction({
      name:"getdetail",
      data:{
        id:options.movieid
        }
    }).then(res =>{
      this.setData({
        moviedetail:JSON.parse(res.result)
      })
    }).catch(err =>{
      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})