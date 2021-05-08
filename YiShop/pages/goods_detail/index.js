// pages/goods_detail/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime, { async } from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{}
  },
  
  
  /**
   * 商品初始对象
   */
  GoodsInfo:{},


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {goods_id} = options;
    // console.log(goods_id);
    this.getGoodsDetail(goods_id);
  },

  /**
   *-1- 发送请求 获取数据
   */

  async getGoodsDetail (goods_id){
    const goodsObj = await request({url:"/goods/detail",data:{goods_id}});
    // console.log(res);
    this.GoodsInfo=goodsObj;
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        // iphone部分手机 不识别webp图片格式
        // 临时自己改 确保后台存在 1.webp => 1.jpg
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics
      }
    })
  },

  /**
   *-2- 点击轮播图 预览大图
   *    1 给轮播图绑定点击事件
   *    2 调用小程序的api previewImage
   */

  handlePreviewImage(e){
    // console.log("预览");
    //1 先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v=>v.pics_mid);
    //2 接收传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current,
      urls: urls
    });
      
  },

  /**
   *-3- 点击 加入购物车
        1 绑定点击事件
        2 获取缓存中的购物车数据 是个数组格式
        3 先判断 当前商品是否已经存在于购物车
          1 已存在 修改商品数据 执行购物车数量++
          2 不存在 直接给购物车数组添加一个新元素 带上购买数量和商品属性
        4 重新把购物车数组 填充回缓存中
        5 弹出提示
   */
   handleCartAdd(){
      let cart = wx.getStorageSync("cart")||[];
      let index = cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
      if(index===-1){
        //不存在 第一次添加
        this.GoodsInfo.num=1;
        this.GoodsInfo.ischecked=true;
        cart.push(this.GoodsInfo);
      }
      else{
        //已经存在 购物车数据 执行num++
        cart[index].num++;
      }
      // 把购物车数据重新添加回缓存中
      wx.setStorageSync("cart",cart);
      console.log(cart);
      // 弹窗提示
      wx.showToast({
        title: '添加成功~',
        icon: 'success',
        //防止用户手抖疯狂点击加入购物车
        mask: true
      });
        
  }

})