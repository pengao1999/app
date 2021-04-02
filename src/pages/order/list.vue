<template>
	<view :style="'height:'+winHeight+'px;width:100%'">
		<view class="swiper-tab">
		  <view v-for="(item, index) in nav" :key="index" :class="{'swiper-tab-item':true,'active':curIndex===item.status}" @tap="clickTab(item.status)">{{item.title}}</view>
		</view>
		<swiper :current="curIndex" :duration="50" @change="swiperTab">
		  <!-- 全部 -->
		  <swiper-item v-for="(item,index) in nav" :key="index" v-if="showSwiper">
			<view class="no-data" v-if="olist[index]=== undefined || olist[index].length===0">
			  <image src="../../static/empty.png" class="no-data-img"></image>
			  <view class="text">暂无订单</view>
			</view>
			<scroll-view scroll-y="true" :style="'height:'+winHeight+'px;'" upper-threshold="50" @scrolltolower="getOrders(curIndex, curPage[curIndex], false)" v-else>
				<view class='items'>
					<view class='item' v-for="(order, idx) in olist[index]" :key="idx" @tap="toDeatil(order.order_key)">
					  <view class='top'>
						<text class='time'>下单时间：{{formatTime(order.create_time)}}</text>
						<view class='status red' v-if="order.state=='unPay'&order.expire_time>nowTime">{{statusName(order.state)}}</view>
						<view class='status gray' v-if="order.state=='unPay'&order.expire_time<=nowTime">订单超时</view>
						<view class='status gold' v-if="order.state=='paySuccess'">待配送</view>
						<view class='status gold' v-if="order.state=='sending'">配送中</view>
						<view class='status gold' v-if="order.state=='arrive'">待签收</view>
						<view class='status green' v-if="order.state=='completed'">已完成</view>
						<view class='status gray' v-if="order.state=='cancel'">已取消</view>
						  <view class='status gray' v-if="order.state=='td'">已退订</view>
						<!-- <view class='status gray' v-if="order.state==7">处理中</view> -->
						<!-- <view class='status gray' v-if="order.state==8">已退款</view> -->
					  </view>
					  <view class='content'>
						<block v-for="(goods, gIndex) in order.ordergoodses" :key="gIndex">
						  <view class='s-product' v-if="order.ordergoodses!==undefined && order.ordergoodses.length===1">
							<image :src='image_root + goods.pic' lazy-load="true"></image>
							<text class='title'>{{goods.goods_name}}</text>
							<view class='descs'>
							  <text class='desc'>数量：{{goods.num}}</text>
							  <text class='desc' v-if="goods.attr_names">规格：{{goods.attr_names}}</text>
							</view>
							<view class='price'>￥{{goods.price}}</view>
						  </view>
						  <image class='product' :src='image_root + goods.pic' v-else-if="gIndex<4" lazy-load="true"></image>
						</block>
						<text class='more' v-if="order.ordergoodses!==undefined &&order.ordergoodses.length>4">...</text>
					  </view>
					  <view class='bottom'>
						<text>共{{order.num}}件商品 实付：</text>
						<text class='price'>￥{{order.pay_amount}}</text>
						<view class='cancel' @tap.stop="cancelOrder(idx)" v-if="order.state=='unPay'&order.expire_time>nowTime">取消</view>
