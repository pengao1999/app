<template>
	<view :style="'height:'+winHeight+'px;width:100%'">
		<view class="swiper-tab">
			<view v-for="(item, index) in nav" :key="index" :class="{'swiper-tab-item':true,'active':curIndex===item.status}"
			 @tap="clickTab(item.status)">{{item.title}}</view>
		</view>
		<swiper :current="curIndex" :duration="500" @change="swiperTab" v-if="showSwiper">
			<!-- 全部 -->
			<swiper-item v-for="(item,index) in nav" :key="index">
				<view class="no-data" v-if="olist[index]=== undefined || olist[index].length===0">
					<image src="../../static/chaoyuezu/order/empty.png" class="no-data-img" />
					<view class="text">目前暂无订单</view>
					<button class="cu-btn round text-white bg-blue" @click="backHome">返回首页看看</button>
				</view>
				<scroll-view scroll-y="true" :style="'height:'+winHeight+'px;'" upper-threshold="50" @scrolltolower="scrollLoadOrders(curIndex, curPage[curIndex], false)"
				 v-else>
					<view class="inviteFriend">
						<image src="../../static/chaoyuezu/order/invite_friend.png" class="img" />
					</view>
					<view class="items">
						<view class="item" v-for="(order, idx) in olist[index]" :key="idx" @tap="toDeatil(order.order_key)">
							<view class="top">
								<text class="time">下单时间：{{order.create_time}}</text>
								<view class="status red" v-if="(order.status==='unPay'&&order.flex_segment2!='1')">审核中</view>
								<view class="status red" v-if="(order.status==='unPay'&&order.flex_segment2=='1')">待支付</view>
								<view class="status blue" v-if="order.status==='paySuccess'&&order.flex_segment2==1">待发货</view>
								<view class="status blue" v-if="order.status==='paySuccess'&&order.flex_segment2!=1">审核中</view>
								<view class="status blue" v-if="order.status==='sending'">待收货</view>
								<view class="status blue" v-if="order.status==='arrive'">待签收</view>
								<view class="status blue" v-if="order.status==='using'">租用中</view>
								<view class="status green" v-if="order.status==='completed'">已完成</view>
								<view class="status gray" v-if="order.status==='cancel'&&order.flex_segment2!='2'">已取消</view>
								<view class="status blue" v-if="order.status==='cancel'&&order.flex_segment2=='2'">已驳回</view>
								<!-- <view class='status gray' v-if="order.status==7">退款中</view>
                <view class='status gray' v-if="order.status==8">已退款</view>-->
							</view>
							<view class="content">
								<block v-for="(goods, gIndex) in order.ordergoodses" :key="gIndex">
									<view class="s-product" v-if="order.ordergoodses && order.ordergoodses.length===1">
										<image :src="image_root + goods.pic" lazy-load="true" />
										<text class="title">{{goods.goods_name}}</text>
										<view class="descs">
											<text class="desc">数量：{{goods.num}}</text>
											<text class="desc one-line-dot" v-if="goods.attr_names">规格：{{goods.attr_names}}</text>
										</view>
										<!--                    <view class="price">￥{{goods.price}}</view>-->
									</view>
									<image class="product" :src="image_root + goods.pic" v-else-if="gIndex<4" lazy-load="true" />
								</block>
								<text class="more" v-if="order.ordergoodses &&order.ordergoodses.length>4">...</text>
							</view>
							<view class="bottom_prize">
								<image class="icon" src="/static/chaoyuezu/order/icon_gold.png" />
								<text class="prize">共{{order.goods_num}}件商品，合计：￥<text class="amount">{{order.pay_amount}}</text> </text>
							</view>
							<view class="bottom">
								<view class="cancel" @tap.stop="cancelOrder(idx)" v-if="(order.status==='unPay'|order.status==='payFail')">取消</view>
								<!-- <view class='refund' @tap.stop="refundOrder(order, idx)" v-if="order.state==2|order.state==3|order.state==4|order.state==5">申请退款</view> -->
								<!-- <view class='refund' @tap.stop="takeDelivery(idx)" v-if="order.state==4">确认提货</view> -->

								<view class="pay" @tap.stop="payNow(idx)" v-if="(order.status==='unPay'&&order.flex_segment2=='1')">立即支付</view>

								<view class="pay" @tap.stop="comfirmOrder(idx)" v-if="order.status==='sending'">确认收货</view>

								<view class="delete" @tap.stop="deleteOrder(idx)" v-if="order.status==='completed'|order.status==='cancel'">删除</view>
							</view>
						</view>
						<uni-load-more :loadingType="loadingType" :contentText="contentText"></uni-load-more>
						<view style="height: 150upx;"></view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<pay-dialog :show="showPayDialog" @selectWeixinPay="selectWeixinPay" @close="closePayDialog"></pay-dialog>
		<myDialog confirmColor="var(--blue)" :title="dialogTitle" :content="dialogContent" :dialog-show="dialogShow"
		 @cancelButton="dialogShow=false" @confirmButton="comfirmDialog()"></myDialog>
	</view>
