#### 一，后端服务器用json-server搭建

<!--进入项目文件夹db 输入json-server --watch .\db.json --port 5000-->

<!--连接到本地5000端口-->

#### 二,项目目录及功能

**主页**        pages/home  

- 轮播图                   swiper组件双向绑定遍历图片数据looplist 定义 renderSwiper()请求后端接口'/**recommends**' 成功回调重新渲染数据  ![image-20211118173453253](C:\Users\26号技师\AppData\Roaming\Typora\typora-user-images\image-20211118173453253.png)

- 搜索商品       mp-sticky  粘性组件里放自定义zhangzheng-search组件      

  ![image-20211118174014837](C:\Users\26号技师\AppData\Roaming\Typora\typora-user-images\image-20211118174014837.png)                                

- 商品列表      双向绑定商品数据goodlist  绑定点击事件切换页面bindtap="handleChangePage"

  定义renderGoods()请求后端接口/goods?_page=${this.current}&_limit=5 成功回调重新渲染数据

  使用了懒加载  
  
  ```
   * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {//列表的懒加载效果
          if(this.data.goodlist.length===this.total){
            return
          }
          this.current++
          this.renderGoods()
    },
  ```
  
  ![image-20211118174633407](C:\Users\26号技师\AppData\Roaming\Typora\typora-user-images\image-20211118174633407.png)

**分类**       pages/category

- 侧边滑栏     请求接口写在onLoad 里 url:"/categories?_embed=goods"获取商品信息 成功重新加载数据vtabs   使用mp-vtabs组件 双向绑定vtabs数据   

  ![image-20211118174705608](C:\Users\26号技师\AppData\Roaming\Typora\typora-user-images\image-20211118174705608.png)

**购物车**  pages/shopcar  mp-cells

- 商品栏  使用mp-cells组件   添加渲染条件

  ```wxml
  wx:if="{{cartList.length}}"
  ```

  mp-slideview里渲染加入购物车的商品数据

  ```wxml
  <mp-slideview buttons="{{slideButtons}}" bindbuttontap="slideButtonTap"
    wx:for="{{cartList}}" wx:key="index" data-id="{{item.id}}">
  ```

  给-和+绑定方法和数据

  ```
   <view slot="footer" class="cellfooter">
          <text bindtap="handleMinus" data-item="{{item}}">-</text>
          <text>{{item.number}}</text>
          <text bindtap="handleAdd" data-item="{{item}}">+</text>
        </view>
  ```

  ![image-20211119093800769](C:\Users\26号技师\AppData\Roaming\Typora\typora-user-images\image-20211119093800769.png)

- 加减商品数量  

  ```wxml
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
  ```

  

- 全选     

- 删除     

  ```
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
  ```

  

- 计算金额     写在shopcar.wxs文件里

  ```
  function sum(list){
      var total = 0
      for(var i=0;i<list.length;i++){
        if(list[i].checked){
          total+=list[i].good.price*list[i].number
        }
      }
     return total
  }
  ```

  

**商品详情**  pages/detail