<!--						<view class='comment' @tap.stop="toComment(idx)" v-if="order.state=='completed'">去评价</view>-->
						<!-- <view class='refund' @tap.stop="userCancelOrder(idx)" v-if="order.state==2">取消订单</view> -->
						<!-- <view class='refund' @tap.stop="refundOrder(order, idx)" v-if="order.state==2|order.state==3|order.state==4|order.state==5">申请退款</view> -->
						 <view class='refund' @tap.stop="takeDelivery(idx)" v-if="order.state=='arrive'">确认提货</view>
						<!-- #ifdef MP-WEIXIN -->
						<view class='pay' @tap.stop="payNow(idx)" v-if="order.state=='unPay'&order.expire_time>nowTime">立即支付</view>
						<!-- #endif -->
						<!-- #ifdef APP-PLUS || H5 -->
						<view class='pay' @tap.stop="payNow(idx)" v-if="order.state=='unPay'&order.expire_time>nowTime">立即支付</view>
						<!-- #endif -->
						<view class='delete' @tap.stop="deleteOrder(idx)" v-if="order.state=='completed'|order.state=='cancel'|(order.state=='unPay'&order.expire_time<=nowTime)">删除</view>
					  </view>
					</view>
					<uni-load-more :loadingType="loadingType" :contentText="contentText"></uni-load-more>
					<view style="height: 150upx;"></view>
				</view>
			</scroll-view>
		  </swiper-item>
		</swiper>
		<pay-dialog :show="showPayDialog" @selectWeixinPay="selectWeixinPay" @close="closePayDialog"></pay-dialog>
	</view>
</template>

