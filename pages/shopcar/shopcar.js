import CheckAuth from "../../utils/auth"
import request from '../../utils/request'
// pages/shopcar/shopcar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
   slideButtons:[{
     type:'warn',
     text:'删除'
   }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      CheckAuth(()=>{
        console.log("准备加入购物车");
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    CheckAuth(()=>{
      console.log("显示购物车");
      let {nickName}=wx.getStorageSync('token')
      let tel=wx.getStorageSync('tel')
      request({
        url:`/carts?_expand=good&username=${nickName}&tel=${tel}`
      }).then(res=>{
         this.setData({
           cartList:res
         })
      })
    })
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

  },
  slideButtonTap(evt){
    var id = evt.currentTarget.dataset.id
       this.setData({
         cartList:this.data.cartList.filter(item=>item.id!==id)
       })
       request({
         url:`/carts/${id}`,
         method:"delete"
       })
  },
  handleTap(evt){
    var item = evt.currentTarget.dataset.item
    item.checked=!item.checked
    this.handleUpdate(item)
  },

  //-处理函数
  handleMinus(evt){
    var item = evt.currentTarget.dataset.item
    if(item.number===1){
      return
    }
    item.number--
    this.handleUpdate(item)
  },
  //+处理函数
  handleAdd(evt){
    var item = evt.currentTarget.dataset.item
    item.number++
    this.handleUpdate(item)
  },
  handleUpdate(item){
    this.setData({
      cartList:this.data.cartList.map(data=>{
        if(data.id==item.id){
            return item
        }
        return data
      })
    })
    request({
      url:`/carts/${item.id}`,
      method:"put",
      data: {
          "username":item.username,
          "tel":item.tel,
          "goodId":item.goodId,
          "number":item.number,
          "checked":item.checked,
      }
    })
  },
  handleAllChecked(evt){
    if(evt.detail.value.length===0){
      //未全选
      this.setData({
        cartList:this.data.cartList.map(item=>({
          ...item,
          checked:false
        }))
      })
    }else{
      //全选
      this.setData({
        cartList:this.data.cartList.map(item=>({
          ...item,
          checked:true
        }))
      })
    }
  }
})