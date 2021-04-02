<template>
	<view>
		<error-tip  :propData="errorData" @hide="errorHide"></error-tip>
		<view class="items">
			<view class="item" @click="toAddress">
				<view class="address-container">
					<view class="row-container">
						<view class="title text-black">{{address.name}}</view>
						<view class="title text-black" style="margin-left: 40upx;">{{address.mobile}}</view>
					</view>
					<view class="row-container">
						<view class="cu-tag tag round bg-red" v-if="address.is_default">默认</view>
						<view class="cu-tag tag round bg-blue" v-if="address.tag">{{address.tag}}</view>
						<view class="address one-line-dot">{{address.province+address.city+address.area+' '+address.address}}</view>
					</view>
				</view>
			</view>
			<image class='line' src='../../static/line.png'></image>
			<view class="icon-right to-address" :style="is_choose_address?'':'margin-top:30rpx;'"></view>
		</view>
		<view class="items" @click="showPatternDialog=true">
			<view class="item">
				<view class="address-container">
					<view class="row-container">
						<view class="title text-black">配送方式</view>
					</view>
					<view class="coloum-container" v-if="delivery_mode=='self'">
						<view class="address one-line-dot" style="margin-left: 0upx;">提货点：{{delivery_store.name}}</view>
						<view class="address one-line-dot" style="margin-left: 0upx;">详细地址：{{delivery_store.address}}</view>
						<view class="address one-line-dot" style="margin-left: 0upx;">收货人：{{userInfo.name}}</view>
						<view class="address one-line-dot" style="margin-left: 0upx;">手机号：{{userInfo.tel}}</view>
					</view>
				</view>
			</view>
			<view class="to-address" style="margin-top: 26upx;">
				<text style="font-weight: normal;">{{delivery_mode=='home'?'配送到家':'上门自提'}}</text>
				<!-- <text style="font-weight: normal;">选择提货点</text> -->
				<text class="icon-right"></text>
			</view>
			<!-- <image class='line' src='../../static/line.png'></image> -->
		</view>
		<view class='items' v-for="(item, index) in goodses" :key="index">
			<view class='item'>
				<view class='top'>
					<!-- <text>预计{{expectTime}} 可自提</text> -->
					<text class="one-line-dot" style="width: 500upx;">{{item.name}}</text>
					<text class='num one-line-dot'>共{{item.num}}件商品</text>
				</view>
				<block>
					<view class='content'>
						<image :src='image_root+item.pic'></image>
						<text class='title'>{{item.name}}</text>
						<view class='descs'>
							<text class='desc'>数量：{{item.num}}</text>
							<text class='desc' v-if="item.attr_names">规格：{{item.attr_names==='undefined'?'无':item.attr_names}}</text>
						</view>
						<view class='bottom'>￥{{item.price}}</view>
					</view>
				</block>

				<view class="uni-list-cell uni-list-cell-last" @click="toDesignPlan(item.num, index)" hover-class="uni-list-cell-hover">
					<view v-if="config.devliery_plan_switch=='1'" class="uni-list-cell-navigate uni-navigate-right" style="font-size: 26upx;">
						<text style="width: 160upx;text-align: right;">配送计划</text>
						<view style="margin-right: 20upx;">{{getPlanMode(item.mode)}}</view>
					</view>
				</view>
			</view>
		</view>

		<view class='pays'>
			<view class='top'>
				<text>支付方式</text>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<view class='item item-circle-border'>
				<image src='../../static/ic_weixin_pay.png'></image>
				<view class='centet'>
					<text class='name'>微信支付</text>
					<text class='desc'>微信安全支付</text>
				</view>
				<radio class="select round myCheckBox" :class="true?'checked': ''" :disabled="true" :checked="true"></radio>
			</view>
			<view class='item ' v-if="userInfo.balance" style="height: unset;">
				用户余额：{{userInfo.balance}}
				<checkbox-group  class="select myCheckBox" style="width: 50rpx;" @change="useBalanceChange">
					<checkbox class="round" value="useBalance" :class="useBalance?'checked': ''" :checked="useBalance"></checkbox>
				</checkbox-group>
			</view>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS || H5 -->
			<view class='item item-circle-border' @tap.stop="selectWeixinPay(true)">
				<image src='../../static/ic_weixin_pay.png'></image>
				<view class='centet'>
					<text class='name'>微信支付</text>
					<text class='desc'>微信安全支付</text>
				</view>
				<checkbox class="myCheckBox round" disabled="true" :checked="isWeixinPay"/>
			</view>
			<view class='item item-circle-border' @tap="selectWeixinPay(false)">
				<image src='../../static/ali.png'></image>
				<view class='centet'>
					<text class='name'>支付宝支付</text>
					<text class='desc'>支付宝安全支付</text>
				</view>
				<checkbox class="myCheckBox round" :checked="!isWeixinPay"/>
			</view>
			<!-- #endif -->
		</view>

		<!-- <view class='items'>
			<view class='item'>
			  <view class='top'>
				<text>配送计划</text>
				<text class='num'>普通配送</text>
			  </view>
			</view>
		</view> -->

		<!-- <view class="uni-list-cell uni-list-cell-last" style="margin-top: 20upx;background:white" @tap="getCoupons" hover-class="uni-list-cell-hover">
			<view class="uni-list-cell-navigate uni-navigate-right">
				可使用优惠券
				<uni-badge :text="couponLength" type="danger"></uni-badge>
			</view>
		</view> -->
		<view class='ad-box' style="margin-top:40rpx;" v-if="ads!==undefined && ads.createOrderBanner !== null">
			<image class='ad' :src="image_root+ads.createOrderBanner.pic" @tap='adClick(ads.createOrderBanner.param)'></image>
		</view>
		<view style="height: 200upx;"></view>
		<view class='bottom-tools'>
			<view class='left'>
				<view class='all-price'>
					<text>总计：</text>
					<text class='price'>￥{{actualPrice}}</text>
				</view>
				<view class='desc'>总额：￥{{allprice}} 配送费：¥{{devliery_cost}} 优惠：￥{{coupon.money}}</view>
			</view>
			<button class='cu-btn buy' @tap='create'>去结算</button>
		</view>


		<view v-if="showComfrimDialog">
			<view class="mask" @tap="hideComfirmDialog"></view>
			<view class='confirm-dialog'>
				<text class='notice'>此商品需要您到店自提，请确认提货信息</text>
				<text class='expect'>预计{{expectTime}} 可提货</text>
				<view class='order-info'>
					<view class='row'>
						<text class='name'>收货人</text>
						<text class='content'>{{userInfo.name}}</text>
					</view>
					<view class='row'>
						<text class='name'>提货人联系方式</text>
						<text class='content'>{{userInfo.tel}}</text>
					</view>
					<view class='row'>
						<text class='name'>提货地点</text>
						<text class='content'>{{delivery_store.address}}</text>
					</view>
					<view class='row'>
						<text class='name'>自提点名称</text>
						<text class='content'>{{delivery_store.name}}</text>
					</view>
					<view class='row'>
						<text class='name'>商品金额</text>
						<text class='content'>￥{{actualPrice}}</text>
					</view>
					<view class='row'>
						<text class='name'>促销优惠</text>
						<text class='content'>￥{{coupon.money}}</text>
					</view>
					<view class='bottom'>
						<text>总计：</text>
						<text class='price'>￥{{actualPrice}}</text>
					</view>
				</view>
				<view class='buttons'>
					<button class='cu-btn button' @tap='hideComfirmDialog'>取消</button>
					<button class='cu-btn button pay' @click='subOrder'>确认支付</button>
				</view>
			</view>
		</view>
		<delivery-plan-dialog :show="showDeliveryPlan" :planMode="planMode" :plan="deliveryPlan" :deliveryKey="deliveryKey" :num="deliveryNum" :delivery_stocking_period="config.delivery_stocking_period" :index="deliveryIndex" @clickRidio="switchDeliveryPlan" @hide="hideDeliveryPlan" @generatePlan="generatePlan"></delivery-plan-dialog>
		<wx-phone-dialog :propData="phoneDialogData" @getPhoneNumber="getPhoneNumber"></wx-phone-dialog>
		<coupon-seclector :propData="couponSelector" :coupons="coupons" btnText="立即使用" @close="closeCouponSelector" @getCouponById="getCouponById"></coupon-seclector>
		<delivery-pattern-dialog :show="showPatternDialog" :devliery_home_switch="config.devliery_home_switch" :devliery_leader_switch="config.devliery_leader_switch" :delivery_stocking_period="config.delivery_stocking_period" :devliery_cost_setting="config.devliery_cost_setting" @close="showPatternDialog=false" @modeHome="modeHome" @modeSelf="modeSelf"></delivery-pattern-dialog>
	</view>