<script>
	import Config from '../../common/js/Config.js'
	import Util from '../../common/js/util.js'
	import Toast from '../../common/js/toast.js'
	import Pay from '../../common/js/pay.js'
	import StatusFilter from '../../common/js/StatusFilter'

	import UniLoadMore from '../../components/uni-load-more.vue'
	import PayDialog from '../../components/yx_dialog/myPayDialog.vue'
	export default {
		data() {
			return {
				order_key: '',
				isLoading: false,
				shouldReload: false, //再次进入时，是否需要刷新
				leader_key: -1,
				nav: [{
				  title: "全部",
				  status: 0
				}, {
				  title: "待付款",
				  status: 1
				}, {
				  title: "待配送",
				  status: 2
				}, {
				  title: "配送中",
				  status: 3
				}, {
				  title: "待提货",
				  status: 4
				}, {
				  title: "已完成",
				  status: 5
				}],
				olist: [[],[],[],[],[],[]],
				curPage: [1,1,1,1,1,1],
				curIndex: 0,
				image_root: '',
				winHeight: 0,
				systemInfo: {},
				showSwiper: true,
				loadingType: 1,
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				},
				nowTime: 0,
				showPayDialog: false,
				isWeiXinPay: true
			}
		},
		mixins:[Toast, Pay],
		components: {UniLoadMore, PayDialog},
		watch: {
			userInfo: {
				handler() {

				},
				immediate: true
			},
			systemInfo: {
				handler() {
					if (!Util.isEmptyObject(this.systemInfo)) {
						this.winHeight = this.systemInfo.windowHeight
					}
				},
				immediate: true
			}
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			},
			globalI() {
				return this.$store.state.globalI
			}
		},
		onLoad(options) {
			if (Util.isEmptyObject(options)) {
				options = {
					status: 0
				}
			}
			this.nowTime = (new Date()).getTime()/1000
			// this.curIndex = parseInt(options.status)
			this.initPage(options)
		},
		onShow() {
			if (this.shouldReload) {
				this.reloadCurrentPage()
			}
		},
		onShareAppMessage() {
			return {
				title: '友邻优选-大家都在用的社区团购APP',
				path: '/pages/index/main?user_key='+this.userInfo.user_key+'&i='+this.globalI
			}
		},
		methods: {
			initPage: function(options) {
				let self = this

				self.leader_key = options.leader_key //提货点后台
				self.clickTab(options.status)
				uni.getSystemInfo({
					success(system) {
						if (system.errMsg === "getSystemInfo:ok") {
							self.systemInfo = system
						}
					}
				})
			},
			getPageIndex: function(status) {
				switch (status) {
					case "" :
						return 0;
					case 'unPay':
						return 1;
					case 'paySuccess':
						return 2;
					case 'sending':
						return 3;
					case 'arrive':
						return 4;
					case 'completed':
						return 5;
					case 'cancel':
						return 6;
				}
			},
			getOrders: function(status, page, showSwiper) {
				let self = this
				if (self.isLoading) return
				self.isLoading = true
				var page = self.getPageIndex(status)
				if (self.curPage[page] === -1) {
					self.loadingType = 2
					return
				}
				self.loadingType = 1
				if (showSwiper) {
					// self.showSwiper = false
					self.toast({
						type: 'loading',
						desc: '加载中...'
					})
				}
				let data = {
					i:self.globalI,
					user_key: self.userInfo.user_key,
					token: self.userInfo.access_token,
					page: self.curPage[page],
					limit: Config.PAGE_LIMIT,
					state: status
				}

				self.$Phttp.post(Config.JAVA_SAAS_URLS.orderList, data).then((res) => {
					self.toast(true)
					self.isLoading = false
					res = res.data
					if (res.code === 0) {
						if (res.data.length !== 0) {
							self.curPage[page]++
						} else {
							self.curPage[page] = -1
							self.showSwiper = true
							return
						}

						self.image_root = res.other.img_root
						var list = res.data
						list.forEach((item, index) => {
							list[index].num = this.getProductNum(item.ordergoodses)
						})

						if (list.length < Config.PAGE_LIMIT) {
							self.loadingType = 2
						} else {
							self.loadingType = 1
						}

						let orders = self.olist
						orders[page] = orders[page].concat(list)
						self.olist = Object.assign({}, orders)
						//fanxiaojiao 03-21 订单偶尔刷新不出,优化多次加载
						for (var i = 0; i < 4; i++) {
								setTimeout(()=>{
									// self.showSwiper = true
									self.olist = Object.assign({}, orders)
								}, 200)
						}
						//fanxiaojiao 03-21 订单偶尔刷新不出,优化多次加载
					}
					self.showSwiper = true
				})
			},
			swiperTab: function(e) {

				this.clickTab(e.detail.current)
			},
			clickTab: function(curIndex) {
				curIndex = parseInt(curIndex)
				this.curIndex = curIndex
				if (this.olist[curIndex].length === 0 && this.curPage[curIndex] === 1) {
					var status = ""
					switch (curIndex) {
						case 0 :
							break;
						case 1 :
							status = "unPay"
							break
						case 2 :
							status = "paySuccess"
							break
						case 3 :
							status = "sending"
							break
						case 4 :
							status = "arrive"
							break
						case 5 :
							status = "completed"
							break
					}
					this.getOrders(status, this.curPage[curIndex], true)
				}
			},
			getProductNum: function(list) {
			  var num = 0;
			  for (var i = 0; i < list.length; i++) {
				num += list[i].num
			  }
			  return num
			},
			deleteOrder: function(idx) {
				let self = this
				let order  = self.olist[self.curIndex][idx]
				uni.showModal({
					title: '提示',
					content: '确定删除该订单吗？',
					confirmColor: '#1dc422',
					success: (res) => {
						if ( res.confirm ) {
							let data = {
								i:self.globalI,
								user_key: self.userInfo.user_key,
								token: self.userInfo.access_token,
								order_key: order.order_key
							}
							self.toast({
								desc: '处理中...',
								type: 'loading',
								time: 8000
							})
							self.$Phttp.post(Config.JAVA_SAAS_URLS.delOrder, data).then((res) => {
								res = res.data
								if (res.code === 0) {
									self.olist[self.curIndex].splice(idx, 1)
									self.toast({
										type: 'success',
										desc: '删除成功',
										time: 1000
									})
								}
							})
						}
					}
				})
			},
			formatTime(nS) {
				return Util.formatTime(nS);
			},
			cancelOrder: function(idx) {
				let self = this
				let order = self.olist[self.curIndex][idx]
				uni.showModal({
					title: '提示',
					content: '确定取消该订单吗？',
					confirmColor: '#1dc422',
					success: (res) => {
						if ( res.confirm ) {
							let data = {
								i:self.globalI,
								user_key: self.userInfo.user_key,
								token: self.userInfo.access_token,
								order_key: order.order_key
							}
							self.toast({
								desc: '处理中...',
								type: 'loading',
								time: 8000
							})
							self.$Phttp.post(Config.JAVA_SAAS_URLS.cancelOrder, data).then((res) => {
								res = res.data
								if (res.code === 0) {
									self.olist[self.curIndex][idx].state = 'cancel'
									self.toast({
										type: 'success',
										desc: '取消成功'
									})
								}
							})
						}
					}
				})
			},
			takeDelivery: function(idx) {
				let self = this
				let order = self.olist[self.curIndex][idx]
				uni.showModal({
					title: '提示',
					content: '确认已收到货吗？',
					confirmColor: '#1dc422',
					success: (res) => {
						if ( res.confirm ) {
							let data = {
								i:self.globalI,
								user_key: self.userInfo.user_key,
								token: self.userInfo.access_token,
								order_key: order.order_key,
								type:'list'
							}
							self.toast({
								desc: '处理中...',
								type: 'loading',
								time: 8000
							})
							self.$Phttp.post(Config.JAVA_SAAS_URLS.confirmUserGoods, data).then((res) => {
								res = res.data
								if (res.code === 0) {
									self.olist[self.curIndex][idx].state = 'completed'
									self.toast({
										type: 'success',
										desc: '收货成功'
									})
								}
							})
						}
					}
				})
			},
			refundOrder: function(order, idx) {
				let self = this
				uni.showModal({
					title: '提示',
					content: '确定要申请退款吗？',
					confirmColor: '#1dc422',
					success: (res) => {
						if ( res.confirm ) {
							let data = {
								i:self.globalI,
								user_key: self.userInfo.user_key,
								token: self.userInfo.access_token,
								order_key: order.order_key,
								// leader_key :userInfo.leader_key //提货点id
							}
							self.toast({
								desc: '处理中...',
								type: 'loading',
								time: 8000
							})
							self.$Phttp.post(Config.JAVA_SAAS_URLS.refundOrder, data).then((res) => {
								res = res.data
								if (res.code === 0) {
									self.olist[self.curIndex][idx].state = 'cancel'
									self.toast({
										type: 'success',
										desc: '申请成功'
									})
								}
							})
						}
					}
				})
			},
			userCancelOrder: function(idx) {
				let self = this
				let order = self.olist[self.curIndex][idx]
				uni.showModal({
					title: '提示',
					content: '确定要取消该订单吗？',
					confirmColor: '#1dc422',
					success: (res) => {
						if ( res.confirm ) {
							let data = {
								i:self.globalI,
								user_key: self.userInfo.user_key,
								token: self.userInfo.access_token,
								order_key: order.order_key,
								// leader_key :userInfo.leader_key //提货点id
							}
							self.toast({
								desc: '处理中...',
								type: 'loading',
								time: 8000
							})
							self.$Phttp.post(Config.JAVA_SAAS_URLS.userRefundOrder, data).then((res) => {
								res = res.data
								if (res.code === 0) {
									self.olist[self.curIndex][idx].state = 'returning'
									self.toast({
										type: 'success',
										desc: '申请成功'
									})
								}
							})
						}
					}
				})
			},
			payNow: function(idx) {
				let self = this
				let orderid = self.olist[self.curIndex][idx].id
				var showPayDialog = true
				// #ifdef MP-WEIXIN
				showPayDialog = false
				// #endif
				self.id = orderid
				if (showPayDialog) {
					self.showPayDialog = true
					return
				}
				self.toast({
					desc: '正在生成订单...',
					type: 'loading',
					time: 8000
				})
				let data = {
					i:self.globalI,
					user_key: self.userInfo.user_key,
					token: self.userInfo.access_token,
					order_key: self.order_key
				}
				// #ifdef APP-PLUS
				data = Object.assign(data, {
					i:self.globalI,
					order_type: self.isWeiXinPay?'wxapppay':'alipay',
					pay_type: self.isWeixinPay?1:2
				})
				// #endif

				// #ifdef H5
				data = Object.assign(data, {
					i:self.globalI,
					order_type: 'wxjsapi',
					openid: self.userInfo.h5openid,
					pay_type: 1
				})
				// #endif
				self.$Phttp.post(Config.JAVA_SAAS_URLS.payOrder, data).then((res) => {
					self.toast(true)
					res = res.data
					if (res.code === 0) {
						if (res.code === 0) {
							let payData = res.data.paydata
							let orderInfo = res.data.orderInfo
							// #ifdef APP-PLUS
							orderInfo = Object.assign(orderInfo, {
								provider: self.isWeiXinPay?'wxpay':'alipay'
							})
							// #endif
							self.pay(payData, orderInfo,
								(successInfo) => {
									uni.redirectTo({
										url: "/pages/order/paySuccess?id=" + orderInfo.id + "&orderNo=" + orderInfo.order_no + "&createTime=" + orderInfo.create_time + "&price=" + orderInfo.pay_amount
									})
								},
								(failInfo) => {
									console.log(failInfo)
								}
							)
						}
					}
				})
			},
			selectWeixinPay: function(isWeiXinPay) {
				this.isWeiXinPay = isWeiXinPay
				// this.payNow(false, this.id)
			},
			closePayDialog: function() {
				this.showPayDialog = false
			},
			statusName(status){
				return StatusFilter.statusName(status)
			},
			setReload: function(shouldReload) {
				console.log('setReload:' + shouldReload)
				this.shouldReload = shouldReload
			},
			toDeatil: function(order_key) {
				this.setReload(true)
				uni.navigateTo({
					url: '/pages/order/detail?order_key='+order_key
				})
			},
			toComment: function(idx) {
				this.setReload(true)
				let self = this
				let order = self.olist[self.curIndex][idx]
				if (order.is_comment) {
					uni.navigateTo({
						url: '/pkPostsale/record/comment?id='+order.id
					})
				} else {
					uni.navigateTo({
						url: '/pkPostsale/comment/comment?id='+order.id
					})
				}
			},
			reloadCurrentPage: function() {
				this.curPage[this.curIndex] = 1
				let orders = this.olist
				orders[this.curIndex] = []
				this.olist = Object.assign({}, orders)
				this.clickTab(this.curIndex)
			}
		}
	}
