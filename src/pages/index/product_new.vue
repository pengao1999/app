<template>
  <view>
    <view>
      <product-swiper v-if="showSwiper" :images="images" :image_root="image_root" :customFormat="swiperCustom"></product-swiper>

      <product-base-info
        v-if="showBaseInfo"
        :customFormat="baseInfoCustom"
        :integerPrice="Number(integerPrice)"
        :decimalPrice="Number(decimalPrice)"
        :goods="goods"
        :expectTime="expectTime"
        :countDownDay="countDownDay"
        :countDownHour="countDownHour"
        :countDownMinute="countDownMinute"
        :countDownSecond="countDownSecond"
      ></product-base-info>

<!--      <product-coupon v-if="showCoupon" :couponLength="couponLength" :customFormat="couponCustom" @clickCounpons="getCoupons"></product-coupon>-->

      <product-buyer
        v-if="showBuyers"
        :customFormat="buyerCustom"
        :showMore="showMore"
        :showMoreButton="showMoreButton"
        :hasBoughtAmount="hasBugAmount"
        :goods="goods"
        @showMoreData="showMoreData"
      ></product-buyer>

      <product-detail v-if="showDetail" :goods="goods" :customFormat="detailCustom"></product-detail>

      <product-service v-if="showService" :customFormat="serviceCustom"></product-service>
      <!-- <view class='to-top' v-if="showToTop" @tap='goTop'>
			  <image src='../../static/ic_to_top.png'></image>
      </view>-->
      <copy-right></copy-right>
      <view style="height:100rpx; width:100%;"></view>
    </view>
    <block v-if="showComponents">
      <my-top-button :propData="topButton" @toTop="doScrollTop"></my-top-button>
      <product-selector
        :propData="selectorData"
        @close="closeSelector"
        @reduce="reduceNum"
        @add="addNum"
        @submit="submit"
        @selectAttrItem="selectAttrItem"
      ></product-selector>
      <top-navigator
        @goTop="goTop"
        @goBuyers="goBuyers"
        @goDetail="goDetail"
        :propData="topNaviData"
        :countDownDay="countDownDay"
        :countDownHour="countDownHour"
        :countDownMinute="countDownMinute"
        :countDownSecond="countDownSecond"
      ></top-navigator>
      <coupon-seclector
        :propData="couponSelector"
        :coupons="coupons"
        btnText="立即领取"
        @close="closeCouponSelector"
        @getCouponById="getCouponById"
      ></coupon-seclector>
      <!-- #ifdef MP-WEIXIN -->
      <my-picker :propData="pickData" @close="showWXShareDialog(false)" @toShare="toShare"></my-picker>
      <!-- #endif -->
    </block>
    <bottom-navigator
      :propData="bottomNaviData"
      @toHome="toHome"
      @toCart="toCart"
      @addCart="addCart"
      @buy="buy"
    ></bottom-navigator>
  </view>
</template>

<script>
import Config from '../../common/js/Config.js'
import ShareDialog from './myShareDialog.js'
import Util from '../../common/js/util.js'
import myToast from '../../common/js/toast.js'
import TimerCounter from '../../common/js/timeCounter.js'
import Auth from '../auth.js'
import Cart from '../cartsResfresh.js'
import QQMapWX from '../../common/third/qqmap/qqmap-wx-jssdk.js'

import ProductSwiper from './components/ProductSwiper.vue'
import ProductBaseInfo from './components/ProductBaseInfo.vue'
import ProductCoupon from './components/ProductCoupon.vue'
import ProductBuyer from './components/ProductBuyer.vue'
import ProductDetail from './components/ProductDetail.vue'
import ProductService from './components/ProductService.vue'
import * as productPageCustomization from "@/pages/customization/product-page-customization.json";