</template>

<script>
	import PConfig from '../verify/config'
	import Config from '../../common/js/Config.js'
	import Util from '../../common/js/util.js'
	import Toast from '../../common/js/toast.js'
	import Pay from '../../common/js/pay.js'

	import UniLoadMore from '../../components/uni-load-more.vue'
	import PayDialog from '../../components/yx_dialog/myPayDialog.vue'
	import {
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				id: '',
				dialogTitle: "",
				dialogContent: "",
				dialogShow: false,
				isLoading: false,
				shouldReload: false, //再次进入时，是否需要刷新
				leader_id: -1,
				dialogIdx: -1,
				dialogOp: '',
				nav: [{
						title: "全部",
						status: 0
					}, {
						title: "租用中",
						status: 1
					}, {
						title: "待发货",
						status: 2
					},
					{
						title: "待收货",
						status: 3
					},
					{
						title: "已完成",
						status: 4
					}
				],
				olist: [
					[],
					[],
					[],
					[],
					[]
				],
				curPage: [1, 1, 1, 1, 1],
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
		mixins: [Toast, Pay],
		components: {
			UniLoadMore,
			PayDialog
		},
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
			point_token() {
				return this.$store.state.point_token
			}
		},
		onLoad(options) {
			this.setUuid(Config.PLAT_UUID)
			if (Util.isEmptyObject(options)) {
				options = {
					status: ''
				}
			}
			this.nowTime = (new Date()).getTime() / 1000
			this.curIndex = this.mapStatusAndIndexCur(options.status)
			this.initPage(options)
		},
		onShow() {
			this.reloadCurrentPage()
		},
		onShareAppMessage() {
			return {
				title: '友邻优选-大家都在用的社区团购APP',
				path: '/pages/index/main?user_id=' + this.userInfo.user_key + '&i=' + this.globalI
			}
		},
		methods: {
			...mapMutations(['setUuid']),
			updateRentOrderInfo: function(order, cur, index) {
				let self = this
				let getData = {
					order_key: order.order_key,
					order_type: ""
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.updateRentOrderInfo, getData).then(res => {
					res = res.data
					if (res.code === 0) {
						self.olist[cur][index].pay_amount = res.data.pay_amount
					}
				})
			},
			initPage: function(options) {
				let self = this
				self.getOrders(options.status, 1, true)

				uni.getSystemInfo({
					success(system) {
						if (system.errMsg === "getSystemInfo:ok") {
							self.systemInfo = system
						}
					}
				})
			},
			comfirmOrder: function(idx, showDialog = true) {
				let self = this
				let order = self.olist[self.curIndex][idx]
				if (showDialog) {
					this.dialogTitle = '提示'
					this.dialogContent = '确认收货吗？'
					this.dialogShow = true
					this.dialogIdx = idx
					this.dialogOp = 'confirmOrder'
					return
				}
				this.dialogShow = false
				let data = {
					order_key: order.order_key
				}
				self.toast({
					desc: '处理中...',
					type: 'loading',
					time: 8000
				})
				self.$Phttp.post(Config.JAVA_SAAS_URLS.completeOrder, data).then((res) => {
					res = res.data
					if (res.code === 0) {
						self.olist[self.curIndex][idx].status = 'using'
						self.curPage[4] = 1
						self.olist[4] = []
						self.toast({
							type: 'success',
							desc: '操作成功'
						})
					} else {
						self.toast({
							desc: res.msg
						})
					}
				})
			},
			scrollLoadOrders(curIndex, page, showSwiper) {
				const status = this.mapStatusAndIndexStr(curIndex)
				this.getOrders(status, page, showSwiper)
			},
			comfirmDialog() {
				switch (this.dialogOp) {
					case "confirmOrder":
						this.comfirmOrder(this.dialogIdx, false)
						break;
					case "deleteOrder":
						this.deleteOrder(this.dialogIdx, false)
						break;
					case "cancelOrder":
						this.cancelOrder(this.dialogIdx, false)
						break;
					case "takeDelivery":
						this.takeDelivery(this.dialogIdx, false)
				}
			},
			getOrders: function(status, page, showSwiper) {
				let self = this
				if (self.isLoading) return
				self.isLoading = true
				let cur = self.mapStatusAndIndex(status)
				if (self.curPage[cur] === -1) {
					self.loadingType = 2
					return
				}
				self.loadingType = 1
				if (showSwiper) {
					// self.showSwiper = false
					self.toast({
						type: 'loading',
						desc: '加载中...',
						time: 4000
					})
				}
				let data = {
					i: self.globalI,
					user_key: self.userInfo.user_key,
					token: self.userInfo.access_token,
					page: self.curPage[cur],
					limit: Config.PAGE_LIMIT,
					state: status
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.orderList, data).then((res) => {
					console.log(res)
					uni.stopPullDownRefresh()
					self.toast(true)
					self.isLoading = false
					res = res.data
					if (res.code === 0) {
						if (res.data.length !== 0) {
							self.curPage[cur]++
						} else {
							self.curPage[cur] = -1
							self.showSwiper = true
							return
						}

						self.image_root = res.other.img_root
						var list = res.data
						list.forEach((item, index) => {
							list[index].num = item.ordergoodses && this.getProductNum(item.ordergoodses)
							list[index].create_time = Util.timestampToDate(list[index].create_time)
						})

						if (list.length < Config.PAGE_LIMIT) {
							self.loadingType = 2
						} else {
							self.loadingType = 1
						}

						let orders = self.olist
						orders[cur] = orders[cur].concat(list)
						self.olist = Object.assign({}, orders)

						self.olist[cur].forEach((order, oIndex) => {
							if (order.flex_segment2 == '1' && !order.flex_segment3) {
								self.updateRentOrderInfo(order, cur, oIndex)
							}
						})
						//fanxiaojiao 03-21 订单偶尔刷新不出,优化多次加载
					}
					self.showSwiper = true
				})
			},
			queryRentOrder: function(orderIndex, orderKey) {

			},
			swiperTab: function(e) {
				let index = e.detail.current
				this.clickTab(index)
			},
			clickTab: function(curIndex) {
				this.curIndex = parseInt(curIndex)
				if (this.olist[curIndex].length === 0 && this.curPage[curIndex] === 1) {
					let status = this.mapStatusAndIndexStr(curIndex)
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
			deleteOrder: function(idx, showDialog = true) {
				let self = this
				let order = self.olist[self.curIndex][idx]
				if (showDialog) {
					this.dialogTitle = '提示'
					this.dialogContent = '确认删除订单吗？'
					this.dialogShow = true
					this.dialogIdx = idx
					this.dialogOp = 'deleteOrder'
					return
				}
				this.dialogShow = false
				let data = {
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
			},
			cancelOrder: function(idx, showDialog = true) {
				let self = this
				let order = self.olist[self.curIndex][idx]

				if (showDialog) {
					this.dialogTitle = '提示'
					this.dialogContent = '确定取消该订单吗？'
					this.dialogShow = true
					this.dialogIdx = idx
					this.dialogOp = 'cancelOrder'
					return
				}
				this.dialogShow = false
				let data = {
					// i:self.globalI,
					// user_key: self.userInfo.user_key,
					// token: self.userInfo.access_token,
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
						self.olist[self.curIndex][idx].status = 'cancel'
						self.toast({
							type: 'success',
							desc: '取消成功'
						})
					}
				})
			},
			takeDelivery: function(idx, showDialog = true) {
				let self = this
				let order = self.olist[self.curIndex][idx]
				if (showDialog) {
					this.dialogTitle = '提示'
					this.dialogContent = '确认已收到货吗？'
					this.dialogShow = true
					this.dialogIdx = idx
					this.dialogOp = 'takeDelivery'
					return
				}
				this.dialogShow = false
				let data = {
					i: self.globalI,
					user_key: self.userInfo.user_key,
					token: self.userInfo.access_token,
					order_id: order.id,
					type: 'list'
				}
				self.toast({
					desc: '处理中...',
					type: 'loading',
					time: 8000
				})
				self.$http.post(Config.URLS.confirmUserGoods, data).then((res) => {
					res = res.data
					if (res.code === 0) {
						self.olist[self.curIndex][idx].status = 5
						self.toast({
							type: 'success',
							desc: '收货成功'
						})
					}
				})
			},
			backHome() {
				uni.switchTab({
					url: '/pkChaoYueZu/index/main',
				})
			},
			refundOrder: function(order, idx) {
				let self = this
				uni.showModal({
					title: '提示',
					content: '确定要申请退款吗？',
					confirmColor: '#1dc422',
					success: (res) => {
						if (res.confirm) {
							let data = {
								i: self.globalI,
								user_key: self.userInfo.user_key,
								token: self.userInfo.access_token,
								order_id: order.id,
								// leader_id :userInfo.leader_id //团长id
							}
							self.toast({
								desc: '处理中...',
								type: 'loading',
								time: 8000
							})
							self.$http.post(Config.URLS.refundOrder, data).then((res) => {
								res = res.data
								if (res.code === 0) {
									self.olist[self.curIndex][idx].status = 6
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
			payNow(idx) {
				let self = this
				let orderKey = self.olist[self.curIndex][idx].order_key
				let thisselect = self.olist[self.curIndex][idx]
				console.log(self.olist[self.curIndex][idx])
				self.toast({
					desc: '正在生成...',
					type: 'loading',
					time: 8000,
				})
				let data = {
					order_key: orderKey,
					user_origin: 'zulin'
				}
				let order_type;
				if (thisselect.pay_type == 1) {
					order_type = "wxapppay"
				} else if (thisselect.pay_type == 2) {
					order_type = "alipay"
				} else {
					order_type = "wxapppay"
				}
				data = Object.assign(data, {
					order_type: order_type
				})
				console.log(data)
				// data.order_type = "wxapppay"
				self.$Phttp.post(Config.JAVA_SAAS_URLS.payOrder, data).then(res => {
					console.log(res);
					self.toast(true)
					res = res.data
					let paytype;
					if (res.data.orderInfo.pay_type == 1) {
						paytype = "wxpay"
					} else if (res.data.orderInfo.pay_type == 2) {
						paytype = "alipay"
					} else {
						paytype = "wxpay"
					}
					if (res.code === 0) {
						let payData = res.data.paydata
						let orderInfo = res.data.orderInfo
						orderInfo = Object.assign(orderInfo, {
							provider: paytype,
							// provider: 'wxpay',
						})
						console.log(payData)
						console.log(orderInfo)
						self.pay(
							payData,
							orderInfo,
							successInfo => {
								console.log('success', successInfo)
								uni.redirectTo({
									url: '/pkChaoYueZu/order/detail?key=' + orderInfo.order_key
								})
							},
							failInfo => {
								console.log('fail', failInfo)
							}
						)
					} else {
						self.toast({
							desc: res.msg
						})
					}
				})
			},
			selectWeixinPay: function(isWeiXinPay) {
				this.isWeiXinPay = isWeiXinPay
				this.payNow(false, this.id)
			},
			closePayDialog: function() {
				this.showPayDialog = false
			},
			setReload: function(shouldReload) {
				console.log('setReload:' + shouldReload)
				this.shouldReload = shouldReload
			},
			toDeatil: function(id) {
				this.setReload(true)
				uni.navigateTo({
					url: 'detail?key=' + id
				})
			},
			reloadCurrentPage: function() {
				this.curPage[this.curIndex] = 1
				this.olist[this.curIndex] = []
				this.scrollLoadOrders(this.curIndex, 1, true)
			},
			mapStatusAndIndexStr(statusOrIndex) {
				let state = ""
				if (!statusOrIndex) {
					statusOrIndex = 'all'
				}
				switch (statusOrIndex) {
					case 0:
					case 'all':
						state = ""
						break
					case 1:
					case 'using':
						state = "using"
						break
					case 2:
					case 'paySuccess':
						state = "paySuccess"
						break
					case 3:
					case 'sending':
						state = "sending"
						break
					case 4:
					case 'completed':
						state = "completed"
						break
					case 5:
					case 'cancel':
						state = "cancel"
						break
				}

				return state
			},
			mapStatusAndIndexCur(statusOrIndex) {
				let cur = ""
				if (!statusOrIndex) {
					statusOrIndex = 'all'
				}
				switch (statusOrIndex) {
					case 0:
					case 'all':
						cur = 0
						break
					case 1:
					case 'using':
						cur = 1
						break
					case 2:
					case 'paySuccess':
						cur = 2
						break
					case 3:
					case 'sending':
						cur = 3
						break
					case 4:
					case 'completed':
						cur = 4
						break
					case 5:
					case 'cancel':
						cur = 5
						break
				}

				return cur
			},
			mapStatusAndIndex(statusOrIndex) {
				let mapping = {}
				if (!statusOrIndex) {
					statusOrIndex = 'all'
				}
				mapping[mapping['all'] = 0] = ''
				mapping[mapping['paySuccess'] = 2] = 'paySuccess'
				mapping[mapping['sending'] = 3] = 'sending'
				mapping[mapping['using'] = 1] = 'using'
				mapping[mapping['completed'] = 4] = 'completed'
				mapping[mapping['cancel'] = 5] = 'cancel'

				return mapping[statusOrIndex]
			}
		},
		onPullDownRefresh() {
			let self = this
			self.reloadCurrentPage()
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
		color: #222222;
		font-size: 28rpx;
		font-weight: 500;
	}

	.active {
		color: #1677FF;
		border-bottom: 4rpx solid #0687FF;
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
		background: rgba(255, 255, 255, 1);
		z-index: 100;
	}

	.no-data-img {
		width: 400rpx;
		height: 252rpx;
		margin-bottom: 31rpx;
	}

	.no-data .text {
		font-size: 28rpx;
		color: #999;
		text-align: center;
	}

	.no-data .cu-btn {
		width: 500rpx;
		height: 84rpx;
		background: linear-gradient(180deg, rgba(82, 171, 252, 1) 0%, rgba(6, 135, 255, 1) 100%);
		border-radius: 44rpx;
		margin-top: 100rpx;
	}

	.load-page-page {
		top: 80rpx;
	}

	.inviteFriend {
		width: 100%;
		height: 150rpx;
		background: rgba(255, 255, 255, 1);
		position: relative;
		z-index: 1000;
	}

	.inviteFriend .img {
		width: 690rpx;
		height: 108rpx;
		margin-left: 30rpx;
		margin-top: 30rpx;
	}

	.items {
		width: 100%;
		display: flex;
		flex-direction: column;
		margin-top: -20rpx;
	}

	.items .item {
		width: 100%;
		/* margin-left: 24rpx; */
		/* margin-right: 24rpx; */
		background: #fff;
		/* border-radius: 20rpx; */
		margin-top: 20rpx;
	}

	.items .item .top {
		width: calc(100% -60rpx);
		height: 80rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
		/* border-bottom: solid 1rpx #eeeeee; */
		display: flex;
		align-items: center;
	}

	.items .item .top .time {
		font-size: 24rpx;
		font-weight: 400;
		color: #222222;
	}

	.items .item .top .status {
		font-size: 22rpx;
		font-weight: bold;
		margin-left: auto;
	}

	.items .item .top .status.green {
		color: #06c00c;
	}

	.items .item .top .status.gray {
		color: #888888;
	}

	.items .item .top .status.gold {
		color: #fbc531;
	}

	.items .item .top .status.blue {
		color: #1677FF;
	}

	.items .item .top .status.red {
		color: #e84118;
	}

	.items .item .content {
		width: calc(100% - 60rpx);
		height: 130rpx;
		padding: 30rpx;
		display: flex;
		/* border-bottom: solid 1rpx #eeeeee; */
	}

	.items .item .content .product {
		width: 130rpx;
		height: 130rpx;
		border-radius: 10rpx;
		margin-right: 10rpx;
	}

	.items .item .content .more {
		flex: 1;
		height: 130rpx;
		line-height: 130rpx;
		font-size: 32rpx;
		color: #666;
		text-align: center;
		font-weight: bold;
	}

	.items .item .content .s-product {
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
		color: #222222;
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
		font-size: 22rpx;
		color: #222222;
		font-weight: 500;
		display: flex;
		flex-direction: column;
		float: left;
	}

	.items .item .s-product .desc {
		margin-right: 30rpx;
		min-width: 150upx;
	}

	.items .item .s-product .price {
		width: calc(100% - 160rpx);
		font-size: 28rpx;
		color: #222222;
		font-weight: bold;
		margin-left: 30rpx;
		float: left;
		margin-top: 10rpx;
	}

	.items .item .bottom {
		width: calc(100% - 60rpx);
		height: 100rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
		display: flex;
		align-items: center;
		font-size: 22rpx;
		font-weight: 400;
		color: #222222;
	}

	.items .item .bottom .price {
		font-size: 32rpx;
		font-weight: 500;
	}

	.items .item .bottom .cancel {
		width: 140rpx;
		height: 48rpx;
		line-height: 48rpx;
		text-align: center;
		border: 1rpx solid #888888;
		border-radius: 25rpx;
		font-size: 22rpx;
		font-weight: 500;
		color: #888888;
		margin-left: auto;
	}

	.items .item .bottom .refund {
		width: 140rpx;
		height: 48rpx;
		line-height: 48rpx;
		text-align: center;
		border: 1rpx solid #888888;
		border-radius: 25rpx;
		font-size: 22rpx;
		font-weight: 500;
		color: #888888;
		margin-left: auto;
	}

	.items .item .bottom .delete {
		width: 140rpx;
		height: 48rpx;
		line-height: 48rpx;
		text-align: center;
		border: 1rpx solid #888888;
		border-radius: 25rpx;
		font-size: 22rpx;
		font-weight: 500;
		color: #888888;
		margin-left: auto;
	}

	.items .item .bottom .pay {
		width: 140rpx;
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		border-radius: 25rpx;
		font-size: 22rpx;
		font-weight: 500;
		background: linear-gradient(180deg, rgba(82, 171, 252, 1) 0%, rgba(6, 135, 255, 1) 100%);
		color: #fff;
		margin-left: 10upx;
	}

	.items .item .bottom_prize {
		font-size: 22rpx;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-right: 40rpx;
	}

	.items .item .bottom_prize .icon {
		width: 32rpx;
		height: 32rpx;
		margin-right: 5rpx;
	}

	.items .item .bottom_prize .price {
		font-size: 32rpx;
		font-weight: 500;
		margin-top: 10rpx;
		/* align-items: center; */
	}

	.items .item .bottom_prize .amount {
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: bold;
		color: rgba(34, 34, 34, 1);
	}
</style>