</script>

<style>
	@import url("../../common/css/animation.css");
	page {
	  background: #f6f6f6;
	}

	.swiper-tab {
	  width: calc(100% - 60rpx);
	  padding-left: 30rpx;
	  padding-right: 30rpx;
	  text-align: center;
	  height: 80rpx;
	  line-height: 80rpx;
	  display: flex;
	  flex-flow: row;
	  justify-content: space-between;
	  background: #fff;
	}

	.swiper-tab-item {
	  width: 100rpx;
	  color: #333;
	  font-size: 28rpx;
	  font-weight: 500;
	}

	.active {
	  color: #06c00c;
	  border-bottom: 4rpx solid #06c00c;
	}

	swiper {
	  height: calc(100% - 92rpx);
	}

	.swiper-tab-item {
		line-height: 2.8;
	}
	.no-data {
	  width: 100%;
	  position: absolute;
	  bottom: 0;
	  top: 0;
	  left: 0;
	  right: 0;
	  text-align: center;
	  padding-top: 203rpx;
	  background: #f2f2f2;
	  z-index: 100;
	}

	.no-data-img {
	  width: 184rpx;
	  height: 128rpx;
	  margin-bottom: 31rpx;
	}

	.no-data .text {
	  font-size: 28rpx;
	  color: #999;
	  text-align: center;
	}

	.load-page-page{
	  top: 80rpx;
	}

	.items {
	  width: 100%;
	  display: flex;
	  flex-direction: column;
	}

	.items .item {
	  width: calc(100% - 48rpx);
	  margin-left: 24rpx;
	  margin-right: 24rpx;
	  background: #fff;
	  border-radius: 20rpx;
	  margin-top: 20rpx;
	}

	.items .item .top{
	  width: calc(100% -60rpx);
	  height: 80rpx;
	  padding-left: 30rpx;
	  padding-right: 30rpx;
	  border-bottom: solid 1rpx #EEEEEE;
	  display: flex;
	  align-items: center;
	}

	.items .item .top .time{
	  font-size:24rpx;
	  font-weight:400;
	  color: #333;
	}

	.items .item .top .status{
	  font-size:22rpx;
	  font-weight:bold;
	  margin-left: auto;
	}

	.items .item .top .status.green{
	  color: #06C00C;
	}

	.items .item .top .status.gray{
	  color: #888888;
	}

	.items .item .top .status.gold{
	  color: #FBC531;
	}

	.items .item .top .status.red{
	  color: #E84118;
	}

	.items .item .content{
	  width: calc(100% - 60rpx);
	  height: 130rpx;
	  padding: 30rpx;
	  display: flex;
	  border-bottom: solid 1rpx #EEEEEE;
	}

	.items .item .content .product{
	  width: 130rpx;
	  height: 130rpx;
	  border-radius: 10rpx;
	  margin-right: 10rpx;
	}

	.items .item .content .more{
	  flex: 1;
	  height: 130rpx;
	  line-height: 130rpx;
	  font-size: 32rpx;
	  color: #666;
	  text-align: center;
	  font-weight: bold;
	}

	.items .item .content .s-product{
	  width: 100%;
	  height: 130rpx;
	  border-radius: 10rpx;
	}

	.items .item .s-product image {
	  width: 130rpx;
	  height: 130rpx;
	  border-radius: 10rpx;
	  float: left;
	}

	.items .item .s-product .title {
	  width: calc(100% - 160rpx);
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

	.items .item .s-product .descs {
	  width: calc(100% - 160rpx);
	  margin-left: 30rpx;
	  height: 40rpx;
	  line-height: 40rpx;
	  font-size: 22rpx;
	  color: #333;
	  font-weight: 500;
	  display: flex;
	  float: left;
	}

	.items .item .s-product .desc {
	  margin-right: 30rpx;
	}

	.items .item .s-product .price {
	  width: calc(100% - 160rpx);
	  font-size: 28rpx;
	  color: #333;
	  font-weight: bold;
	  margin-left: 30rpx;
	  float: left;
	  margin-top: 10rpx;
	}

	.items .item .bottom{
	  width: calc(100% - 60rpx);
	  height: 100rpx;
	  padding-left: 30rpx;
	  padding-right: 30rpx;
	  display: flex;
	  align-items: center;
	  font-size:22rpx;
	  font-weight:400;
	  color: #333;
	}

	.items .item .bottom .price{
	  font-size:32rpx;
	  font-weight:500;
	}

	.items .item .bottom .cancel{
	  width:140rpx;
	  height:48rpx;
	  line-height: 48rpx;
	  text-align: center;
	  border:1rpx solid #888888;
	  border-radius:25rpx;
	  font-size:22rpx;
	  font-weight:500;
	  color: #888888;
	  margin-left: auto;
	}

	.comment{
		width:140rpx;
		height:48rpx;
		line-height: 48rpx;
		text-align: center;
		border:1rpx solid #EE9900;
		border-radius:25rpx;
		font-size:22rpx;
		font-weight:500;
		color: #EE9900;
		margin-left: auto;
	}

	.items .item .bottom .refund{
	  width:140rpx;
	  height:48rpx;
	  line-height: 48rpx;
	  text-align: center;
	  border:1rpx solid #888888;
	  border-radius:25rpx;
	  font-size:22rpx;
	  font-weight:500;
	  color: #888888;
	  margin-left: auto;
	}



	.items .item .bottom .delete{
	  width:140rpx;
	  height:48rpx;
	  line-height: 48rpx;
	  text-align: center;
	  border:1rpx solid #888888;
	  border-radius:25rpx;
	  font-size:22rpx;
	  font-weight:500;
	  color: #888888;
	  margin-left: auto;
	}

	.items .item .bottom .pay{
	  width:140rpx;
	  height:50rpx;
	  line-height: 50rpx;
	  text-align: center;
	  border-radius:25rpx;
	  font-size:22rpx;
	  font-weight:500;
	  background: #E84118;
	  color: #fff;
	  margin-left: 20rpx;
	}
</style>