</template>

<script>
	import TimerCounter from '../../common/js/timeCounter.js'
	import Config from '../../common/js/Config.js'
	import Toast from '../../common/js/toast.js'
	import Pay from '../../common/js/pay.js'
	import Util from '../../common/js/util.js'

	import WxPhoneDialog from '../../components/yx_dialog/myWXPhoneDialog.vue'
	import UniBadge from '../../components/uni-badge.vue'
	import CouponSeclector from '../../components/yx_dialog/myCouponSelector.vue'
	import ErrorTip from '../../components/yx_dialog/myErrorTip.vue'
	import MyOrderTip from '../../components/yx_dialog/myOrderTip.vue'
	import DeliveryPlanDialog from '../../components/yx_dialog/deliveryPlanDialog.vue'
	import DeliveryPatternDialog from '../../components/yx_dialog/deliveryPatternDialog.vue'
	import {mapMutations} from 'vuex'
	export default {
		data() {
			return {
				show: false, //
				goodses: [],//下单商品列表
				expectTime: '', //到货时间
				image_root: '', // 图片域名
				allprice: 0, // 总金额
				productNum: 0, // 产品数量
				actualPrice: 0, // 最终金额
				coupon: {
					money: 0,
					id: 0
				}, //优惠金额
				showComfrimDialog: false,
				phoneDialogData: {
					show: false
				}, // 获取用户电话信息
				isWeixinPay: true, //是否微信支付
				couponLength: 0, //优惠券数量
				couponSelector: {
					show: false
				}, // 优惠券选择器
				coupons: [], // 优惠券列表
				// 错误提示
				errorData: {
					show: false,
					desc: ''
				},
				orderTipData:{
					show:true
				},
				isPayIng: false,
				showDeliveryPlan: false,
				deliveryKey: 'normal',
				deliveryNum: 0,
				deliveryIndex: 0,
				deliveryPlan: [],
				planMode: 'normal',
				address: {
					name: '请选择地址',
					mobile: '',
					tag: '',
					is_default: 0,
					province: '',
					city: '',
					area: '',
					address: ' '
				},
				is_choose_address: false,
				showPatternDialog: false,
				delivery_mode: 'home',
				devliery_cost: 0,
				delivery_store: {
					name: '',
					address: ''
				}, //配送方式为自提时，自提点的信息
				config: {
					devliery_day_setting:'0', //运达天数
					devliery_cost_setting:'0', //运费
					devliery_home_switch:'1',//开启送到家
					devliery_plan_switch:'1',//开启配送计划
					devliery_leader_switch:'1'//开启送到提货点
				},
				useBalance: false,
				useBalanceMoney: 0
			}
		},
		mixins: [TimerCounter, Toast, Pay],
		components: {
			WxPhoneDialog,
			UniBadge,
			CouponSeclector,
			ErrorTip,
			MyOrderTip,
			DeliveryPlanDialog,
			DeliveryPatternDialog
		},
		watch: {
			ads: {
				handler() {
				},
				immediate: true
			},
			goodses: {
				handler() {
				},
				immediate: true
			},
			actualPrice : {
				handler() {
				},
				immediate: true
			},
			userInfo: {
				handler() {
					console.log(this.userInfo)
					if (this.userInfo === undefined || !Util.containsKey(this.userInfo, 'tel') || this.userInfo.tel === null || this.userInfo.tel === '') {
						// #ifdef MP-WEIXIN
						this.phoneDialogData.show = true
						// #endif
						// #ifdef APP-PLUS
						uni.showModal({
							title: '提示',
							content: '检测到您尚未验证手机号码',
							showCancel: false,
							success: (res) => {
								if ( res.confirm ) {
									uni.navigateTo({
										url: '/pkUserInfo/info/phone'
									})
								}
							}
						})
						// #endif
					} else {
						this.phoneDialogData.show = false
					}
				},
				immediate: true
			}
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			},
			group() {
				return this.$store.state.group
			},
			ads() {
				return this.$store.state.ads
			},
			globalI() {
				return this.$store.state.globalI
			}
		},
		onLoad(options) {
			let self = this
			self.getConfig()
			self.initPage(options.way)
			self.getDefaultLeader()

			self.$event.$on('planChange', (plan)=> {
				self.createPlan(plan)
			})
		},
		onShow() {
			let self = this
			self.getDefaultAddress()
		},
		methods: {
			...mapMutations(['setUserInfo', 'setRefreshCart', 'addIndexRefresh', 'addCategoryRefresh','setisNewcomers']),
			initPage: function(way) {
				if (this.goodses.length !== 0) return
				var a = getCurrentPages()
				var t = a[a.length - 2]
				// #ifdef H5
				var e = t.$root.goodses
				this.image_root = t.$root.image_root
				// #endif
				// #ifdef MP-WEIXIN || APP-PLUS
				if (way === '1') {
					var e = []
					var cart = t.data.cart
					cart.forEach((item, index) => {
						if (item.status) {
							e.push(Object.assign(item, {
								mode: 'normal'
							}))
						}
					})
				} else {
					var e = [Object.assign(t.data.selectorData, {
						mode: 'normal'
					})]
				}

				this.image_root = t.data.image_root
				// #endif
				var o = 0
				for (var s = 0; s < e.length; s++) {
					o += e[s].price * e[s].num
				};
				this.show = true
				this.goodses = e
				this.productNum = this.getProductNum(e)
				this.allprice = o.toFixed(2)
				this.getTotalPrice()
			},
			getConfig: function() {
				let self = this
				self.$Phttp.post(Config.JAVA_SAAS_URLS.orderSetting, {}).then(res => {
					res = res.data
					if (res.code ===0) {
						self.config = Object.assign(self.config, res.data)
						if (self.config.devliery_home_switch === '0') {
							self.delivery_mode = 'self'
						}
						self.expectTime = Util.timestampToTime(self.config.devliery_day_setting)
						self.delivery_mode === 'home' ? self.devliery_cost = self.config.devliery_cost_setting: null
						self.getTotalPrice()
					}
				})
			},
			selectDeliveryPattern: function() {

			},
			getDefaultAddress: function() {
				let self = this
				let postData = {
					user_key : self.userInfo.user_key
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getSassDefaultAddress, postData).then(res => {
					res = res.data
					if (res.code === 0) {
						if (res.data === null) {
							self.is_choose_address = false
						} else {
							self.is_choose_address = true
							self.address = Object.assign(self.address, res.data)
						}
					}
				})
			},
			getProductNum: function(list) {
				var num = 0;
				for (var i = 0; i < list.length; i++) {
					num += list[i].num
				}
				return num
			},
			getTotalPrice: function() {
				this.actualPrice = (this.allprice - parseFloat(this.coupon.money) + parseFloat(this.devliery_cost)).toFixed(2)
				if (this.useBalance && this.userInfo.balance) {
					if (this.actualPrice > this.userInfo.balance) {
						this.actualPrice = ( this.actualPrice - this.userInfo.balance ).toFixed(2)
						this.useBalanceMoney = this.userInfo.balance
					} else {
						this.useBalanceMoney = this.actualPrice
						this.actualPrice = 0
					}
				} else {
					this.useBalanceMoney = 0
				}
			},
			adClick: function(goods_key) {
				uni.navigateTo({
					url: '/pages/index/product?goods_key='+goods_key
				})
			},
			create: function() {
			
				if (this.allprice === '0.00') {
					this.toast({
						type: 'warn',
						desc: '无法购买'
					})
					return
				}
				if (this.delivery_mode === 'home') {
					this.subOrder()
					return
				}
				this.showComfrimDialog = true
			},
			checkUserPhone: function() {
				// #ifdef APP-PLUS
				if (this.userInfo.tel === null || this.userInfo.tel === '') {
					uni.showModal({
						title: '提示',
						content: '检测到您尚未验证手机号码',
						showCancel: false,
						success: (res) => {
							if ( res.confirm ) {
								uni.navigateTo({
									url: '/pkUserInfo/info/phone'
								})
							}
						}
					})
				}
				// #endif
			},
			hideComfirmDialog: function() {
				this.showComfrimDialog = Object.assign(false)
			},
			hideDeliveryPlan: function() {
				this.showDeliveryPlan = false
			},
			subOrder: function() {
		
				let self = this
				if (self.isPayIng) return
				self.isPayIng = true
				setTimeout(()=>{
					self.isPayIng = false
				}, 1000)
				// if (self.userInfo.tel === null || self.userInfo.tel === '') {
				// 	self.checkUserPhone()
				// 	return
				// }
				if (self.delivery_mode === 'home') {
					if (!Util.containsKey(self.address, 'user_address_key')) {
						self.toast({
							desc: '请填写收获地址～',
							type: 'warn',
							time: 2000
						})
						return
					}
				}
				if (self.delivery_mode === 'self') {
					if (!Util.containsKey(self.address, 'user_address_key')) {
						self.toast({
							desc: '请填写收获地址～',
							type: 'warn',
							time: 2000
						})
						return
					}
					if (!Util.containsKey(self.delivery_store, 'user_key')) {
						self.toast({
							desc: '请选择自提点～',
							type: 'warn',
							time: 2000
						})
						return
					}
				}
				self.toast({
					desc: '正在生成订单...',
					type: 'loading',
					time: 8000
				})
				let goods_num = 0;
				self.goodses.forEach((good, index) => {
					goods_num += good.num
				})
				let data = {
					i:self.globalI,
					user_key: self.userInfo.user_key,
					token: self.userInfo.access_token,
					amount: self.allprice,
					coupon_money: self.coupon.money,
					usercoupon_id: self.coupon.id,
					pay_amount: self.actualPrice,
					goodses: JSON.stringify(self.goodses),
					// name: self.address.name,
					// mobile: self.address.mobile,
					name: self.userInfo.name,
					mobile: self.userInfo.tel,
					lng: self.address.lng,
					lat: self.address.lat,
					order_type: 1,
					user_address_key: self.address.user_address_key?self.address.user_address_key:0,
					delivery_money: self.devliery_cost,
					goods_num: goods_num,
					address: self.address.province+self.address.city+self.address.area+self.address.address,
					// payment_type:'mpwxpay',
					pay_type:0,
					user_origin: 'platform',
					pay_balance: self.useBalanceMoney,
					salesman_id: self.userInfo.bind_sales_key
				}
				if (self.delivery_mode === 'self') {
					data = Object.assign(data, {
						leader_key: self.delivery_store.user_key,
						order_type: 2
					})
				}
				if (self.delivery_mode === 'home') {
					data = Object.assign(data, {
						leader_key: 0
					})
				}
				// #ifdef APP-PLUS
				data = Object.assign(data, {
					payment_type: self.isWeixinPay?'wxapppay':'alipay',
					pay_type:self.isWeixinPay?1:2,
				})
				// #endif
				// #ifdef H5
				data = Object.assign(data, {
					openid: self.userInfo.h5openid,
					payment_type: 'wxjsapi',
					pay_type:3,
				})
				// #endif
				self.$Phttp.post(Config.JAVA_SAAS_URLS.addOrder, data).then((res) => {
					res = res.data
					if (res.code === 0) {
						self.toast(true)
						let payData = res.data.paydata
						let orderInfo = res.data.orderInfo

						if (res.data.state === 'paySuccess') {
							self.setUserInfo({
								balance: (self.userInfo.balance - data.pay_balance).toFixed(2)
							})
							uni.redirectTo({
								url: "/pages/order/paySuccess?id=" + orderInfo.id + "&orderNo=" + orderInfo.order_no + "&createTime=" + orderInfo.create_time + "&price=" + orderInfo.pay_amount
							})
						}

						// #ifdef APP-PLUS || H5
						orderInfo = Object.assign(orderInfo, {
							provider: self.isWeixinPay?'wxpay':'alipay'
						})
						// #endif
						self.pay(payData, orderInfo,
								(sucessInfo) => {
									self.isPayIng = false
									self.setisNewcomers(0)
									self.setUserInfo({
										balance: (self.userInfo.balance - data.pay_balance).toFixed(2)
									})
									uni.redirectTo({
										url: "/pages/order/paySuccess?order_key=" + orderInfo.order_key + "&orderNo=" + orderInfo.order_no + "&createTime=" + orderInfo.create_time + "&price=" + orderInfo.pay_amount
									})
								},
								(failInfo) => {
									self.isPayIng = false
									uni.redirectTo({
										url: "/pages/order/detail?order_key=" + orderInfo.order_key
									})
								}
						)
						var list = []
						var changList = []
						self.goodses.forEach(
								(item) => {
									item.id && list.push(item.id)
									item.id && changList.push(item)
								}
						)
						if (list.length) {
							let data = {
								i:self.globalI,
								cart_keys : list.length ? list.join(",") : list,
								user_key : self.userInfo.user_key
							}
							self.$Phttp.post(Config.JAVA_SAAS_URLS.delCart, data).then((info) => {
								self.setRefreshCart(true)
							})
							changList.forEach((item, index) => {
								self.addIndexRefresh({
									goods_key: item.goods_key,
									cart_num: 0
								})
								self.addCategoryRefresh({
									goods_key: item.goods_key,
									cart_num: 0
								})
							})
						}
						// #ifdef MP-WEIXIN
						// self.payWxApp(payData, orderInfo)
						// #endif
					}else{
						self.isPayIng = false
						self.errorData = Object.assign({
							show: true,
							desc: res.msg
						})
						self.toast(true)
					}
				})
			},
			// 错误隐藏
			errorHide: function (e) {
				if (!e.detail) {
					this.errorData.show = false;
					return
				}
				this.errorData = e.detail
			},
			openMap: function() {
				uni.openLocation({
					name: this.group.community,
					latitude: parseFloat(this.group.latitude),
					longitude: parseFloat(this.group.longitude),
					success: () => {
						console.log('open map.')
					}
				});
			},
			getPhoneNumber: function(detail) {
				let self = this
				self.toast({
					desc: '加载中...',
					type: 'loading',
					time: 8000
				})
				let data = {
					i:self.globalI,
					data: detail.encryptedData,
					iv: encodeURIComponent(detail.iv),
					key: self.userInfo.session_key
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.decryptTel, data).then((res) => {
					res = res.data
					if (res.code === 0) {
						self.setPhoneNumber(res.data.phoneNumber)
					}
				})
			},
			getDefaultLeader: function(isForce=false) {
				let self = this;
				let data =  {
					user_key: self.userInfo.user_key
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getDefaultLeader, data).then((res)=> {
					console.log(res)
					res = res.data
					self.delivery_store = Object.assign(self.delivery_store, res.data)
				})
			},
			setPhoneNumber: function(phoneNumber) {
				let self = this
				let data = {
					user_key: self.userInfo.user_key,
					token: self.userInfo.access_token,
					unionid: self.userInfo.unionid,
					tel: phoneNumber,
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.bindTelWithoutCode, data).then((res) => {
					self.toast(true)
					res = res.data
					self.setUserInfo(res.data)
				})
			},
			selectWeixinPay: function(isWeiXinPay) {
				this.isWeixinPay = isWeiXinPay
			},
			// 优惠券相关
			getCoupons: function() {
				if (this.couponLength === 0) {
					this.toast({
						type: 'warn',
						desc: '无优惠券可使用'
					})
					return
				}
				this.couponSelector = Object.assign({}, this.couponSelector, {
					show: true
				})
			},
			closeCouponSelector: function() {
				this.couponSelector = Object.assign({}, this.couponSelector, {
					show: false
				})
			},
			// 获取优惠券列表
			getCouponList: function() {
				let self = this
				let data = {
					i:self.globalI,
					user_key : self.userInfo.user_key,
					goodses : JSON.stringify(self.goodses),
					total_price : self.actualPrice
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.couponsInOrder, data).then((res) => {
					res = res.data
					if (res.code === 0) {
						console.log(res)
						self.couponLength = res.data.length
						self.coupons = res.data
					}
				})
			},
			getCouponById: function(coupon_id, index) {
				this.closeCouponSelector()
				this.coupon = Object.assign({}, this.coupon, {
					money: this.coupons[index].money,
					id: this.coupons[index].usercoupon_id
				})
				this.getTotalPrice()
			},
			// 优惠券相关
			switchDeliveryPlan: function(key) {
				this.deliveryKey = key
			},
			toDesignPlan: function(num, index) {
				this.showDeliveryPlan = true
				this.deliveryNum = num
				this.deliveryIndex = index
				this.deliveryPlan = Util.containsKey(this.goodses[index], 'plan')?this.goodses[index].plan:[]
				this.planMode = Util.containsKey(this.goodses[index], 'mode')?this.goodses[index].mode:'normal'
				this.deliveryKey = this.planMode
			},
			createPlan: function(plan) {
				let self = this
				// self.goodses[self.deliveryIndex] = Object.assign(self.goodses[self.deliveryIndex], {
				// 	plan: plan,
				// 	mode: self.deliveryKey
				// })
				self.deliveryPlan = plan
				self.planMode = self.deliveryKey
			},
			generatePlan: function() {
				let self = this
				console.log('generatePlan')
				self.goodses[self.deliveryIndex] = Object.assign(self.goodses[self.deliveryIndex], {
					plan: self.deliveryPlan,
					mode: self.deliveryKey
				})
				self.showDeliveryPlan = false
			},
			getPlanMode: function(mode) {
				if (mode === 'normal') return '普通配送'
				return '已生成配送计划'
			},
			toAddress: function() {
				uni.navigateTo({
					url: '/pages/order/address'
				})
			},
			modeSelf: function(store) {
				this.delivery_store = store
				this.delivery_mode = 'self'
				this.showPatternDialog = false
				this.devliery_cost = 0
				this.getTotalPrice()
			},
			modeHome: function() {
				this.delivery_mode = 'home'
				this.showPatternDialog = false
				this.devliery_cost = this.config.devliery_cost_setting
				this.getTotalPrice()
			},
			useBalanceChange: function (e) {
				var values = e.detail.value;
				if (values.includes("useBalance")) {
					this.useBalance = true
				} else {
					this.useBalance = false
				}
				this.getTotalPrice()
			}
		},
		onUnload() {
			let self = this
			console.log("onUnload")
			self.$cache.remove("plans_next")
			self.$cache.remove("plans_holiday")
			self.$cache.remove("plans_custom")
			self.$cache.remove("mode")
		},
		onShareAppMessage() {
			return {
				title: '友邻优选-大家都在用的社区团购APP',
				path: '/pages/index/main?user_key='+this.userInfo.user_key+'&i='+this.globalI
			}
		}
	}
