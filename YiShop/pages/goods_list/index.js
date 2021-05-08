// pages/goods_list/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 3,
        value: "价格",
        isActive: false
      }
    ],
    goodsList:[]
  },

  /**
   * list页面接口要的参数
   */
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },

  /**
   * 总页数
   */
  totalPages:1000,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    this.QueryParams.cid = options.cid||"";
    this.QueryParams.query = options.query||"";
    this.getGoodList();
    this.onReachBottom();
  },


  /**
   * 获取商品列表数据（异步）
   */
  async getGoodList(){
    const res = await request({url:"/goods/search",data:this.QueryParams});
    // console.log(res+"111");
    //获取总条数
    const total = res.total;
    //计算总页数
    this.totalPages = Math.ceil(total/this.QueryParams.pagesize);
    // console.log(this.totalPages);
    //拼接数组
    this.setData({
      goodsList:[...this.data.goodsList,...res.goods]
    })
    //关闭下拉刷新的点点，可以用promise的.then方法？
    wx.stopPullDownRefresh();
  },


  /**
   * 标题点击事件
   */
  handletabsItemChange(e){
    // 1 获取被点击的标题索引
    const {index}=e.detail;
    // 2 修改源数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    // 2 赋值到data中
    this.setData({
      tabs
    })
  },  


  /**
   * 用户上滑页面 滚动条触底 开始加载下一页数据
   *  1 找到滚动条触底事件 官方文档
   *  2 判断还有没有下一页数据
   *    1 获取到总页数 能够获取到总条数 用天花板函数做 
   *      页容量= pagesize
   *      总页数 = Math.ceil（总条数 / 页容量） = 23/6 = 4
   *    2 获取当前页码  papenum
   *    3 判断 当前页码是否大于等于总页数
   *           1 是 提示无下一页数据
   *           2 不是 弹出一个提示 并 加载下一页数据
   *              1 当前页码++
   *              2 重新发送请求
   *              3 数据请求回来 要对data中的数组进行拼接 而不是 全部替换
   */
  
   /**
    * 页面上滑 滚动条触底
    */
   onReachBottom(){
      if(this.QueryParams.pagenum>=this.totalPages){
        // console.log("没有下一页数据");
        // console.log("1:"+this.QueryParams.pagenum);
        // console.log("2:"+this.totalPages);
        wx.showToast({
          title:'恭喜你已刷完！！'
        })
      }
      else{
          this.QueryParams.pagenum++;
          this.getGoodList();
      }
   },

   /**
    *  下拉刷新页面
    *   1 触发下拉刷新事件 需要在页面的json文件中开启一个配置项
    *   2 重置数据数组
    *   3 重置页码 设置为1
    *   4 重新发送请求
    */
   
    onPullDownRefresh(){
      // console.log("下拉刷新")
      this.setData({
        goodsList:[]
      })
      this.QueryParams.pagenum=1;
      this.getGoodList();
    }



})