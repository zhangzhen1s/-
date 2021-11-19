function CheckAuth(callback) {
  //如果有手机号信息
  if(wx.getStorageSync('tel')){
      callback()
  }else{
      //如果已经登录 跳转至授权页面
      if(wx.getStorageSync('token')){
        wx.navigateTo({
          url: '/pages/telform/telform',
        })
      }else{
        wx.navigateTo({
          url: '/pages/auth/auth',
        })
      }
  }
}

export default CheckAuth