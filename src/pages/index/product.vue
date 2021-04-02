<template>
	<view>
		<view>
			<!-- <canvas canvas-id="shareCanvas" style="width: 100%;height: 770upx;"></canvas> -->
			<swiper class='swiper' id='swiper' @change="intervalChange" :duration="500" :circular="true">
				<block v-for="(item, index) in images" :key="index">
					<swiper-item>
						<image :src="image_root + item" :lazy-load="true" class="slide-image" mode='aspectFill' />
					</swiper-item>
				</block>
			</swiper>

			<view class='swiper-num'>{{intervalVal}}/{{images!==null?images.length:0}}</view>

			<!-- #ifdef APP-PLUS||H5 -->
			<button class='share' @tap="clickShare">
				<image src='../../static/ic_share.png' :lazy-load="true"></image>
				<text>分享</text>
			</button>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<button class='share' @tap="showWXShareDialog(true)">
				<image src='../../static/ic_share.png' :lazy-load="true"></image>
				<text>分享</text>
			</button>
			<!-- #endif -->

			<view class='base-info' id='base-info'>
				<view class='top'>
					<view class="price-box">
						<text class='unit'>￥</text>
						<text class='price'>{{integerPrice}}</text>
						<text class='sub-price'>.{{decimalPrice}}</text>
						<text class='o-price'>￥{{goods.original_price}}</text>
					</view>
					<view class='right base-right'>
						<text>距结束</text>
						<text>{{countDownDay}}天{{countDownHour}}:{{countDownMinute}}:{{countDownSecond}}</text>
					</view>
				</view>
				<view class='info'>
					<text class='title'>{{goods.name}}</text>
					<text class='desc'>现在下单，预计{{expectTime}}可自提</text>
					<view class='bottom'>剩余{{goods.stock}}件，已售{{goods.sales_num}}件</view>
				</view>
			</view>

			<view class="uni-list-cell uni-list-cell-last" style="margin-top: 20upx;background:white" @tap="getCoupons"
			 hover-class="uni-list-cell-hover" v-if="couponLength>0">
				<view class="uni-list-cell-navigate uni-navigate-right">
					领券
					<uni-badge :text="couponLength" type="danger"></uni-badge>
				</view>
			</view>

			<view class='buyers' v-if="showBuyers" id='buyers' :style='showMore?"max-height: unset":"max-height: 340rpx"'>
				<view class='col-title'>
					<text class='title'>购买记录</text>
					<view class='right'>已有
						<text class='num'>{{hasBugAmount}}</text>人购买，商品共销售
						<text class='num'>{{goods.sales_num}}</text>份
						<image class='arrow' src='../../static/ic_arrow_right.png' :lazy-load="true"></image>
					</view>
				</view>
				<view class='conten'>
					<block v-for="(item, index) in goods.users" :key="index">
						<image :src="item.img?item.img:'../../static/ic_default_head.png'" :lazy-load="true" class='user' v-if="(showMore&index<29)|(!showMore&index<11)"></image>
						<!-- <image src="../../static/ic_more_buyer.png" class='user' v-else-if="!showMore&index>11"></image> -->
					</block>
					<image :src="showMore?'../../static/ic_retract.png':'../../static/ic_more_buyer.png'" :lazy-load="true" class='user'
					 @tap.stop="showMoreData" v-if="showMoreButton"></image>
				</view>
			</view>

			<view class='product-detail'>
				<view class='col-title'>
					<view class='title'>
						<text>商</text>
						<text class='point'>·</text>
						<text>品</text>
						<text class='point'>·</text>
						<text>详</text>
						<text class='point'>·</text>
						<text>情</text>
					</view>
					<text class='sub-title'>PURCHASE RECORDS</text>
				</view>
				<block v-if="showDetail">
					<uParse :content="goods.details" @preview="preview" @navigate="navigate" />
				</block>
				<!-- <rich-text style="width: 750upx" :nodes="goods.details"></rich-text> -->
				<!-- <template is="wxParse" data="{{wxParseData:detail.nodes}}"></template> -->
			</view>
			<view class='service'>
				<text class='col-name'>服务说明</text>
				<view class='item'>
					<view class='point'></view>
					<view class='content'>
						<text class='name'>划线价格</text>
						<text>：指商品的厂商指导价、标签价格或者商品曾经暂时过的价格，<text class='underline'>并非原价</text>，仅供参考。</text>
					</view>
				</view>
				<view class='item'>
					<view class='point'></view>
					<view class='content'>
						<text class='name'>未划线价格</text>
						<text>：指商品的<text class='underline'>实时价格</text>，不因表述的差异改变性质。具体成本价跟商品参加活动发生改变，最终以订单结算价格为准。</text>
					</view>
				</view>
				<view class='item'>
					<view class='point'></view>
					<view class='content'>
						<text class='name'>关于包装</text>
						<text>：因厂家会在没有任何提前通知的情况下更改产品包装、产地或者一些附件，友邻优选<text class='underline'>不能确保客户收到的货物与小程序中的图片、产地、附件说明完全一致。</text>若友邻优选没有及时更新，请谅解！<text
							 class='red'>图片仅供参考，请以实物为准</text>。</text>
					</view>
				</view>
				<view class='item'>
					<view class='point'></view>
					<view class='content'>
						<text class='name'>退换货</text>
						<text>：生鲜水果类商品，<text class='underline'>若无质量问题不支持无理由退货以及拒收</text>，敬请谅解；如您收到的商品有质量问题，请在确定可以提货（以友邻优选小程序微信服务通知提示可以提货开始时间为准）之时<text
							 class='red'>24小时</text>内联系客服，并提交商品的完整照片及相关证明文件，我们将及时为您进行售后处理。</text>
					</view>
				</view>
			</view>
			<!-- <view class='to-top' v-if="showToTop" @tap='goTop'>
			  <image src='../../static/ic_to_top.png'></image>
			</view> -->
			<copy-right></copy-right>
			<view style='height:100rpx; width:100%;'></view>
		</view>
		<block v-if="showComponents">
			<my-top-button :propData="topButton" @toTop="doScrollTop"></my-top-button>
			<product-selector :propData="selectorData" @close="closeSelector" @reduce="reduceNum" @add="addNum" @submit="submit"
			 @selectAttrItem="selectAttrItem"></product-selector>
			<top-navigator @goTop="goTop" @goBuyers="goBuyers" @goDetail="goDetail" :propData="topNaviData" :countDownDay="countDownDay"
			 :countDownHour="countDownHour" :countDownMinute="countDownMinute" :countDownSecond="countDownSecond"></top-navigator>
			<coupon-seclector :propData="couponSelector" :coupons="coupons" btnText="立即领取" @close="closeCouponSelector"
			 @getCouponById="getCouponById"></coupon-seclector>
			<!--  #ifdef  MP-WEIXIN || H5 -->
			<my-wx-login :propData="loginDialogData" @handleClose="handleClose" @getUserInfoSuccess="getUserInfoSuccess"
			 @getUserInfoH5="getUserInfoH5"></my-wx-login>
			<!--  #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<my-picker :propData="pickData" @close="showWXShareDialog(false)" @toShare="toShare"></my-picker>
			<!-- #endif -->
		</block>
		<bottom-navigator :propData="bottomNaviData" @toHome="toHome" @toCart="toCart" @addCart="addCart" @buy="buy"></bottom-navigator>
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

	import TopNavigator from '../../components/yx_pendant_view/productTopNavigator.vue'
	import BottomNavigator from '../../components/yx_pendant_view/productBottomNavigator.vue'
	import CopyRight from '../../components/yx_view/myCopyRight.vue'
	import uParse from '../../common/third/uParse/src/wxParse.vue'
	import MyTopButton from '../../components/yx_view/myToTopBottom.vue'
	import ProductSelector from '../../components/yx_dialog/myProductSelector.vue'
	import uniBadge from "../../components/uni-badge.vue"
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
		data() {
			return {
				id: 0,
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
				showDetail: false,
				showComponents: false,
				showBuyers: false,
				images: [],
				scene: undefined,
				image_root: '',
				intervalVal: 1,
				goods: {
					name: '',
					stock: 0,
					sales_num: 0
				},
				activity_key: 0,
				activity_endtime: 0,
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
		components: {
			TopNavigator,
			BottomNavigator,
			CopyRight,
			uParse,
			MyTopButton,
			ProductSelector,
			uniBadge,
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
						this.getCartNum(this.userInfo.user_key)
						this.getCouponsList()
					}
				},
				immediate: true
			},
			userInfo: {
				handler() {
					if (this.group !== undefined && this.userInfo !== undefined) {
						this.getCartNum(this.userInfo.user_key)
						this.getCouponsList()
					}

					if ((this.userInfo === undefined && this.isTryGetUserInfo) ||
						(this.userInfo != undefined && !Util.containsKey(this.userInfo, 'nickName') && this.isTryGetUserInfo)) {

					} else {
						this.loginDialogData = Object.assign({}, this.loginDialogData, {
							show: false
						})
						if (!this.isGoToArea) {
							this.isGoToArea = true
						}
					}
					if (this.userInfo != undefined && Util.containsKey(this.userInfo, 'user_key')) {
						this.resfreshCartNum(this.userInfo.user_key, (res) => {})
						this.handelShare()
					}
				},
				immediate: true
			},
			acts: {
				handler() {
					if (this.acts !== undefined) {
						this.activity_key = this.acts.activity_key
						this.activity_endtime = this.acts.end_time
					}
				},
				immediate: true
			},
			globalI: {
				handler() {},
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

			//获取分享时传递的参数
			if (options.scene !== undefined) {
				let scene = decodeURIComponent(options.scene);

				this.leader_key = scene.split('-')[0];
				this.goods_key = scene.split("-")[1];
				this.activity_key = scene.split('-')[2];
				this.activity_endtime = scene.split('-')[3];
				let scene_i = scene.split('-')[4];
				if (parseInt(scene_i) > 0) {
					this.changeI(parseInt(scene_i))
				}
			}
			options.i ? this.changeI(options.i) : null
			options.activity_key ? this.activity_key = options.activity_key : null
			options.activity_endtime ? this.activity_endtime = options.activity_endtime : null
			options.user_key ? this.leader_key = options.user_key : null
			this.initPage()
			this.getProductDetail(this.goods_key)
			if (this.leader_key && this.leader_key !== null) {
				this.checkLeader(this.leader_key)
			}
			setTimeout(() => {
				self.showBuyers = true
			}, 150)
			setTimeout(() => {
				self.showComponents = true
			}, 200)
			setTimeout(() => {
				self.showDetail = true
			}, 300)
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
			acts() {
				return this.$store.state.acts
			},
			globalI() {
				return this.$store.state.globalI
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
			initPage: function() {
				let self = this

				uni.getSystemInfo({
					success(system) {
						if (system.errMsg === "getSystemInfo:ok") {
							self.systemInfo = system
						}
					}
				})
			},
			checkLeader: function(user_key) {
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
			changeI: function(i) {
				this.setGlobalI(i)
			},
			handelShare() {
				let self = this
				if (this.isShowDialog) {
					return
				}
				if (Util.containsKey(this.userInfo, 'user_key') && Util.containsKey(this.shareLeader, 'community')) {
					if (String(this.shareLeader.user_key) === String(this.userInfo.bind_leader)) {
						return
					}
					if (this.userInfo.community !== null) {
						this.isShowDialog = true
						uni.showModal({
							content: "您当前绑定的小区为[" + this.userInfo.community + ']是否要切换到[' + this.shareLeader.community + ']',
							success: function(res) {
								if (res.confirm) {
									self.bindLeader(self.shareLeader.user_key,self.shareLeader.community)
								}
							}
						})
					} else {
						self.bindLeader(self.shareLeader.user_key,this.shareLeader.community)
					}

				}
			},
			bindLeader: function(leader_key,community) {
				let self = this
				if (!self.userInfo) return
				let postData = {
					user_key: self.userInfo.user_key,
					leader_key: leader_key,
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.setDefaultLeader, postData).then((res) => {
					res = res.data
					if (res.code === 0) {
						self.userInfo.bind_leader_key=leader_key
						self.userInfo.community=community
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
						self.expectTime = self.getPickUpTime()
						self.hasBugAmount = res.data.buy_count
						self.setShareMessage(self.image_root + self.images[0], self.goods.name, self.goods.name, self.image_root +
							self.pic, self.goods.goods_key, self.userInfo ? self.userInfo.user_key : '0', this.activity_key, this.activity_endtime, self.globalI
						)

						if (res.data.users.length >= 11) {
							self.showMoreButton = true
							self.showMore = false
						}

						var price = res.data.price.toFixed(2)
						var priceArr = price.split('.')
						self.integerPrice = priceArr[0]
						var decimalPrice = '00'
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
							activity_key: self.activity_key,
							activity_endtime: self.activity_endtime,
						})
						delete self.selectorData.id
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
						self.cutDown(res.data.end_time2)

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
			retSetAttrGroupStatus: function() {
				let self = this
				if (self.selectorData.attrgroups === null) return
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
			},
			setAttrGroupStatus: function(groups_idx, attrs_idx) {
				let self = this
				self.selectorData.attrgroups[groups_idx].attrs[attrs_idx].status = true
				self.selectorData.attrgroups[groups_idx].selectAttrsId = attrs_idx
				self.selectorData.attrgroups[groups_idx].attrs.forEach((item, index) => {
					if (index !== attrs_idx) {
						self.selectorData.attrgroups[groups_idx].attrs[index].status = false
					}
				})
			},
			getCartNum: function(user_key) {
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
			intervalChange: function(e) {
				this.intervalVal = e.detail.current + 1
			},
			goTop: function() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0,
				})
			},
			goBuyers: function() {
				uni.pageScrollTo({
					scrollTop: BASE_INOF_HEIGHT,
					duration: 0,
				})
			},
			goDetail: function() {
				uni.pageScrollTo({
					scrollTop: BUYER_HEIGHT,
					duration: 0,
				})
			},
			showMoreData: function() {
				console.log('showMore')
				this.showMore = !this.showMore
			},
			toHome: function() {
				uni.switchTab({
					url: "/pages/index/main"
				})
			},
			toCart: function() {
				if (!this.isLogin()) return // wechat判断是否登陆
				uni.switchTab({
					url: "/pages/cart/cart"
				})
			},
			addCart: function(type = 1) {
				let self = this
				if (!self.checkLogin()) return //APPPLUS判断是否登录
				if (!self.isAvailable()) return
				if (!self.isLogin()) return // wechat判断是否登陆
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
					activity_key: this.activity_key, //活动id
					activity_endtime: this.activity_endtime, //活动结束时间
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
							cart_key: res.data
						})
						self.addCategoryRefresh({
							goods_key: self.goods_key,
							cart_num: self.inChooseProductCartNum + self.selectorData.num,
							cart_key: res.data
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
			buy: function(type = 1) {
				let self = this
				if (!self.checkLogin()) return //判断是否登录
				if (!self.isLogin()) return // wechat判断是否登陆
				if (!self.isAvailable()) return
				if (this.userInfo.community === null) {
					this.toLeaderList()
					return
				}
				self.selectorData = Object.assign({}, self.selectorData, {
					show: true,
					type: type
				})
				if (self.selectorData.attrgroups.length > 0) {
					self.selectAttrItem()
				}
			},
			submit: function() {
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
			isAvailable: function() {
				let self = this
				if (!self.canBuy) {
					self.toast({
						type: 'warn',
						desc: '活动已结束'
					})
					return false
				}

				if (this.goods.stock < 1) {
					self.toast({
						type: 'warn',
						desc: '库存不足'
					})
					return false
				}

				if ((new Date()).getTime() / 1000 < this.goods.goods_begin_time) {
					self.toast({
						type: 'warn',
						desc: '活动未开始'
					})
					return false
				}
				if ((new Date()).getTime() / 1000 > this.goods.end_time2) {
					self.toast({
						type: 'warn',
						desc: '活动已结束'
					})
					return false
				}
				return true
			},
			doScrollTop: function() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				})
			},
			closeSelector: function() {
				this.selectorData.show = false
			},
			reduceNum: function() {
				if (this.selectorData.num > 1) {
					this.selectorData.num--;
				} else {
					this.toast({
						type: 'warn',
						desc: '商品不得少于1件'
					})
				}
			},
			getPickUpTime:function(){
				// 周天周一周二周三都是是周三送
				// 周四周五周周六都是是周六送
				let str = "周";
				let week = new Date().getDay();
				switch (week) {
				        case 0 :
				                str += "三";
				                break;
				        case 1 :
				                str += "三";
				                break;
				        case 2 :
				                str += "三";
				                break;
				        case 3 :
				                str += "三";
				                break;
				        case 4 :
				                str += "六";
				                break;
				        case 5 :
				                str += "六";
				                break;
				        case 6 :
				                str += "六";
				                break;
				}
				return str;
			},
			addNum: function() {
				if (this.selectorData.num < this.selectorData.stock) {
					this.selectorData.num++;
				} else {
					this.toast({
						type: 'warn',
						desc: '商品库存不足'
					})
				}
			},
			selectAttrItem: function(groups_idx, attrs_idx) {
				let self = this
				self.toast({
					type: 'loading',
					desc: '加载中...'
				})
				if (groups_idx !== undefined && attrs_idx !== undefined)
					self.setAttrGroupStatus(groups_idx, attrs_idx)

				var attr_keys = ','
				var chooseSpec = ''
				self.selectorData.attrgroups.forEach((item, idx) => {
					attr_keys += item.attrs[item.selectAttrsId].goodsattr_key + ','
					chooseSpec += item.attrs[item.selectAttrsId].name + " "
				})
				let data = {
					i: self.globalI,
					attr_keys: attr_keys,
					goods_key: self.goods_key,
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getGoodAttrs, data).then((res) => {
					self.toast(true)
					res = res.data
					if (res.code === 0) {
						self.selectorData = Object.assign({}, self.selectorData, res.data[0], {
							chooseSpec: chooseSpec,
							attr_keys: attr_keys,
							attr_names: chooseSpec
						})
						self.attr_keys = attr_keys
					}
				})
			},
			setReload: function() {
				return true
			},
			createShareImg: function() {
				let self = this
				self.ctx.drawImage(self.image_root + self.images[0], 0, 0, 375, 240)
				self.ctx.draw()
			},
			getUserInfoSuccess: function(userInfo) {
				if(Util.containsKey(this.shareLeader, 'user_key')){
					this.setUserInfo({
						bind_leader_key: this.shareLeader.user_key,
						community:this.shareLeader.community
					})
				}
				this.setUserInfo(userInfo)
				this.setLoginWx(true)
			},
			getUserInfoH5: function() {
				this.setLoginWx(true)
			},
			handleClose: function() {
				this.loginDialogData.show = false
			},
			isLogin: function() {
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
			isChooseGroup: function() {
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
			getCoordinate: function(city) {
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
					fail: (res) => {},
					complete: (res) => {
						console.log(res)
						self.isGettingLocation = false
					}
				});
			},
			// 关闭分享picker
			showWXShareDialog: function(isShow) {
				this.pickData = Object.assign({}, this.pickData, {
					show: isShow
				})
			},
			// 前往分享
			toShare: function() {
				this.showWXShareDialog(false)
				uni.navigateTo({
					url: '/pkMain/share/share?goods_key=' + this.goods_key
				})
			},
			// 优惠券相关
			getCoupons: function() {
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
			getCouponsList: function() {
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
			closeCouponSelector: function() {
				this.couponSelector = Object.assign({}, this.couponSelector, {
					show: false
				})
			},
			getCouponById: function(coupon_id, index) {
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
			toLeaderList: function() {
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
			if (res.from === 'button') { // 来自页面内分享按钮
			}
			return {
				title: self.goods.name,
				path: '/pages/index/product?goods_key=' + self.goods_key + '&user_key=' + self.userInfo.user_key + '&activity_key=' + this.activity_key +
					'&activity_endtime=' + this.activity_endtime + "&i=" + this.globalI
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

	.swiper {
		width: 100%;
		height: 530rpx;
	}

	.swiper image {
		width: 100%;
		height: 100%;
	}

	.swiper-num {
		width: 80rpx;
		height: 40rpx;
		border-radius: 20rpx;
		line-height: 40rpx;
		text-align: center;
		font-size: 24rpx;
		color: #fff;
		background: #000;
		position: relative;
		top: -120rpx;
		left: calc(50% - 50rpx);
		opacity: 0.6;
	}

	.share {
		position: fixed !important;
		z-index: 9999;
		width: 170rpx;
		height: 60rpx;
		background: #1dc422;
		border-radius: 30rpx 0rpx 0rpx 30rpx;
		position: absolute;
		top: 80rpx;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	button::after {
		border: none
	}

	.share image {
		width: 40rpx;
		height: 40rpx;
	}

	.share text {
		font-size: 28rpx;
		font-weight: 500;
		color: #fff;
		margin-left: 10rpx;
	}

	.base-info {
		width: calc(100% - 48rpx);
		height: 300rpx;
		margin-left: 24rpx;
		margin-right: 24rpx;
		background: #fff;
		box-shadow: 0px 10px 20px 0px rgba(201, 201, 201, 0.16);
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		position: relative;
		margin-top: -80rpx;
	}

	.base-info .top {
		width: 100%;
		height: 110rpx;
		background: linear-gradient(90deg, #08c00d 0%, #7fd754 100%);
		border-radius: 20rpx 20rpx 0rpx 0rpx;
		display: flex;
		color: #fff;
	}

	.base-info .top .price-box {
		margin-bottom: 20rpx;
		display: flex;
		align-items: flex-end;
	}

	.base-info .top .price-box .unit {
		font-size: 36rpx;
		line-height: 36rpx;
		margin-left: 50rpx;
	}

	.base-info .top .price-box .price {
		font-size: 76rpx;
		line-height: 76rpx;
		margin-left: 5rpx;
		margin-bottom: -2rpx;
		display: block;
	}

	.base-info .top .price-box .sub-price {
		font-size: 46rpx;
		line-height: 46rpx;
		display: block;
	}

	.base-info .top .price-box .o-price {
		font-size: 28rpx;
		margin-left: 20rpx;
		line-height: 28rpx;
		text-decoration: line-through;
		display: block;
	}

	.base-info .top .right {
		width: 242rpx;
		height: 120rpx;
		/* background: rgba(64, 65, 70, 1); */
		border-radius: 20rpx 20rpx 0px 0px;
		padding-left: 50rpx;
		position: absolute;
		right: 0;
		top: -10rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
	}

	.base-info .top .base-right {
		background-image: url("http://fanimg.aprain.cn/time_bg.png");
		background-size: 100% 100%;
		-moz-background-size: 100% 100%;
	}

	.base-info .top .right text {
		font-size: 30rpx;
		font-weight: bold;
		color: #c4a466;
	}

	.base-info .info {
		width: calc(100% - 48rpx);
		margin-left: 24rpx;
		margin-right: 24rpx;
		display: flex;
		flex-direction: column;
	}

	.base-info .info .title {
		width: 100%;
		height: 60rpx;
		line-height: 60rpx;
		margin-top: 15rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.base-info .info .desc {
		width: 100%;
		height: 45rpx;
		font-size: 24rpx;
		line-height: 45rpx;
		font-weight: 400;
		color: #888;
	}

	.base-info .info .bottom {
		width: 100%;
		height: 45rpx;
		font-size: 24rpx;
		line-height: 45rpx;
		font-weight: 400;
		color: #333;
	}

	.base-info .info .bottom.money {
		color: #f76260;
		margin-left: 5rpx;
		margin-right: 5rpx;
	}

	.wxParse ._image {
		width: 100%;
		display: flex;
	}

	.buyers {
		width: calc(100% - 48rpx);
		margin-left: 24rpx;
		margin-right: 24rpx;
		max-height: 340rpx;
		background: #fff;
		box-shadow: 0px 10px 20px 0px rgba(201, 201, 201, 0.16);
		border-radius: 20rpx;
		margin-top: 20rpx;
		overflow: hidden;
	}

	.buyers .col-title {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		border-bottom: solid 1rpx #f6f6f6;
		display: flex;
		justify-content: space-between;
	}

	.buyers .col-title .title {
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
		margin-left: 40rpx;
	}

	.buyers .col-title .right {
		font-size: 20rpx;
		color: #333;
		display: flex;
		align-items: center;
		margin-right: 20rpx;
	}

	.buyers .col-title .num {
		font-size: 24rpx;
		color: #08c00d;
		margin-left: 5rpx;
		margin-right: 5rpx;
	}

	.buyers .col-title .arrow {
		width: 16rpx;
		height: 16rpx;
		margin-left: 10rpx;
	}

	.buyers .conten {
		width: calc(100% - 48rpx);
		padding: 15rpx 24rpx 15rpx 24rpx;
		display: flex;
		flex-wrap: wrap;
		overflow: hidden;
	}

	.buyers .user {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin: 15rpx;
	}

	.buyers .more {
		position: absolute;
		right: 0rpx;
		bottom: 0rpx;
	}

	.product-detail {
		width: 100%;
		min-height: 1000rpx;
		margin-top: 30rpx;
		display: flex;
		flex-direction: column;
	}

	.product-detail .col-title {
		width: 100%;
		height: 100rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.product-detail .col-title .title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}

	.product-detail .col-title .title .point {
		font-size: 20rpx;
		color: #ddd;
		margin-left: 10rpx;
		margin-right: 10rpx;
	}

	.product-detail .col-title .sub-title {
		font-size: 12rpx;
		font-weight: bold;
		color: #bbb;
		letter-spacing: 3rpx;
		margin-top: 10rpx;
	}

	.service {
		width: calc(100% - 48rpx);
		margin-left: 24rpx;
		margin-right: 24rpx;
		padding-bottom: 30rpx;
		background: #fff;
		box-shadow: 0px 10px 20px 0px rgba(201, 201, 201, 0.16);
		border-radius: 20rpx;
		margin-top: 30rpx;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.service .col-name {
		width: calc(100% - 90rpx);
		height: 100rpx;
		line-height: 100rpx;
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
		padding-left: 45rpx;
		padding-right: 45rpx;
	}

	.service .item {
		width: calc(100% - 50rxp);
		padding: 8rpx 25rpx 8rpx 25rpx;
		display: flex;
	}

	button {
		border-radius: 0upx;
	}

	.service .item .point {
		width: 6rpx;
		height: 6rpx;
		background: #e84118;
		margin-top: 14rpx;
	}

	.service .item .content {
		flex: 1;
		margin-left: 20rpx;
		font-size: 24rpx;
		color: #999;
		line-height: 38rpx;
	}

	.service .item .content .name {
		color: #666;
		font-weight: 600;
	}

	.service .item .content .underline {
		color: #666;
		text-decoration: underline;
	}

	.service .item .content .red {
		color: #e84118;
	}
</style>