import TopNavigator from '../../components/yx_pendant_view/productTopNavigator.vue'
import BottomNavigator from '../../components/yx_pendant_view/productBottomNavigator.vue'
import CopyRight from '../../components/yx_view/myCopyRight.vue'
import MyTopButton from '../../components/yx_view/myToTopBottom.vue'
import ProductSelector from '../../components/yx_dialog/myProductSelector.vue'
import CouponSeclector from '../../components/yx_dialog/myCouponSelector.vue'
// #ifdef MP-WEIXIN
import MyPicker from '../../components/yx_dialog/myPicker.vue'
// #endif
// #ifdef  MP-WEIXIN || H5
import MyWxLogin from '../../components/yx_dialog/myWXLoginDialog.vue'
// #endif
var qqMap = new QQMapWX({
  key: Config.QQMAPKEY // 必填
});
import {
  mapMutations
} from 'vuex'
const BASE_INOF_HEIGHT = 340
const BUYER_HEIGHT = 520
export default {
  components: {
    ProductSwiper,
    ProductBaseInfo,
    ProductCoupon,
    ProductBuyer,
    ProductDetail,
    ProductService,
    TopNavigator,
    BottomNavigator,
    CopyRight,
    MyTopButton,
    ProductSelector,
    CouponSeclector
    // #ifdef MP-WEIXIN
    ,
    MyPicker
    // #endif
    // #ifdef  MP-WEIXIN || H5
    ,
    MyWxLogin
    // #endif
  },
  data() {
    return {
      goods_key: 0,
      winHeight: 0,
      systemInfo: {},
      topNaviData: {
        show: false,
        isProduct: true,
        isRecorder: false,
        isDetail: false
      },
      bottomNaviData: {
        cartNum: 0
      },
      showSwiper: false,
      showBaseInfo: false,
      showCoupon: false,
      showBuyers: false,
      showDetail: false,
      showService: false,
      swiperCustom: {},
      baseInfoCustom: {},
      couponCustom: {},
      buyerCustom: {},
      detailCustom: {},
      serviceCustom: {},
      showComponents: false,
      images: [],
      scene: undefined,
      image_root: '',
      intervalVal: 1,
      goods: {
        name: '',
        stock: 0,
        sales_num: 0
      },
      integerPrice: 0,
      decimalPrice: 0,
      expectTime: '',
      showMore: false,
      showMoreButton: false,
      hasBugAmount: 0,
      topButton: {
        show: false,
        style: 'bottom: 70px'
      },
      goodses: [],
      selectorData: {
        show: false
      },
      couponSelector: {
        show: false
      },
      couponLength: 0,
      attr_keys: '',
      ctx: Object,
      loginDialogData: {
        show: false
      },
      coupons: [],
      pickData: {
        show: false
      },
      isGoToArea: false,
      isGettingCart: false,
      isGettingCoupon: false,
      isError: false,
      tryGetGroup: false,
      isShowDialog: false
    }
  },
  mixins: [TimerCounter, ShareDialog, myToast, Auth, Cart],
  watch: {
    systemInfo: {
      handler() {
        if (!Util.isEmptyObject(this.systemInfo)) {
          this.winHeight = this.systemInfo.windowHeight
        }
      },
      deep: true
    },
    group: {
      handler() {
        if (this.group !== undefined && this.userInfo !== undefined) {
          this.getCouponsList()
        }
      },
      immediate: true
    },
    userInfo: {
      handler() {
        if (Util.containsKey(this.userInfo, 'user_key')) {
          this.getCartNum(this.userInfo.user_key)
          // this.getCouponsList()
        }
      },
      immediate: true
    },
    globalI: {
      handler() { },
      immediate: true
    },
    shareLeader: {
      handler() {
        console.log("shareLeader:" + JSON.stringify(this.shareLeader))
        this.handelShare()
      },
    },
    '$route'(to, from) {
      console.log(to)
    },
  },
  onLoad(options) {
    let self = this
    self.goods_key = options.goods_key
    console.log("aaaaaaaaaa")
    console.log(options)
    console.log("bbbbbbbb")
    //获取分享时传递的参数
    if (options.scene !== undefined) {
      let scene = decodeURIComponent(options.scene);

      this.goods_key = scene.split("-")[1];
      let scene_i = scene.split('-')[4];
      if (parseInt(scene_i) > 0) {
        this.changeI(parseInt(scene_i))
      }
    }
    options.user_key ? this.leader_key = options.user_key : null
    this.initPage()
    this.getProductDetail(this.goods_key)
    if (this.leader_key && this.leader_key !== null) {
      this.checkLeader(this.leader_key)
    }
    setTimeout(() => {
      self.showSwiper = self.checkExistenOfModule('swiper')
    }, 50)
    setTimeout(() => {
      self.showBaseInfo = self.checkExistenOfModule('baseInfo')
    }, 100)
    setTimeout(() => {
      self.showCoupon = self.checkExistenOfModule('coupon')
    }, 150)
    setTimeout(() => {
      self.showBuyers = self.checkExistenOfModule('buyer')
    }, 200)
    setTimeout(() => {
      self.showDetail = self.checkExistenOfModule('detail')
    }, 250)
    setTimeout(() => {
      self.showService = self.checkExistenOfModule('service')
    }, 300)
    setTimeout(() => {
      self.showComponents = true
    }, 350)

    self.swiperCustom = self.getCustomFormat('swiper')
    self.baseInfoCustom = self.getCustomFormat('baseInfo')
    self.couponCustom = self.getCustomFormat('coupon')
    self.buyerCustom = self.getCustomFormat('buyer')
    self.detailCustom = self.getCustomFormat('detail')
    self.serviceCustom = self.getCustomFormat('service')
  },
  onShow() {
    // this.goodses = []
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
    group() {
      return this.$store.state.group
    },
    isTryGetUserInfo() {
      return this.$store.state.isTryGetUserInfo
    },
    inChooseProductCartNum() {
      return this.$store.state.inChooseProductCartNum
    },
    couldModifyGroup() {
      return this.$store.state.couldModifyGroup
    }
  },
  methods: {
    ...mapMutations(['setRefreshCart', 'setUserCustomLocation', 'setGroup', 'setGlobalI', 'setUserInfo', 'setLoginWx',
      'addIndexRefresh', 'addCategoryRefresh'
    ]),
    checkExistenOfModule(moduleName) {
      return productPageCustomization[moduleName]
    },
    getCustomFormat(moduleName) {
      let format = {}
      if (productPageCustomization[moduleName] && productPageCustomization[moduleName]['format']) {
        format = productPageCustomization[moduleName]['format']
      }
      return format
    },
    initPage: function () {
      let self = this
      self.getConfig()
      uni.getSystemInfo({
        success(system) {
          if (system.errMsg === "getSystemInfo:ok") {
            self.systemInfo = system
          }
        }
      })
    },
    getConfig: function() {
      let self = this
      self.$Phttp.post(Config.JAVA_SAAS_URLS.orderSetting, {}).then(res => {
        res = res.data
        if (res.code ===0) {
          self.expectTime = Util.timestampToTime(res.data.delivery_stocking_period)
        }
      })
    },
    checkLeader: function (user_key) {
      let self = this
      let data = {
        user_key: user_key
      }
      self.$Phttp.post(Config.JAVA_SAAS_URLS.checkLeader, data).then((res) => {
        res = res.data
        if (res.code === 0) {
          self.shareLeader = res.data
          // self.handelShare()
        }
      })
    },
    changeI: function (i) {
      this.setGlobalI(i)
    },
    handelShare() {
      let self = this
      if (this.isShowDialog) {
        return
      }
      if (Util.containsKey(this.userInfo, 'user_key') && Util.containsKey(this.shareLeader, 'community')) {
        if (String(this.shareLeader.user_key) === String(this.userInfo.bind_leader_key)) {
          return
        }
        if (this.userInfo.community !== null) {
          this.isShowDialog = true
          uni.showModal({
            content: "您当前绑定的小区为[" + this.userInfo.community + ']是否要切换到[' + this.shareLeader.community + ']',
            success: function (res) {
              if (res.confirm) {
                self.bindLeader(self.shareLeader.user_key, self.shareLeader.community)
              }
            }
          })
        } else {
          self.bindLeader(self.shareLeader.user_key, this.shareLeader.community)
        }

      }
    },
    bindLeader: function (leader_key, community) {
      let self = this
      if (!self.userInfo) return
      let postData = {
        user_key: self.userInfo.user_key,
        leader_key: leader_key,
      }
      self.$Phttp.post(Config.JAVA_SAAS_URLS.setDefaultLeader, postData).then((res) => {
        res = res.data
        if (res.code === 0) {
          self.userInfo.bind_leader_key = leader_key
          self.userInfo.community = community
          console.log(JSON.stringify(self.userInfo))
          self.setUserInfo(self.userInfo)
        }
      })
    },
    getProductDetail: function(goods_key) {
      let self = this
      self.toast({
        type: 'loading',
        desc: '努力加载中...'
      })
      let data = {
        i: self.globalI,
        goods_key: goods_key
      }
      self.$Phttp.post(Config.JAVA_SAAS_URLS.goodDetail, data).then((res) => {
        self.toast(true)
        res = res.data
        if (res.code === 0) {
          console.log(res)
          if (res.data.state === 0) {
            uni.showModal({
              title: '提示',
              content: '您访问的商品已下架/不存在',
              showCancel: false,
              comfirmText: '确定',
              success: (res) => {
                uni.switchTab({
                  url: '/pages/index/main'
                })
              }
            })
          }
          res.data.pics !== null ? self.images = res.data.pics : self.images.push(res.data.pic)
          self.image_root = res.other.img_root
          self.goods = res.data
          self.hasBugAmount = res.data.buy_count
          // self.setShareMessage(self.image_root + self.images[0], self.goods.name, self.goods.name, self.image_root +
          //         self.pic, goods_key, self.userInfo ? self.userInfo.user_key : '0', this.activity_key, this.activity_endtime, self.globalI
          // )

          if (res.data.users.length >= 11) {
            self.showMoreButton = true
            self.showMore = false
          }

          var price = res.data.price.toFixed(2)
          var priceArr = price.split('.')
          console.log(priceArr)
          self.integerPrice = priceArr[0]
          if (priceArr[1]) {
            self.decimalPrice = priceArr[1]
          }

          self.selectorData = Object.assign({}, self.selectorData, self.goods, {
            image_root: self.image_root,
            num: 1,
          })
          self.selectorData = Object.assign({}, this.selectorData, {
            goods_key: self.goods_key,
            user_key: self.userInfo ? self.userInfo.user_key : 0,
          })
          // delete self.selectorData.goods_key
          this.goodses = [self.selectorData]
          self.retSetAttrGroupStatus()
          var totalSecond = res.data.end_time2 - Date.parse(new Date()) / 1000;
          if (totalSecond <= 0) {
            self.canBuy = false
          }
          //判断商品是否开始售卖
          // 							var totalBeginSecond = Date.parse(new Date()) - res.data.goods_begin_time  / 1000;
          // 							if (totalBeginSecond>=0){
          // 								self.is_begin = false
          // 							}
          // self.cutDown(res.data.end_time2)

          // DEBUG
          // self.createShareImg()
        }
      }).catch(err => {
        console.log(err)
        if (self.isError) return
        self.isError = true
        var t = getCurrentPages()
        var current = t[t.length - 1]
        if (current.route !== "pages/index/product") return

        uni.showModal({
          title: '温馨提示',
          content: '抱歉，获取商品详情失败，请检查网络！',
          showCancel: false,
          comfirmText: '返回',
          success: (res) => {
            uni.switchTab({
              url: '/pages/index/main'
            })
          }
        })
      })
    },
    retSetAttrGroupStatus: function () {
      let self = this
      console.log("retSetAttrGroupStatus")
      self.selectorData.attrgroups.forEach((item, i) => {
        item.attrs.forEach((attr, j) => {
          if (j === 0) {
            self.selectorData.attrgroups[i].attrs[j] = Object.assign({}, self.selectorData.attrgroups[i].attrs[j], {
              status: true
            })
            self.selectorData.attrgroups[i].selectAttrsId = j
          } else {
            self.selectorData.attrgroups[i].attrs[j] = Object.assign({}, self.selectorData.attrgroups[i].attrs[j], {
              status: false
            })
          }
        })
      })
      console.log(self.selectorData)
    },
    setAttrGroupStatus: function (groups_idx, attrs_idx) {
      let self = this
      self.selectorData.attrgroups[groups_idx].attrs[attrs_idx].status = true
      self.selectorData.attrgroups[groups_idx].selectAttrsId = attrs_idx
      self.selectorData.attrgroups[groups_idx].attrs.forEach((item, index) => {
        if (index !== attrs_idx) {
          self.selectorData.attrgroups[groups_idx].attrs[index].status = false
        }
      })
    },
    getCartNum: function (user_key) {
      let self = this
      if (self.isGettingCart) return
      self.isGettingCart = true
      let data = {
        i: self.globalI,
        user_key: user_key,
      }
      self.$Phttp.post(Config.JAVA_SAAS_URLS.getCartNum, data).then((res) => {
        self.isGettingCart = false
        self.toast(true)
        res = res.data
        self.bottomNaviData.cartNum = res.data
      })
    },
    intervalChange: function (e) {
      this.intervalVal = e.detail.current + 1
    },
    goTop: function () {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 0,
      })
    },
    goBuyers: function () {
      uni.pageScrollTo({
        scrollTop: BASE_INOF_HEIGHT,
        duration: 0,
      })
    },
    goDetail: function () {
      uni.pageScrollTo({
        scrollTop: BUYER_HEIGHT,
        duration: 0,
      })
    },
    showMoreData: function () {
      console.log('showMore')
      this.showMore = !this.showMore
    },
    toHome: function () {
      uni.switchTab({
        url: "/pages/index/main_new"
      })
    },
    toCart: function () {
      if (!this.isLogin()) return // wechat判断是否登陆
      uni.switchTab({
        url: "/pages/cart/cart"
      })
    },
    addCart: function(type = 1) {
      let self = this
      if (!self.hasRegister())  return
      if (!self.isAvailable()) return
      if (this.userInfo.community === null) {
        this.toLeaderList()
        return
      }
      if (self.selectorData.attrgroups != null && self.selectorData.attrgroups.length >= 0 && type === 1) {
        self.buy(-1)
        return
      }
      self.toast({
        type: 'loading',
        desc: '加载中...',
      })
      let data = {
        i: self.globalI,
        user_key: self.userInfo.user_key,
        goods_key: self.goods_key,
        store_key: 0,
        num: self.selectorData.num,
        token: self.userInfo.access_token,
        attr_keys: self.attr_keys,
        attr_names: self.selectorData.chooseSpec
      }
      self.$Phttp.post(Config.JAVA_SAAS_URLS.joinCart, data).then((res) => {
        res = res.data
        if (res.code === 0) {
          self.setRefreshCart(true)
          self.addIndexRefresh({
            goods_key: self.goods_key,
            cart_num: self.inChooseProductCartNum + self.selectorData.num,
            cart_key: res.data.cart_key
          })
          self.addCategoryRefresh({
            goods_key: self.goods_key,
            cart_num: self.inChooseProductCartNum + self.selectorData.num,
            cart_key: res.data.cart_key
          })
          self.getCartNum(self.userInfo.user_key)
          self.selectorData.show = false
        } else {
          self.toast({
            desc: res.msg,
            type: 'warn',
            time: 3000
          })
        }
      })
    },
    buy: function (type = 1) {
      let self = this
      if (!self.hasRegister()) return //判断是否登录
      if (!self.isAvailable()) return
      if (this.userInfo.community === null) {
        this.toLeaderList()
        return
      }
      self.selectorData = Object.assign({}, self.selectorData, {
        show: true,
        type: type
      })
      if (self.selectorData.attrgroups != null && self.selectorData.attrgroups.length > 0) {
        self.selectAttrItem({
          groups_idx: 0,
          attrs_idx :0
        })
      }
    },
    submit: function () {
      if (!this.hasRegister())  return
      if (this.selectorData.type !== 1) {
        this.addCart(-1)
        return
      }

      // delete this.selectorData.id
      // this.goodses = [this.selectorData]
      this.selectorData.show = false
      uni.navigateTo({
        url: '/pages/order/create?way=2'
      })
    },
    isAvailable: function () {
      let self = this

      if (this.goods.stock < 1) {
        self.toast({
          type: 'warn',
          desc: '库存不足'
        })
        return false
      }
      return true
    },
    doScrollTop: function () {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    },
    closeSelector: function () {
      this.selectorData.show = false
    },
    reduceNum: function () {
      if (this.selectorData.num > 1) {
        this.selectorData.num--;
      } else {
        this.toast({
          type: 'warn',
          desc: '商品不得少于1件'
        })
      }
    },
    addNum: function () {
      if (this.selectorData.num < this.selectorData.stock) {
        this.selectorData.num++;
      } else {
        this.toast({
          type: 'warn',
          desc: '商品库存不足'
        })
      }
    },
    selectAttrItem: function (e) {
      let self = this
      self.toast({
        type: 'loading',
        desc: '加载中...'
      })
      let groups_idx = e.groups_idx
      let attrs_idx = e.attrs_idx
      if (groups_idx !== undefined && attrs_idx !== undefined)
        self.setAttrGroupStatus(groups_idx, attrs_idx)

      var attr_keys = ','
      var chooseSpec = ''
      self.selectorData.attrgroups.forEach((item, idx) => {
        attr_keys += item.attrs[item.selectAttrsId].goodsattr_key + ','
        chooseSpec += item.attrs[item.selectAttrsId].name + " "
      })
      let data = {
        attr_keys: attr_keys,
        goods_key: self.goods_key,
      }
      self.$Phttp.post(Config.JAVA_SAAS_URLS.getGoodAttrs, data).then((res) => {
        self.toast(true)
        res = res.data
        if (res.code === 0) {
          self.selectorData = Object.assign({}, self.selectorData, res.data, {
            chooseSpec: chooseSpec,
            attr_keys: attr_keys,
            attr_names: chooseSpec
          })
          console.log(self.selectorData)
          self.attr_keys = attr_keys
        }
      })
    },
    setReload: function () {
      return true
    },
    createShareImg: function () {
      let self = this
      self.ctx.drawImage(self.image_root + self.images[0], 0, 0, 375, 240)
      self.ctx.draw()
    },
    getUserInfoSuccess: function (userInfo) {
      if (Util.containsKey(this.shareLeader, 'user_key')) {
        this.setUserInfo({
          bind_leader_key: this.shareLeader.user_key,
          community: this.shareLeader.community
        })
      }
      this.setUserInfo(userInfo)
      this.setLoginWx(true)
    },
    getUserInfoH5: function () {
      this.setLoginWx(true)
    },
    handleClose: function () {
      this.loginDialogData.show = false
    },
    isLogin: function () {
      // #ifdef MP-WEIXIN || H5
      if (this.userInfo === undefined || !Util.containsKey(this.userInfo, 'user_key')) {
        this.loginDialogData = Object.assign({}, this.loginDialogData, {
          show: true
        })
        return false
      }
      // #endif
      return true
    },
    isChooseGroup: function () {
      let self = this
      if (self.group === undefined || !Util.containsKey(self.group, 'id')) {
        self.toast({
          type: 'warn',
          desc: '未选择提货点...',
          time: 2000
        })
        if (parseInt(self.globalI) === 8) {
          self.getCoordinate('济南')
        } else {
          self.getCoordinate('郑州')
        }
        return false
      }
      return true
    },
    getCoordinate: function (city) {
      var self = this
      self.isGettingLocation = true
      qqMap.geocoder({
        address: city,
        success: (res) => {
          console.log(res)
          var location = {
            latitude: res.result.location.lat,
            longitude: res.result.location.lng,
            city: city
          }
          self.setUserCustomLocation(location)

          uni.navigateTo({
            url: '/pkUserInfo/address/address?way=2'
          })
        },
        fail: (res) => { },
        complete: (res) => {
          console.log(res)
          self.isGettingLocation = false
        }
      });
    },
    // 关闭分享picker
    showWXShareDialog: function (isShow) {
      this.pickData = Object.assign({}, this.pickData, {
        show: isShow
      })
    },
    // 前往分享
    toShare: function () {
      this.showWXShareDialog(false)
      uni.navigateTo({
        url: '/pkMain/share/share?id=' + this.goods_key
      })
    },
    // 优惠券相关
    getCoupons: function () {
      if (this.couponLength === 0) {
        this.toast({
          type: 'warn',
          desc: '无优惠券可领取'
        })
        return
      }
      this.couponSelector = Object.assign({}, this.couponSelector, {
        show: true
      })
    },
    getCouponsList: function () {
      let self = this
      if (self.isGettingCoupon) return
      self.isGettingCoupon = true
      let data = {
        i: self.globalI,
        user_key: self.userInfo.user_key,
        goods_key: self.goods_key,
        limit: 10,
        page: 1
      }
      self.$Phttp.post(Config.JAVA_SAAS_URLS.couponDialog, data).then((res) => {
        self.isGettingCoupon = false
        res = res.data
        if (res.code === 0) {
          let coupons = res.data
          coupons.forEach((item, index) => {
            // 							coupons[index].begin_date = coupons[index].begin_date.split('-').join('.')
            // 							coupons[index].end_date = coupons[index].end_date.split('-').join('.')
            coupons[index].isGet = false
          })
          self.coupons = coupons
          self.couponLength = coupons.length
        }
      })
    },
    closeCouponSelector: function () {
      this.couponSelector = Object.assign({}, this.couponSelector, {
        show: false
      })
    },
    getCouponById: function (coupon_id, index) {
      let self = this
      let data = {
        i: self.globalI,
        coupon_id: coupon_id,
        user_key: self.userInfo.user_key
      }
      // 优惠券已领取
      let coupons = self.coupons
      coupons[index].isGet = true
      self.coupons = Object.assign({}, self.coupons, coupons)
      for (var i = 0; i < 4; i++) {
        setTimeout(() => {
          self.coupons = Object.assign({}, self.coupons, coupons)
        }, 100)
      }
      self.$Phttp.post(Config.JAVA_SAAS_URLS.getCoupons, data).then((res) => {
        res = res.data
        if (res.code === 0) {
          self.toast({
            type: 'success',
            desc: '领取成功'
          })
        }
      })
    },
    toLeaderList: function () {
      uni.navigateTo({
        url: '/pkUserInfo/address/address'
      })
    }
  },
  onPageScroll(e) {
    let self = this
    let scrollTop = e.scrollTop
    if (scrollTop < BASE_INOF_HEIGHT) {
      self.topNaviData = Object.assign({}, this.topNaviData, {
        show: false,
        isProduct: true,
        isRecorder: false,
        isDetail: false
      })
      self.topButton.show = false
    } else if (scrollTop >= BASE_INOF_HEIGHT && scrollTop < BUYER_HEIGHT) {
      self.topNaviData = Object.assign({}, this.topNaviData, {
        show: true,
        isProduct: false,
        isRecorder: true,
        isDetail: false
      })
      self.topButton.show = true
    } else if (scrollTop >= BUYER_HEIGHT) {
      self.topNaviData = Object.assign({}, this.topNaviData, {
        show: true,
        isProduct: false,
        isRecorder: false,
        isDetail: true
      })
      self.topButton.show = true
    }
  },
  onShareAppMessage(res) {
    let self = this
    console.log('/pages/index/product?goods_key=' + self.goods_key + '&user_key=' + self.userInfo.user_key)
    return {
      title: self.goods.name,
      path: '/pages/index/product?goods_key=' + self.goods_key + '&user_key=' + self.userInfo.user_key
    }
  }
}
</script>

<style>
@import url("../../common/css/animation");

page {
  background: #f6f6f6;
  font-family: PingFang-SC-Medium;
}
</style>
