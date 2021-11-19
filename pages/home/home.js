// pages/home/home.js
import request from '../../utils/request'//引入封装的request请求函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
       looplist:[],//轮播图数据
       goodlist:[]//商品列表数据
  },
  current:1,
  total:0,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      this.renderSwiper()
      this.renderGoods()
  },
  renderSwiper(){
    request({
      url: '/recommends',//调轮播图图片数据接口
    }).then(res=>{
         this.setData({
           looplist:res
         })
    })
  },
  renderGoods(){
    request({
      url:`/goods?_page=${this.current}&_limit=5`//商品数据接口
    },true).then(res=>{
      this.total = Number(res.total)
         this.setData({
           goodlist:[...this.data.goodlist,...res.list]
         })
    })
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
  onReachBottom: function () {//列表的懒加载效果
        if(this.data.goodlist.length===this.total){
          return
        }
        this.current++
        this.renderGoods()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  handleEvent(){
    console.log("搜索处理")
    wx.navigateTo({
      url:'/pages/search/search',
    })
  },
  handleChangePage(evt){
    var id = evt.currentTarget.dataset.id
    var name = evt.currentTarget.dataset.name
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}&name=${name}`,
    })
  }
})