- 商品轮播图       点击图片预览       图片绑定{{info.sliders}}

  ```
    handleTap(evt){
      wx.previewImage({
        current:evt.currentTarget.dataset.current,//当前显示图片的http链接
        urls: this.data.info.slides.map(item=>`http://localhost:5000${item}`) //需要预览的图片http链接列表
      })
    },
  ```

  ​     

  ![image-20211119101709094](C:\Users\26号技师\AppData\Roaming\Typora\typora-user-images\image-20211119101709094.png)

- 粘性置顶      给粘性组件添加属性 <mp-sticky offset-top="0">

  ```
   handleActive(evt){
      this.setData({
        current:evt.currentTarget.dataset.index
      })
    },
  ```

  ![image-20211119102135474](C:\Users\26号技师\AppData\Roaming\Typora\typora-user-images\image-20211119102135474.png)

- 跳转购物车     绑定 handleChange方法

  ```
    handleChange(){
      wx.switchTab({
        url: '/pages/shopcar/shopcar',
      })
    }
  ```

  ![image-20211119102516478](C:\Users\26号技师\AppData\Roaming\Typora\typora-user-images\image-20211119102516478.png)

- 加入购物车     绑定handleAdd方法    加入前会校验是否绑定手机号

  ```
   return request({
                  url:"/carts",
                  method:"post",
                  data:{
                    "username":nickName,
                    "tel":tel,
                    "goodId":goodId,
                    "number":1,
                    "checked":false
                  }
                })
  ```

  

**搜索**   pages/search

![image-20211119103622919](C:\Users\26号技师\AppData\Roaming\Typora\typora-user-images\image-20211119103622919.png)

- 跳转到搜索列表    搜索的是品牌 进去有排序

  ```
    selectResult: function(e){
     console.log('select result',e.detail.item.type)
     if(e.detail.item.type===1){
       //console.log("搜索列表",e.detail.item);
       wx.navigateTo({
         url: `/pages/searchlist/searchlist?id=${e.detail.item.id}&name=${e.detail.item.title}`,
       })
  ```

  

- 跳转到商品详情     

  ```
    //console.log("详情页面");
       wx.navigateTo({
         url:`/pages/detail/detail?id=${e.detail.item.id}&name=${e.detail.item.title}`,
       })
  ```

  

**搜索列表**  pages/searchlist

![image-20211119103902130](C:\Users\26号技师\AppData\Roaming\Typora\typora-user-images\image-20211119103902130.png)

- 价格排序  

  ```
    <view>价格排序
      <mp-icon type="field" icon="refresh" color="black" size="{{25}}" bindtap="handlePrice"></mp-icon>
    </view>
  ```

  

- 好评排序 

  ```
   <view>好评排序
      <mp-icon type="field" icon="refresh" color="black" size="{{25}}" bindtap="handleComment"></mp-icon>
    </view>
  ```

  

- 跳转到商品详情

  ```wxml
  handleTap(evt){
      wx.navigateTo({
        url: `/pages/detail/detail?id=${evt.currentTarget.dataset.id}&name=${evt.currentTarget.dataset.name}`,
      })
    },
  ```

  

**授权**  pages/auth

- 微信授权        显示授权按钮 点击跳转绑定

  ```wxml
   handleAuth(){
      wx.getUserProfile({
        desc: '用于完善会员资料',
        success:(res)=>{
            wx.setStorageSync('token', res.userInfo)
            wx.navigateTo({
              url: '/pages/telform/telform',
            })
        }
      })
  ```

  

**手机号绑定** pages/telform

- 绑定   提交按钮向后跳转两步     并把手机号的token保存到本地    

  ```wxml
   submitForm(){
      wx.setStorageSync('tel', this.data.tel)
      request({
        url:`/users?tel=${this.data.tel}&nickName=${wx.getStorageSync('token').nickName}`
      }).then(res=>{
        if(res.length===0){
          request({
            url:"/users",
            method:"post",
            data:{
              ...wx.getStorageSync('token'),
              tel:this.data.tel
            }
          }).then(res=>{
            wx.navigateBack({
              delta: 2,
            })
          })
  ```

  

**我的**   pages/center

- 更换头像  点击头像访问本地相册、和摄像头   并存在本地

  ```wxml
   handleTap(){
      //打开摄像头/相册
      wx.chooseImage({
        count:1,
        sizeType:['original','compressed'],
        sourseType:['album','camera'],
        success: (res) => {
          const tempFilePaths = res.tempFilePaths
          this.setData({
            userInfo:{
              ...this.data.userInfo,
              avatarUrl:tempFilePaths[0]
            }
          })
          wx.setStorageSync('token', {
            ...wx.setStorageSync('token'),
            avatarUrl:tempFilePaths[0]
          })
        }
      })
  ```

  