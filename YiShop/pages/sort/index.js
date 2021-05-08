// pages/sort/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList:[],
    // 右侧的商品数据
    rightContent:[],
    // 左侧的选中栏目
    currentIndex:0,
    // 右侧内容的滚动条到顶部的距离
    scrollTop:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* web中的本地存储 和 小程序中的本地存储的区别
      
      1 写代码的方式不一样
        web：localStorage.setItem("key","value") localStorage.getItem("key")
        小程序：wx.setStorageSync("key","value"); wx.getStorageSync("key");
      2 存的时候有没有做类型转换
        web：不管存入的是什么类型的数据，最终都hi先调研以下toString(),把数据变成了字符串 再存进去
        小程序：不存在 类型转换 这个操作，存什么类型的数据就获取什么类型的数据
    */

    /* 优化缓出 this.getCases();

      1 先判断本地存储中有没有旧数据
      2 没有旧数据 直接发送新请求
      3 有旧数据 同时 旧数据没有过期 就使用本地储存中的旧数据
    */
   
    // 1 获取本地存储中的数据 （小程序自带本地存储技术）
    const Cates=wx.getStorageSync("cates");
    // 2 判断有无旧数据
    if(!Cates){
      // 无旧数据
      this.getCases();
    }else{
      // 有旧数据 判断有无过期（自定义过期时间 10s 5min）
      if(Date.now()-Cates.time>1000*10){
        // 已过期 重新发送请求
        this.getCases();
      }else{
        // 未过期 使用旧数据
        this.Cases=Cates.data;
        let leftMenuList = this.Cases.map(v=>v.cat_name);
        let rightContent = this.Cases[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })        
      }
    }
      
  },

  /**
   * 接口的返回数据
   */
  Cases:[],

  /**
   * 获取分类数据
   */
  async getCases(){
    // request({
    //   url:"/categories"
    // })
    // .then(res => {
    //   this.Cases=res.data.message;

    //   // 把接口的数据存入到本地数据中
    //   wx.getStorageSync("cates",{time:Date.now(),data:this.Cases});

    //   // 构造左侧的大菜单数据
    //   let leftMenuList = this.Cases.map(v=>v.cat_name);
    //   // 构造右侧的商品数据
    //   let rightContent = this.Cases[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })

    // 1 使用es7的async await来发送请求(与上方等同)
    const res = await request({ url:"/categories" });
    // this.Cases = res.data.message;
    this.Cases = res;
    // 把接口的数据存入到本地数据中
    wx.getStorageSync("cates",{time:Date.now(),data:this.Cases});
    // 构造左侧的大菜单数据
    let leftMenuList = this.Cases.map(v=>v.cat_name);
    // 构造右侧的商品数据
    let rightContent = this.Cases[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },

  /**
   * 左侧菜单的点击事件
   */
  handleItemTap(e){
    // 1 获取被点击标题身上的索引
    // 2 给data中的currentIndex赋值
    // 3 根据不同的索引来渲染右侧的商品内容
    // 4 重新设置右侧内容的scroll-view标签与顶部的距离
    const {index}=e.currentTarget.dataset;
    let rightContent = this.Cases[index].children;
    this.setData({
      currentIndex:index,
      rightContent,
      scrollTop:0
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