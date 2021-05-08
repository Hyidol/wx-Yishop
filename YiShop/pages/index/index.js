// pages/index/index.js
import { request } from "../../request/index.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList:[],  //轮播图数组
    cateList:[],  //导航栏数组
    floorList:[],  //楼层数组
  },

  /**
   * 生命周期函数--监听页面加载
   * 页面一加载就会触发
   */
  onLoad: function (options) {

    // 发送异步请求获取轮播图数据
    // var reqTask = wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   data: {},
    //   header: {'content-type':'application/json'},
    //   method: 'GET',
    //   dataType: 'json',
    //   responseType: 'text',
    //   success: (result) => {
    //     this.setData({
    //       swiperList:result.data.message 
    //     })
    //   },
    //   fail: () => {},
    //   complete: () => {}
    // });

    
     //将原生请求使用promise优化
     this.getSwiperList();
     this.getCateList();
     this.getFloorList();

  },

  /**
    * getSwiperList：获取轮播图数据
    */
  getSwiperList(){
    request({url: "/home/swiperdata"})
    .then(result=>{
      // for (let k = 0; k < result.length; k++) {
      //   result[k].forEach((v, i) => {
      //   result[k].navigator_url = v.navigator_url.replace(/main/, 'index');
      //   });
      // }
      result.map((item) => (item.navigator_url = item.navigator_url.replace(/main/, 'index')))
      this.setData({
        swiperList:result
      })
    })
  },

  /**
  * getCateList：获取分类导航数据
  */
  getCateList(){
  request({url: "/home/catitems"})
  .then(result=>{
    this.setData({
      cateList:result
    })
  })
  },

  /**
  * getFloorList：获取楼层数据
  */
 getFloorList(){
  request({url: "/home/floordata"})
  .then(result=>{
    for (let k = 0; k < result.length; k++) {
      result[k].product_list.forEach((v, i) => {
      result[k].product_list[i].navigator_url = v.navigator_url.replace('?', '/index?');
      });
    }
    this.setData({
      floorList:result
    })
  })
  },

  /**
   * 修改获取到的url字符串(楼层)
   */
  getFloorChangeUrl(url){
    console.log("呵呵呵呵呵")
    var pattern = "/pages/goods_list?query=" + '([^&]*)';
    if(url.match(pattern)){
      console.log("哈哈哈哈哈")
    }
  }

  /**
   * function changeURLArg(url,arg,arg_val){
    var pattern=arg+'=([^&]*)';
    var replaceText=arg+'='+arg_val; 
    if(url.match(pattern)){
        var tmp='/('+ arg+'=)([^&]*)/gi';
        tmp=url.replace(eval(tmp),replaceText);
        return tmp;
    }else{ 
        if(url.match('[\?]')){ 
            return url+'&'+replaceText; 
        }else{ 
            return url+'?'+replaceText; 
        } 
    }
}
   */
})