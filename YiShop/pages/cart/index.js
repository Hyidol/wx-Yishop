// pages/cart/index.js
import { getSetting, chooseAddress, openSetting, showModal,showToast } from "../../utils/asyncWx.js";
import regeneratorRuntime, { async } from '../../lib/runtime/runtime';

Page({

  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  /**
   * -1- 点击 收获地址 触发
   *     1 绑定点击事件
   *     2 调用小程序内置 api 获取用户的收获地址
   *       获取 用户 对小程序 所授权 获取地址 的权限 状态 scope
   *       2020年9月5日后 scope权限恒为true 已经不需要用户授权了
   */

  // handleChooseAddress(){
  //   // console.log("干一行 行一行 一行行 行行行");
  //   // 获取权限状态
  //   wx.getSetting({
  //     success: (result) => {
  //       console.log("aaa:"+result);
  //       // 只要发现属性名怪异时，都要使用[]形式来获取属性值
  //       const scopeAddress = result.authSetting["scope.address"];
  //       if(scopeAddress==true || scopeAddress===undefined){
  //         // 获取收货地址
  //         wx.chooseAddress({
  //           success: (result1) => {
  //             console.log("bbb:"+result1)
  //           },
  //         });
  //       }
  //       // 用户之前点过取消，诱导用户打开授权页面，现在已经没有用了
  //       else{
  //         wx.openSetting({
  //           success: (result3) => {
  //             console.log("ccc:"+result3)
  //           }
  //         });     
  //       }
  //     }
  //   });
  // }


  //es7优化
  async handleChooseAddress() {
    try {
      // 1 获取 权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      //2 判断 权限状态
      if (scopeAddress === false) {
        await openSetting();
      }
      //3 调用获取收货地址的api
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      console.log(address);
      //4 存入缓存中
      wx.setStorageSync("address", address);

    } catch (error) {
      console.log(error);
      //5 诱导修改地址 不太会 所以直接重新获取地址 真机调试时直接显示手机缓存的地址
      const address = await chooseAddress();
    }
  },

  /**
   * -2/3- 页面加载完毕 显示地址 和 点击加入购物
   *     若有地址则显示地址 若无地址则显示获取收货地址
   *     0 onload onshow
   *     1 获取本地存储中的收货地址数据
   *     2 把购物车数据填充到data中
   */

  /**
   * -4- 实现点击左下角全选
   *     1 onShow获取缓存中的购物车数组
   *     2 idchecked都为true即可
   */

  /**
   * -5- 总价格和总数量
   *     1 获取购物车数组 遍历 判断是否被选中
   *     2 总价格 += 商品的单价 + 商品的数量
   *     3 总数量 += 商品数量
   *     4 计算后的价格和数量 返回data
   */


  onShow() {
    // 1 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 1 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || [];

    this.setData({ address });
    this.setCart(cart);
    /*
    这里直接写优化结果了，关于复选框设置还需要复习
        // 1 计算全选
        //   every数组方法：会遍历 会接收一个回调函数，当每一个回调函数都返回true时，该方法返回true，否则直接结束循环
        //   注意空数组调用every方法会返回true  
        //   减少重复遍历，把这句话写入forEach循环 const allChecked = cart.length?cart.every(v=>v.ischecked):false;
        let allChecked = true;
        // 1 总价格总数量
        let totalPrice = 0;
        let totalNum = 0;
        cart.forEach(v => {
          if(v.ischecked){
            totalPrice += v.num * v.goods_price;
            totalNum += v.num;
          }else{
            allChecked = false;
          }
        });
        // 判断一下数组是否为空
        allChecked = cart.length!=0?allChecked:false;
        // 2 给data赋值
        this.setData({
          address,
          cart,
          allChecked,
          totalPrice,
          totalNum
        })
    */
  },

  /**
   * -6- 商品选中 底部价格和数量跟着变
   */
  handleItemChange(e) {
    // 1 获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    // 2 获取购物车数组
    let { cart } = this.data;
    // 3 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 4 选中状态取反
    cart[index].ischecked = !cart[index].ischecked;

    this.setCart(cart);
  },

  /**
   * 设置购物车状态同时 重新计算底部工具栏的数据 全选 和 总价格 和 购买的数量
   */
  setCart(cart) {

    let allChecked = true;
    // 1 总价格总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.ischecked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });
    // 判断一下数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    // 2 给data赋值
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
    wx.setStorageSync("cart", cart);
  },

  /**
   * -7- 全选和反选
   * 1 全选复选框绑定事件 change
   * 2 获取 data中的全选变量 allChecked
   * 3 直接取反 allChecked=!allChecked
   * 4 遍历购物车数组 让里面商品的选中状态都跟随allChecked改变
   * 5 把购物车数组 和 allChecked 重新设置回data中 
   */

  handleItemAllChecked() {
    let { cart, allChecked } = this.data;
    allChecked = !allChecked;
    cart.forEach(v => v.ischecked = allChecked);
    this.setCart(cart);
  },


  /**
   * -8- 商品数量的编辑
   *    1 绑定同一个点击事件 区分的关键 是自定义属性+-
   *    2 传递被点击的商品id goods_id
   *    3 获取data中的购物车数组 来获取需要被修改的商品对象
   *    4 判断是否修改商品对象数量
   *        当购物车数量=1 同时 用户点击"-" 弹窗提示（用户是否删除） api：wx.showModal
   *        确定删除：直接执行删除 取消删除:什么都不做
   *    4 修改商品对象的数量
   *    5 把cart数组 重新设置回缓存中 和data中 this.setCart
   */
  async handleItemNumEdit(e) {
    // 1 获取传递过来的参数
    const { operation, id } = e.currentTarget.dataset;
    // console.log(operation,id);
    // 2 获取购物车数组
    let { cart } = this.data;
    // 3 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 4 判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 4.1 弹窗提示
      // wx.showModal({
      //   title: '提示',
      //   content: '真删？删了购物车就没啦！',
      //   showCancel: true,
      //   cancelText: '是点错咯',
      //   cancelColor: '#000000',
      //   confirmText: '删吧删吧',
      //   confirmColor: '#3CC51F',
      //   success: (result) => {
      //     if (result.confirm) {
      //       // 删除元素：索引,个数
      //       cart.splice(index,1);
      //       this.setCart(cart);
      //     } else if(result.cancel){
        //       console.log('是用户点错了，不删除')
      //     }
      //   }
      // });
      const res = await showModal({ content: "您是否要删除？" });
      if (res.confirm) {
        // 删除元素：索引,个数
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      // 4 进行修改数量
      cart[index].num += operation;
      // 5 设置回缓存和data中
      this.setCart(cart);
    }
  },

  /**
   * -9- 点击结算
   *    1 判断有没有收货信息
   *    2 判断用户有没有选购物品
   *    3 经过以上的验证 跳转到支付页面
   */
  async handlePay(){
    // 1 判断收货地址
    const {address,totalNum} = this.data;
    if(!address.userName){
      await showToast({title:"您还没有选择收货地址"})
      return;    
    }
    // 2 判断用户有没有选购商品
    if(totalNum===0){
      await showToast({title:"您还没有选购商品"});
      return;
    }
    // 3 跳转到支付页面
    wx.navigateTo({
      url:'/pages/pay/index'
    });

  }

})