</script>

<style>
	@import url("../../common/css/animation.css");
	page {
		background: #f6f6f6;
	}

	scroll-view {
		width: 100%;
		height: 100%;
		margin-bottom: 98rpx;
	}

	.info {
		width: calc(100% - 50rpx);
		padding: 50rpx 25rpx 25rpx 25rpx;
		background: #fff;
		display: flex;
		flex-direction: column;
	}

	.info .row {
		width: 100%;
		line-height: 50rpx;
		display: flex;
		font-size: 24rpx;
		color: #333;
		flex-wrap: wrap;
	}

	.info .row .name {
		width: 120rpx;
		height: 50rpx;
		line-height: 50rpx;
	}
	.address-container {
		display: flex;
		flex-direction: column;
		padding: 20upx 15upx;
		width: ;
	}
	.title {
		font-size: 34upx;
		font-weight: bold;
		margin-bottom: 10upx;
	}
	.tag {
		font-size: 24upx;
		min-width: 80upx;
		height: 38upx;
	}
	.address {
		color: #666;
		font-size: 26upx;
		margin-left: 20upx;
	}

	.info .row .content {
		width: calc(100% - 138rpx);
		margin-left: 18rpx;
	}

	.info .row .content image{
		width: 30rpx;
		height: 30rpx;
		margin-left: 10rpx;
		margin-bottom: -6rpx;
	}

	.line {
		width: 100%;
		height: 4rpx;
		margin: 0;
		display: block;
	}
	.to-address {
		position: absolute;
		font-size: 28upx;
		font-weight: bold;
		color: black;
		right: 40upx;
		margin-top: 50upx;
	}

	.items {
		width: calc(100% - 48rpx);
		padding-left: 24rpx;
		padding-right: 24rpx;
		margin-top: 30rpx;
		display: flex;
		flex-direction: column;
	}

	.items .item {
		width: 100%;
		background: #fff;
		border-radius: 15rpx;
		display: flex;
		flex-direction: column;
	}

	.items .item .top {
		width: calc(100% - 60rpx);
		height: 76rpx;
		line-height: 76rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
		font-size: 24rpx;
		color: #888;
		display: flex;
		align-items: center;
		border-bottom: solid 1rpx #eee;
	}

	.items .item .top .num {
		margin-left: auto;
	}

	.items .item .content {
		width: calc(100% - 60rpx);
		padding: 30rpx;
	}

	.items .item .content image {
		width: 160rpx;
		height: 160rpx;
		border-radius: 10rpx;
		float: left;
	}

	.items .item .content .title {
		width: calc(100% - 190rpx);
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-left: 30rpx;
		float: left;
	}

	.items .item .content .descs {
		width: calc(100% - 190rpx);
		margin-left: 30rpx;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 22rpx;
		color: #333;
		font-weight: 500;
		display: flex;
		float: left;
	}

	.items .item .content .desc {
		margin-right: 30rpx;
	}

	.items .item .content .bottom {
		width: calc(100% - 190rpx);
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
		margin-left: 30rpx;
		float: left;
		margin-top: 10rpx;
	}

	.pays {
		width: calc(100% - 48rpx);
		margin-left: 24rpx;
		margin-right: 24rpx;
		margin-top: 30rpx;
		display: flex;
		flex-direction: column;
		background: #fff;
		border-radius: 20rpx;
	}

	.pays .top {
		width: calc(100% - 60rpx);
		height: 76rpx;
		line-height: 76rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
		font-size: 24rpx;
		color: #888;
		display: flex;
		align-items: center;
		border-bottom: solid 1rpx #eee;
	}

	.pays .item{
		width: calc(100% - 68rpx);
		height: 110rpx;
		padding-left: 15rpx;
		padding-right: 15rpx;
		margin-left: 15rpx;
		margin-right: 15rpx;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		display: flex;
		align-items: center;
	}

	.pays .item-circle-border {
		border: dashed #08c00d 4rpx;
		border-radius: 20rpx;
	}

	.pays .item image{
		width: 60rpx;
		height: 60rpx;
	}

	.pays .item .centet{
		display: flex;
		flex-direction: column;
		margin-left: 20rpx;
	}

	.pays .item .centet .name{
		font-size: 28rpx;
		color: #333;
	}

	.pays .item .centet .desc{
		font-size: 20rpx;
		color: #999;
		margin-top: 5rpx;
	}

	.myCheckBox {
		margin-left: auto;
		transform: scale(0.8,0.8);
	}

	.bottom-tools {
		width: 100%;
		height: 98rpx;
		background: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.bottom-tools .buy {
		float: right;
		width: 250rpx;
		height: 98rpx;
		line-height: 98rpx;
		text-align: center;
		background: #e84118;
		font-size: 28rpx;
		font-weight: bold;
		color: #fff;
		margin-left: auto;
	}

	button {
		border-radius: 0upx;
	}

	.bottom-tools .left {
		height: 98upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		float: left;
		margin-left: 30rpx;
	}

	.bottom-tools .left .all-price {
		font-size: 20rpx;
		font-weight: bold;
		color: #333;
	}

	.bottom-tools .left .all-price .price {
		font-size: 28rpx;
		font-weight: bold;
		color: #f76260;
	}

	.bottom-tools .left .desc {
		font-size: 18rpx;
		font-weight: 400;
		color: #888;
		margin-top: 5rpx;
	}

	.ad-box{
		width: 100%;
		height: 120rpx;
	}

	.ad-box .ad{
		width: 100%;
		height: 100%;
	}

	.mask {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: #000;
		opacity: 0.2;
		overflow: hidden;
		z-index: 98;
		color: #fff;
	}

	.confirm-dialog {
		width: 100%;
		/* height: 670rpx; */
		background: #f6f6f6;
		border-radius: 20px 20px 0px 0px;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 99;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.confirm-dialog .notice {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		margin-top: 40rpx;
	}

	.confirm-dialog .expect {
		font-size: 24rpx;
		font-weight: bold;
		color: #08c00d;
		margin-top: 15rpx;
	}

	.confirm-dialog .order-info {
		width: calc(100% - 48rpx);
		margin-left: 24rpx;
		margin-right: 24rpx;
		padding-top: 30rpx;
		background: #fff;
		border-radius: 20rpx;
		margin-top: 25rpx;
	}

	.confirm-dialog .order-info .row {
		width: calc(100% - 60rpx);
		margin-left: 30rpx;
		margin-right: 30rpx;
		line-height: 40rpx;
		display: flex;
		font-size: 24rpx;
		color: #333;
		flex-wrap: wrap;
	}

	.confirm-dialog .order-info .row .name {
		width: 190rpx;
		height: 40rpx;
		line-height: 40rpx;
	}

	.confirm-dialog .order-info .row .content {
		width: calc(100% - 222rpx);
		padding-left: 30rpx;
		border-left: solid 1rpx #f6f6f6;
	}

	.confirm-dialog .order-info .bottom {
		width: 100%;
		height: 74rpx;
		line-height: 74rpx;
		border-top: solid 1rpx #f6f6f6;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		font-size: 24rpx;
		font-weight: bold;
		color: #333;
		margin-top: 20rpx;
	}

	.confirm-dialog .order-info .bottom .price {
		font-size: 28rpx;
		font-weight: bold;
		color: #f76260;
		margin-right: 30rpx;
	}

	.confirm-dialog .buttons {
		width: 100%;
		height: 98rpx;
		display: flex;
		background: #fff;
		margin-top: 20rpx;
	}

	.confirm-dialog .buttons .button {
		width: 50%;
		height: 98rpx;
		line-height: 98rpx;
		text-align: center;
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}

	.confirm-dialog .buttons .button.pay {
		background: #e84118;
		color: #fff;
	}

	.isLoginBtn {
		display: flex;
		justify-content: space-around;
	}

	.isLoginBtn button, .isLoginBtn navigator {
		background: #fff;
		height: 68rpx;
		line-height: 68rpx;
		font-size: 28rpx;
		width: 260rpx;
		text-align: center;
		color: #4bad37;
		border: 1rpx solid #eee;
		border-radius: 12rpx;
	}

	.isLoginBtn navigator {
		margin-right: 20rpx;
		background: #f2f2f2;
		color: #999;
	}
	.tip0 {
		font-size: 38upx;
		font-weight: bold;
		color: #1dc422;
		margin-left: 20upx;
	}
	.tip1 {
		font-size: 28upx;
		color: #333;
		margin-left: 20upx;
		margin-right: 20upx;
	}
</style>
