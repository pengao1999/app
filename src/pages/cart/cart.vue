<template>
	<view class='container'>
	  <view class='no-data' v-if="cart.length<1">
		<image class='bg' :lazy-load="true" src='/static/tabbar/cart.png'></image>
		<text class='desc'>购物车空空如也，赶紧去购物吧~</text>
		<text class='to-buy' @tap='toBuy'>去购物</text>
	  </view>

	  <scroll-view scroll-y="true" class='items' v-else>
		<block v-for="(item,index) in cart" :key="index">
		  <view class='item'>
			<checkbox :checked="item.status" @tap.stop="selectGood(index)" class="round" style="flex-shrink: 0; zoom: 0.8;" />
			<image class='image' :lazy-load="true" :src='image_root+item.pic'></image>
			<view class="content">
				<text class='title'>{{item.name}}</text>
				<text class='desc' v-if="item.desc">规格：{{item.attr_names}}</text>
				<view class='bottom'>
				  <text class='price'>￥{{item.integerPrice}}</text>
				  <text class='sub-price'>.</text>
				  <text class='sub-price' style="margin-right: auto;">{{item.decimalPrice}}</text>
				  <view class='num-box'>
					<image class='reduce' :lazy-load="true" src='/static/ic_reduce.png' @tap.stop="reducePlat(item, index)"></image>
					<text class='num'>{{item.num}}</text>
					<image class='add' :lazy-load="true" src='/static/ic_add.png' @tap.stop="addPlat(item, index)"></image>
				  </view>
				</view>
			</view>
			<image class='delete' :lazy-load="true" @tap.stop="deleCarts(item.cart_key, index)" src='/static/ic_delete.png'></image>
		  </view>
		</block>
	  </scroll-view>
	  <view class='ad-box' v-if="banner">
		<image class='ad' :lazy-load="true" :src='image_root+banner.pic' @tap='adClick'></image>
	  </view>
	  <view style="height: 100upx;"></view>
	  <view class='bottom-bar' v-if="cart.length>0">
		<view class='check-all' @tap="getAllGoods">
		  <checkbox :checked="check.checkAll" class="round" style="flex-shrink: 0; zoom: 0.8;" />
		  <text>全部</text>
		</view>
		<view class='center'>
		  <view class='all-price'>
			<text>总计：</text>
			<text class='price'>￥{{totalPrice}}</text>
		  </view>
		  <view class='desc'>总额：￥{{totalPrice}} 优惠￥0.00</view>
		</view>
		<button class='to-buy' @click="submitOrder">去结算</button>
	  </view>
	</view>
</template>

