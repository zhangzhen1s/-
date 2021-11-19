function request(params,isHeader=false){
  return new Promise((resolve,reject)=>{
    //点击后请求前显示加载
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      ...params,
      url:'http://localhost:5000'+params.url,
      success:(res)=>{
        if(isHeader){
          resolve({
            list:res.data,
            total:res.header["X-total-Count"]
          })
        }else{
          resolve(res.data)
        }
      },
      fail:(err)=>{
        reject(err)
      },
      complete:()=>{
        //隐藏加载
        wx.hideLoading({
          success: (res) => {},
        })
      },
    })
  })
}
export default request