<script>
	import Config from '../../common/js/Config.js'
	import Toast from '../../common/js/toast.js'
	import Util from '../../common/js/util.js'
	import Auth from '../auth.js'
	import Cart from '../cartsResfresh.js'

	import {mapMutations} from 'vuex'
	export default {
		data() {
			return{
				cart: [],
				banner: {},
				totalPrice: 0,
				image_root: '',
				check: {
					checkAll: true
				},
				goodses: [],
				canBuy: true
			}
		},
		mixins: [Toast, Auth, Cart],
		watch: {
			cart: {
				handler() {
					if (this.cart.length > 0) {
						this.getTotal()
					}
				},
				immediate: true
			},
			userInfo: {
				handler() {
					if (this.userInfo !== undefined && this.group !== undefined) {
						this.getCart()
					}
				},
				immediate: true
			},
			group: {
				handler() {
					if (this.userInfo !== undefined && this.group !== undefined) {
						this.getCart()
					}
				},
				immediate: true
			},
			ads: {
				handler() {
					if (this.ads !== undefined) {
						this.getBanner()
					}
				},
				immediate: true
			},
			globalI: {
				handler() {
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
			refreshCart() {
				return this.$store.state.refreshCart
			},
			globalI() {
				return this.$store.state.globalI
			},
			acts() {
				return this.$store.state.acts
			}

		},
		onLoad() {
			if (!this.checkLogin()) return //判断是否登录
		},
		onShow() {
			this.goodses = []
			if (!this.hasRegister())  return
			this.getCart()
			if (this.refreshCart) {
				this.setRefreshCart(false)
				this.resfreshCartNum(this.userInfo.user_key, (res)=>{})
				this.getCart()
			}
		},
		methods:{
			...mapMutations(['setRefreshCart', 'addIndexRefresh', 'addCategoryRefresh']),
			getCart: function() {
				let self = this
				if (!Util.containsKey(self.userInfo, 'user_key')) return
				self.toast({
					type: 'loading',
					desc: '加载中...',
					time: 8000
				})
				let data = {
					i:self.globalI,
					user_key: self.userInfo.user_key,
					is_super_plat: true
					// leader_key: self.group.leader_key
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getCarts, data).then((res) => {
					self.toast(true)
					res = res.data
					console.log(res)
					res.data.forEach((item, idx) => {
						var price = res.data[idx].price
						var priceArr = price.toFixed(2).split('.')
						res.data[idx].integerPrice = priceArr[0]
						var decimalPrice = '00'
						if (priceArr[1]) {
						  res.data[idx].decimalPrice = priceArr[1]
						}

						item = Object.assign({}, item, {
							user_key: self.userInfo.user_key
						})
					})
					self.cart = res.data
					self.image_root = res.other.img_root
					self.setGoodsState()
				})
			},
			setGoodsState: function() {
				let self = this
				self.check.checkAll = true
				self.cart.forEach((item, idx) => {
					self.cart[idx].status = self.check.checkAll
				})
				self.getTotal()
			},
			getBanner: function() {
				this.banner = this.ads.cartBanner
			},
			getTotal: function(t) {
				let self = this
				var a = self.cart, e = 0;
				a.forEach(function(t, a) {
				  t.status && (e += parseFloat(t.price * t.num));
				})
				self.totalPrice = e.toFixed(2)
			},
			isActivityStart: function() {
				let self = this
				let begin_time = self.acts.begin_time
				if ((new Date()).getTime() < begin_time) {
					self.toast({
						type: 'warn',
						desc: '活动未开始'
					})
					return false
				}
				return true
			},
			submitOrder: function() {
				let self = this
				try{
					if (!self.isActivityStart()) return
				}catch(e){
					//TODO handle the exception
				}

				self.toast({
					desc: '正在生成订单...'
				})
				setTimeout(()=>{
					self.toast(true)
					uni.navigateTo({
						url : '/pages/order/create?way=1'
					})
				}, 200)
			},
			selectGood: function(idx) {
				this.check.checkAll = false
				this.cart[idx].status = !this.cart[idx].status
				this.getTotal()
			},
			getAllGoods: function() {
				let self = this
				self.check.checkAll = !self.check.checkAll
				self.cart.forEach((item, idx) => {
					self.cart[idx].status = self.check.checkAll
				})
				self.getTotal()
			},
			adClick: function() {
				uni.navigateTo({
					url: '/pages/index/product?goods_key='+this.banner.param
				})
			},
			reducePlat: function(item, idx) {
				let self = this
				self.updateCart(item, self.cart[idx].num-1, idx, -1)
			},
			updateCart: function(item, num, idx, type) {
				let self = this
				self.toast({
					type: 'loading',
					desc: '处理中...'
				})
				let data = {
					i:self.globalI,
					user_key: self.userInfo.user_key,
					token: self.userInfo.access_token,
					cart_key: item.cart_key,
					num: num
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.updateCart, data).then((res) => {
						self.toast(true)
						res = res.data
						if (res.code === 0) {
							if (num === 0) {
								self.toast({
									type: 'success',
									desc: '删除成功'
								})
								if (item.attr_names === "") {
									self.addIndexRefresh({
										 goods_key: item.goods_key,
										 cart_num: 0
									 })
									 self.addCategoryRefresh({
										 goods_key: item.goods_key,
										 cart_num: 0
									 })
								} else {
									self.addIndexRefresh({
										 multi: true,
										 goods_key: item.goods_key,
										 cart_num: type
									 })
									 self.addCategoryRefresh({
										 multi: true,
										 goods_key: item.goods_key,
										 cart_num: type
									 })
								}

								self.cart.splice(idx, 1)
							} else {
								self.cart[idx].num = num
								if (item.attr_names === "") {
									self.addIndexRefresh({
										 goods_key: item.goods_key,
										 cart_num: num
									 })
									self.addCategoryRefresh({
										 goods_key: item.goods_key,
										 cart_num: num
									})
								} else {
									self.addIndexRefresh({
										 multi: true,
										 goods_key: item.goods_key,
										 cart_num: type
									 })
									 self.addCategoryRefresh({
										 multi: true,
										 goods_key: item.goods_key,
										 cart_num: type
									 })
								}
								for (var i=0 ; i< 3; i++) {
									setTimeout(()=>{
										self.cart[idx].num = num
									}, 100)
								}
							}
							self.getTotal()
						} else {
							self.toast({
								type: 'warn',
								desc: '库存不足'
							})
						}
						self.resfreshCartNum(this.userInfo.user_key, (res)=>{})
					})
			},
			addPlat: function(item, idx) {
				let self = this
				self.updateCart(item, self.cart[idx].num+1, idx, 1)
			},
			toBuy: function() {
				uni.switchTab({
					url: '/pages/index/main'
				})
			},
			deleCarts: function(cart_key, idx) {
				let self = this
				uni.showModal({
					confirmColor: "#1dc422",
					title: '提示',
					content: '确认取消该商品吗',
					success: (res) => {
						if ( res.confirm ) {
							self.toast({
								type: 'loading',
								desc: '删除中...'
							})
							let data = {
								i:self.globalI,
								user_key: self.userInfo.user_key,
								token: self.userInfo.access_token,
								cart_keys: cart_key
							}
							self.$Phttp.post(Config.JAVA_SAAS_URLS.delCart, data).then((res) => {
									self.toast(true)
									res = res.data
									if (res.code === 0) {
										self.toast({
											type: 'success',
											desc: '删除成功'
										})
										if ( self.cart[idx].attr_names === "") {
											self.addIndexRefresh({
												 goods_key: self.cart[idx].goods_key,
												 cart_num: 0
											 })
											self.addCategoryRefresh({
												 goods_key: self.cart[idx].goods_key,
												 cart_num: 0
											})
										} else {
											self.addIndexRefresh({
												 multi: true,
												 goods_key: self.cart[idx].goods_key,
												 cart_num: -self.cart[idx].num
											 })
											self.addCategoryRefresh({
												 multi: true,
												 goods_key: self.cart[idx].goods_key,
												 cart_num: -self.cart[idx].num
											})
										}

										self.cart.splice(idx, 1)
										self.resfreshCartNum(self.userInfo.user_key, (res)=>{})
										for (var i=0; i<3; i++) {
											setTimeout(()=>{
												self.cart = Object.assign([], self.cart)
											}, 100)
										}
									}
								})
						}
						self.resfreshCartNum(this.userInfo.user_key, (res)=>{})
					},
					fail: (res) => {

					}
				})
			}
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
	page{
	  width: 100%;
	  height: 100%;
	  overflow: hidden;
	}
	.container{
	  width: 100%;
	  height: 100%;
	  display: flex;
	  flex-direction:column;
	}

	.no-data {
	  width: 100%;
	  height: 100%;
	  background: #fff;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  flex: 1;
	}

	.no-data .bg {
	  width: 250rpx;
	  height: 250rpx;
	  margin-top: 200rpx;
	}

	.no-data .desc {
	  font-size: 28rpx;
	  color: #AAAAAA;
	}

	.no-data .to-buy {
	  width: 240rpx;
	  height: 60rpx;
	  line-height: 60rpx;
	  background: #f65959;
	  border-radius: 30rpx;
	  text-align: center;
	  font-size: 28rpx;
	  color: #fff;
	  margin-top: 60rpx;
	  font-weight:bold;
	}

	.items {
	  width: 100%;
	  display: flex;
	  flex-direction: column;
	  flex: 1;
	}

	.items .item {
		display: flex;
	  width: calc(100% - 40rpx);
	  height: 160rpx;
	  padding: 20rpx;
	  background: #fff;
	  position: relative;
	  align-items: center;
	}

	/* checkbox {
	  width: 50rpx;
	  height: 50rpx;
	} */

	checkbox{
	  /* border-radius: 50%; */
	}

	.items .item .image {
	  width: 150rpx;
	  height: 150rpx;
	  margin-left: 20rpx;
	  background: #efefef;
	}

	.items .item .content{
		width: calc(100% - 240rpx);
		height: 150rpx;
		margin-left: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.items .item .title {
	  width: calc(100% - 40rpx);
	  height: 50rpx;
	  line-height: 50rpx;
	  font-size: 32rpx;
	  margin-right: 40rpx;
	  color: #333;
	  font-weight: bold;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  white-space: nowrap;
	}

	.items .item .desc {
	  width: 100%;
	  height: 40rpx;
	  line-height: 40rpx;
	  font-size: 26rpx;
	  color: #888888;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  white-space: nowrap;
	}

	.items .item .delete {
	  width: 36rpx;
	  height: 36rpx;
	  position: absolute;
	  top: 15rpx;
	  right: 15rpx;
	  padding: 10rpx;
	}

	.items .item .bottom {
	  width: 100%;
	  display: flex;
	  justify-content: space-between;
	  align-items: flex-end;
	}

	.items .item .bottom .price {
	  font-size: 36rpx;
	  line-height: 36rpx;
	  color: #f65959;
	  font-weight: bold;
	}

	.items .item .bottom .sub-price {
	  font-size: 18rpx;
	  line-height: 20rpx;
	  color: #e84118;
	  font-weight: bold;
	}

	.items .item .bottom .num-box {

	}

	.items .item .bottom .num-box .reduce, .items .item .bottom .num-box .add {
	  width: 40rpx;
	  height: 40rpx;
	  float: left;
	}

	.items .item .bottom .num-box .num {
	  width: 60rpx;
	  height: 40rpx;
	  text-align: center;
	  line-height: 40rpx;
	  font-size: 20rpx;
	  color: #333;
	  float: left;
	}

	.bottom-bar {
	  width: 100%;
	  height: 100rpx;
	  border-top: solid 1rpx #ccc;
	  background: #fff;
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	  position: fixed;
	  bottom: 0;
	}

	.bottom-bar .check-all {
	  width: 160rpx;
	  height: 100%;
	  display: flex;
	  margin-left: 30rpx;
	  align-items: center;
	}

	.bottom-bar .check-all text {
	  line-height: 40rpx;
	  font-size: 28rpx;
	  color: #333;
	  margin-left: 30rpx;
	  font-weight: 500;
	}

	.bottom-bar .center {
	  height: 100rpx;
	  width: calc(100% - 380rpx);
	  display: flex;
	  flex-direction: column;
	}

	.bottom-bar .center .all-price {
	  display: flex;
	  justify-content: flex-end;
	  font-size: 20rpx;
	  color: #333;
	  font-weight: bold;
	  margin-top: 15rpx;
	  align-items: center;
	}

	.bottom-bar .center .all-price .price {
	  font-size: 28rpx;
	  color: #E84118;
	  font-weight: bold;
	}

	.bottom-bar .center .desc {
	  font-size: 18rpx;
	  color: #888;
	  text-align: right;
	  font-weight: 400;
	}

	.bottom-bar .to-buy {
	  width: 180rpx;
	  height: 60rpx;
	  line-height: 60rpx;
	  background: #E84118;
	  border-radius: 30rpx;
	  text-align: center;
	  font-size: 28rpx;
	  margin-right: 30rpx;
	  margin-left: 30rpx;
	  font-weight: 500;
	  color: #fff;
	}

	.ad-box{
	  width: 100%;
	  height: 120rpx;
	}

	.ad-box .ad{
	  width: 100%;
	  height: 100%;
	}

</style>
