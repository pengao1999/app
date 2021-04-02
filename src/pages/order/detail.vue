<template>
	<view>
		<view class='top'>
			<text class='time' v-if="order.state=='unPay'">{{surplusTime}}</text>
			<text class='desc' v-if="order.state=='unPay'">待付款，超时订单自动关闭</text>
			<text class='time' v-if="order.state=='paySuccess'">待配送</text>
			<text class='desc' v-if="order.state=='paySuccess'">备货中，请耐心等待</text>
			<text class='time' v-if="order.state=='sending'">配送中</text>
			<text class='desc' v-if="order.state=='sending'">配送中，请耐心等待</text>
			<text class='time' v-if="order.state=='arrive'">待签收</text>
			<text class='desc' v-if="order.state=='arrive'">商品已到达，请及时上门提货</text>
			<text class='time' v-if="order.state=='completed'">已完成</text>
			<text class='desc' v-if="order.state=='completed'">已完成交易，期待下次继续购买</text>
			<text class='time' v-if="order.state=='cancel'">已取消</text>
			<text class='desc' v-if="order.state=='cancel'">订单已取消，请重新下单</text>
			<text class='time' v-if="order.state=='td'">退订成功</text>
			<text class='desc' v-if="order.state=='td'">订单已退订，请重新下单</text>
		</view>

		<view class='tack-info'>
			<view class='col-top'>
				<text>{{order.order_type===2?'提货信息':'收货信息'}}</text>
			</view>
			<view class='info'>
				<view class='row'>
					<text class='name'>收货人</text>
					<text class='content'>{{order.name}}</text>
				</view>
				<view class='row'>
					<text class='name'>收货人电话</text>
					<text class='content'>{{order.mobile}}</text>
				</view>
				<view class='row' v-if="order.order_type==2">
					<text class='name'>提货点</text>
					<text class='content'>{{order.leader_name}}</text>
				</view>
				<view class='row' v-if="order.order_type==2">
					<text class='name'>提货地点</text>
					<view class='content' style="min-height: 40upx;" @tap='openMap'>{{order.leader_address}}
						<image src='../../static/ic_coordinate_gray.png'></image>
					</view>
				</view>
				<view class='row' v-else>
					<text class='name'>收货地址</text>
					<text class='content'>{{order.address}}</text>
				</view>
			</view>
			<view class='bottom'>
				<text>共{{productNum}}件商品 小计：</text>
				<text class='price'>￥{{order.pay_amount}}</text>
			</view>
		</view>

		<template v-if="config.devliery_plan_switch==='1'">
		<view class='product' v-if="arrive.length>0">
			<view class='col-top'>
				<text class='time'>待签收</text>
				<text class='num'>共{{arriveNum}}件商品</text>
			</view>
			<view class='items' v-for="(item, index) in arrive" :key="index">
				<view class='item' style="height: 180upx;" @tap='detail(item.goods_key)'>
					<image :src='item.image'></image>
					<text class='title'>{{item.name}}</text>
					<text class='tag'>数量：{{item.num}}</text>
					<!-- <text class='tag' v-if="item.attr_names">规格：{{item.attr_names}}</text> -->
					<view class='bottom'>
						<text></text>
						<button class='contact pick' @click.stop="pickUp(item.id,item.delivery_id)">确认签收</button>
					</view>
				</view>
			</view>
		</view>
		</template>

		<view class='product'>
			<view class='col-top'>
				<text class='time'>订单商品</text>
				<text class='num'>共{{productNum}}件商品</text>
			</view>
			<view class='items' v-for="(item, index) in order.ordergoodses" :key="index">
				<view class='item' @tap='detail(item.goods_key)'>
					<image :src='image_root+item.pic'></image>
					<text class='title'>{{item.goods_name}}</text>
					<text class='tag'>数量：{{item.num}}</text>
					<text class='tag' v-if="item.attr_names">规格：{{item.attr_names}}</text>
					<view class='bottom'>
						<text>实付金额：</text>
						<text class='price'>￥{{item.amount}}</text>
						<button class='contact' @click.stop="plan(item.goods_key, item.attr_keys)" v-if="config.devliery_plan_switch==='1'">配送计划</button>
					</view>
				</view>
			</view>
		</view>

		<view class='order-info'>
			<view class='col-top'>
				<text>订单信息</text>
			</view>
			<view class='info'>
				<view class='row'>
					<text class='name'>订单编号</text>
					<text class='content'>{{order.order_no}}</text>
				</view>
				<view class='row'>
					<text class='name'>下单时间</text>
					<text class='content'>{{formatTime(order.create_time)}}</text>
				</view>
				<view class='row' v-if="order.order_type==2">
					<text class='name'>活动时间</text>
					<text class='content'>{{order.create_time}}</text>
				</view>
				<view class='row' v-if="order.order_type==2">
					<text class='name'>社区活动</text>
					<text class='content'>￥0.00</text>
				</view>
			</view>
		</view>
		<view style='height:120rpx; width:100%;'></view>

		<view class='buttons'>
			<block v-if="order.state=='unPay'&order.expire_time>nowTime">
				<view class='button' @tap="cancelOrder">取消订单</view>
				<!-- #ifdef MP-WEIXIN -->
				<view class='button pay' @tap="payNow(false)">立即支付</view>
				<!-- #endif -->
				<!-- #ifdef APP-PLUS || H5 -->
				<view class='button pay' @tap="payNow(true)">立即支付</view>
				<!-- #endif -->
			</block>
<!--			<view class='button pick' @tap="pickAll()" style="width: 100%;" v-if="arrive.length>0">一键签收</view>-->
			<view class='button border-top' style="width: 100%;" @tap="tdOrder" v-if="order.state=='paySuccess'|order.state=='sending'">一键退订</view>
			<view class='button' @tap="deleteOrder" v-if="order.state=='completed'|order.state=='cancel'|(order.state=='unPay'&order.expire_time<=nowTime)">删除订单</view>
		</view>
		<pay-dialog :show="showPayDialog" @selectWeixinPay="selectWeixinPay" @close="closePayDialog"></pay-dialog>

		<view class="cu-modal " :class="tdDialog?'show': ''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">提示</view>
					<view class="action" @click="tdDialog=false">
						<text class="icon-close text-red"></text>
					</view>
				</view>
				<view class="padding text-left">
					1.退订仅针对<span style="color:var(--red)">未配送</span>以及<span style="color:var(--red)">备货期</span>之外的部分商品<br/>
					2.退订后，金额将退回用户账户余额，在<span style="color:var(--red)">我的页面</span>查看<br/>
					3.退订后，若备货期内还有商品未配送完，则订单状态仍为<span style="color:var(--red)">配送中</span>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green" @click="tdDialog=false">取消</button>
						<button class="cu-btn bg-green margin-left" style="margin-left: 10upx;" @tap="tbOrderReal">确定</button>

					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Config from '../../common/js/Config.js'
	import Util from '../../common/js/util.js'
	import Timer from '../../common/js/timeCounter.js'
	import Toast from '../../common/js/toast.js'
	import Pay from '../../common/js/pay.js'

	import PayDialog from '../../components/yx_dialog/myPayDialog.vue'
	export default {
		data() {
			return {
				order_key: '',
				surplusTime: '',
				order: {},
				productNum: 0,
				expectTime: '',
				nowTime: 0,
				image_root: '',
				timer: Object,
				showPayDialog: false,
				isWeiXinPay: true,
				arriveNum: 0,
				arrive: [],
				config: {
					devliery_day_setting:'0', //运达天数
					devliery_cost_setting:'0', //运费
					devliery_home_switch:'0',//开启送到家
					devliery_plan_switch:'0',//开启配送计划
					devliery_leader_switch:'0'//开启送到提货点
				},
				tdDialog: false,
				isTDing: false
			}
		},
		mixins: [Timer, Toast, Pay],
		components: {
			PayDialog
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
			this.order_key=options.order_key
			this.nowTime = Date.parse(new Date()) / 1000
			this.getOrderDetail()
			this.getConfig()
		},
		methods: {
			getOrderDetail: function() {
				let self = this
				let data = {
					i: self.globalI,
					order_key: self.order_key
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.orderDetail, data).then((res) => {
					res = res.data
					if (res.code === 0) {
						self.order = res.data
						self.image_root = res.other.img_root
						self.productNum = self.getProductNum(res.data.ordergoodses)
						// self.expectTime = self.timestampToTime(new Date(res.data.create_time).getTime())
						if(res.data.state==='unPay'){
							self.cutDown2(res.data.create_time)
						}
						let arriveArr = []
						this.arriveNum = 0
						for (let i = 0; i < res.data.arrive.length; i++) {
							this.arriveNum += res.data.arrive[i].plan_num
							arriveArr.push({
								id: res.data.arrive[i].id,
								goods_key: res.data.arrive[i].goods_key,
								delivery_id: res.data.arrive[i].delivery_id,
								name: res.data.arrive[i].goods_name,
								image: res.other.img_root + res.data.arrive[i].pic,
								date: Util.getDate(res.data.arrive[i].plan_time),
								num: res.data.arrive[i].plan_num
							})

						}
						self.arrive = arriveArr
						console.log(JSON.stringify(self.arrive))
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
			formatTime(nS) {
				return Util.formatTime(nS);
			},
			cutDown2: function(createTime) {
				let self = this
				console.log(createTime)
				var totalSecond = createTime - Date.parse(new Date()) / 1000 + 1800;

				self.timer = setInterval(function() {
					// 秒数
					var second = totalSecond;

					// 天数位
					var day = Math.floor(second / 3600 / 24);
					var dayStr = day.toString();
					if (dayStr.length == 1) dayStr = '0' + dayStr;

					// 小时位
					var hr = Math.floor((second - day * 3600 * 24) / 3600);
					var hrStr = hr.toString();
					if (hrStr.length == 1) hrStr = '0' + hrStr;

					// 分钟位
					var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
					var minStr = min.toString();
					if (minStr.length == 1) minStr = '0' + minStr;

					// 秒位
					var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
					var secStr = sec.toString();
					if (secStr.length == 1) secStr = '0' + secStr;

					self.surplusTime = minStr + ":" + secStr
					totalSecond--;
					if (totalSecond < 0) {
						self.clearTimer();
						self.surplusTime = "订单已取消"
					}
				}.bind(self), 1000);
			},
			clearTimer: function() {
				if (!Util.isEmptyObject(this.timer))
					clearInterval(this.timer)
			},
			cancelOrder: function() {
				let self = this
				uni.showModal({
					confirmColor: "#1dc422",
					title: '提示',
					content: '确认取消该订单吗',
					success: (res) => {
						if (res.confirm) {
							let data = {
								i: self.globalI,
								user_key: self.userInfo.user_key,
								token: self.userInfo.access_token,
								order_key: self.order_key
							}
							self.toast({
								desc: '处理中...',
								type: 'loading',
								time: 8000
							})
							self.$Phttp.post(Config.JAVA_SAAS_URLS.cancelOrder, data).then((res) => {
								res = res.data
								if (res.code === 0) {
									self.toast({
										type: 'success',
										desc: '取消成功'
									})
									setTimeout(() => {
										uni.navigateBack({
											delta: 1
										})
									}, 500)
								}
							})
						}
					},
					fail: (res) => {

					}
				})
			},
			payNow: function(showPayDialog) {
				let self = this
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
					i: self.globalI,
					user_key: self.userInfo.user_key,
					token: self.userInfo.access_token,
					order_key: self.order_key
				}
				// #ifdef APP-PLUS
				data = Object.assign(data, {
					i: self.globalI,
					order_type: self.isWeiXinPay ? 'wxapppay' : 'alipay'
				})
				// #endif

				// #ifdef H5
				data = Object.assign(data, {
					order_type: 'wxjsapi',
					openid: self.userInfo.h5openid,
					i: self.globalI
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
								provider: self.isWeiXinPay ? 'wxpay' : 'alipay'
							})
							// #endif
							console.log('payData:' + JSON.stringify(payData))
							self.pay(payData, orderInfo,
								(successInfo) => {
									uni.redirectTo({
										url: "/pages/order/paySuccess?id=" + orderInfo.id + "&orderNo=" + orderInfo.order_no + "&createTime=" +
											orderInfo.create_time + "&price=" + orderInfo.pay_amount
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
			getConfig: function() {
				let self = this
				self.$Phttp.post(Config.JAVA_SAAS_URLS.orderSetting, {}).then(res => {
					res = res.data
					if (res.code ===0) {
						self.config = Object.assign(self.config, res.data)
					}
				})
			},
			openMap: function() {
				uni.openLocation({
					name: this.order.leader_community,
					latitude: parseFloat(this.order.latitude),
					longitude: parseFloat(this.order.longitude),
					success: () => {
						console.log('open map.')
					}
				});
			},
			selectWeixinPay: function(isWeiXinPay) {
				this.isWeiXinPay = isWeiXinPay
				this.payNow(false)
			},
			closePayDialog: function() {
				this.showPayDialog = false
			},
			deleteOrder: function() {
				let self = this
				uni.showModal({
					title: '提示',
					content: '确定删除该订单吗？',
					confirmColor: '#1dc422',
					success: (res) => {
						if (res.confirm) {
							let data = {
								i: self.globalI,
								user_key: self.userInfo.user_key,
								token: self.userInfo.access_token,
								order_key: self.order.order_key
							}
							self.toast({
								desc: '处理中...',
								type: 'loading',
								time: 8000
							})
							self.$Phttp.post(Config.JAVA_SAAS_URLS.delOrder, data).then((res) => {
								res = res.data
								if (res.code === 0) {
									self.toast({
										type: 'success',
										desc: '删除成功',
										time: 1000
									})
									setTimeout(() => {
										uni.navigateBack({
											delta: 1
										})
									}, 300)
								}
							})
						}
					}
				})
			},
			pickAll() {
				let ids = []
				if(this.arrive.length===0){
					uni.showToast({
						title:'商品已经全部提完',
						icon:'none'
					})
					return
				}
				let delivery_id=''
				this.arrive.forEach((item, idx) => {
					ids.push(item.id)
					delivery_id=item.delivery_id
				})
				let plan_ids = ids.join(',')
				this.pickUp(plan_ids,delivery_id)
			},
			pickUp(ids,delivery_id) {
				let self=this
				let data = {
					plan_ids: ids,
					delivery_id:delivery_id
				}
				uni.showLoading({
					title: '处理中...'
				})
				self.$Phttp.post(Config.JAVA_SAAS_URLS.userPickUp, data).then((res) => {
					res = res.data
					if (res.code === 0) {
						uni.hideLoading();
						self.getOrderDetail()
					}
				})
			},
			plan(goods_key, attr_keys) {
				uni.navigateTo({
					url: 'planDetail?goods_key=' + goods_key + '&order_key=' + this.order_key + '&attr_keys=' + attr_keys
				})
			},
			detail(goods_key){
				uni.navigateTo({
					url:'/pages/index/product?goods_key='+goods_key
				})
			},
			tdOrder() {
				this.tdDialog = true
			},
			tbOrderReal() {
				let self = this
				if (self.isTDing) return
				self.isTDing = true
				let postData = {
					order_key : self.order_key
				}
				self.toast({
					type: 'loading'
				})
				self.$Phttp.post(Config.JAVA_SAAS_URLS.tbOrder, postData).then(res => {
					self.isTDing = false
					res = res.data
					if (res.code === 0) {
						self.toast({
							desc: '退订成功'
						})
						self.getOrderDetail()
					} else {
						self.toast({
							desc: res.msg
						})
					}
					self.tdDialog = false
				})
			}
		},
		onUnload() {
			this.clearTimer()
		},
		onShareAppMessage() {
			return {
				title: '友邻优选-大家都在用的社区团购APP',
				path: '/pages/index/main?user_key=' + this.userInfo.user_key + '&i=' + this.globalI
			}
		}
	}
</script>

<style>
	page {
		background: #f6f6f6;
	}

	.top {
		width: 100%;
		height: 280rpx;
		background: #1dc422;
		display: flex;
		padding-top: 50rpx;
		flex-direction: column;
		align-items: center;
	}

	.top .time {
		font-size: 48rpx;
		font-weight: bold;
		color: #f6f6f6;
	}

	.top .desc {
		font-size: 24rpx;
		font-weight: 500;
		color: #f6f6f6;
		margin-top: 20rpx;
	}

	.tack-info {
		width: calc(100% - 48rpx);
		margin-left: 24rpx;
		margin-right: 24rpx;
		/* height: 330rpx; */
		background: #fff;
		border-radius: 20rpx;
		margin-top: -100rpx;
	}

	.tack-info .col-top {
		width: calc(100% -60rpx);
		height: 80rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
		border-bottom: solid 1rpx #eee;
		display: flex;
		align-items: center;
		font-size: 28rpx;
		font-weight: 500;
		color: #333;
	}

	.tack-info .info {
		width: calc(100% - 48rpx);
		margin-left: 24rpx;
		margin-right: 24rpx;
		padding-top: 30rpx;
		padding-bottom: 30rpx;
		background: #fff;
	}
	.padding {
		padding: 20rpx;
	}

	.tack-info .info .row {
		width: 100%;
		line-height: 40rpx;
		display: flex;
		font-size: 24rpx;
		color: #333;
		flex-wrap: wrap;
	}

	.tack-info .info .row .name {
		width: 130rpx;
		height: 40rpx;
		line-height: 40rpx;
	}

	.tack-info .info .row .content {
		width: calc(100% - 162rpx);
		padding-left: 30rpx;
		border-left: solid 1rpx #f6f6f6;
	}

	.tack-info .info .row .content image {
		width: 30rpx;
		height: 30rpx;
		margin-left: 10rpx;
		margin-bottom: -6rpx;
	}

	.tack-info .bottom {
		width: calc(100% - 60rpx);
		height: 100rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
		display: flex;
		align-items: center;
		font-size: 28rpx;
		font-weight: 500;
		color: #333;
		justify-content: flex-end;
		border-top: solid 1rpx #eee;
	}

	.tack-info .bottom .price {
		font-size: 36rpx;
		font-weight: 500;
		color: #e84118;
	}

	.product {
		width: calc(100% - 48rpx);
		margin-left: 24rpx;
		margin-right: 24rpx;
		background: #fff;
		border-radius: 20rpx;
		margin-top: 20rpx;
	}

	.product .col-top {
		width: calc(100% -60rpx);
		height: 80rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
		border-bottom: solid 1rpx #eee;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.product .col-top .time {
		font-size: 24rpx;
		font-weight: 500;
		color: #0CC112;
	}

	.product .col-top .num {
		font-size: 22rpx;
		color: #888;
		font-weight: 400;
		margin-left: auto;
	}

	.product .items {
		width: 100%;
		padding-top: 10rpx;
		padding-bottom: 10rpx;
	}

	.product .items .item {
		width: calc(100% - 40rpx);
		height: 130rpx;
		padding: 20rpx;
		position: relative;
	}

	.product .items .item image {
		width: 130rpx;
		height: 130rpx;
		border-radius: 20rpx;
		float: left;
	}

	.product .items .item .title {
		width: calc(100% - 160rpx);
		font-size: 28rpx;
		color: #2F3640;
		margin-left: 30rpx;
		float: left;
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.product .items .item .tag {
		font-size: 22rpx;
		color: #333;
		font-weight: 500;
		margin-left: 30rpx;
		float: left;
		margin-top: 10rpx;
	}

	.product .items .item .bottom {
		width: calc(100% - 210rpx);
		position: absolute;
		right: 30rpx;
		bottom: 20rpx;
	}

	.product .items .item .bottom text {
		font-size: 20rpx;
		color: #333;
		font-weight: 500;
	}

	.product .items .item .bottom .price {
		font-size: 28rpx;
		color: #E84118;
		font-weight: 500;
	}

	.product .items .item .bottom .contact {
		width: 140rpx;
		height: 50rpx;
		line-height: 50rpx;
		border: 1rpx solid #888;
		border-radius: 25px;
		text-align: center;
		font-size: 22rpx;
		color: #888;
		position: absolute;
		bottom: 0;
		right: 0;
	}

	.product .items .item .bottom .contact.pick {
		border: 1rpx solid #0CC112;
		background: #0CC112;
		color: #fff;
	}

	.order-info {
		width: calc(100% - 48rpx);
		margin-left: 24rpx;
		margin-right: 24rpx;
		background: #fff;
		border-radius: 20rpx;
		margin-top: 20rpx;
	}

	.order-info .col-top {
		width: calc(100% -60rpx);
		height: 80rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
		border-bottom: solid 1rpx #eee;
		display: flex;
		align-items: center;
		font-size: 28rpx;
		font-weight: 500;
		color: #333;
	}

	.order-info .info {
		width: calc(100% - 48rpx);
		margin-left: 24rpx;
		margin-right: 24rpx;
		padding-top: 30rpx;
		padding-bottom: 30rpx;
		background: #fff;
	}

	.order-info .info .row {
		width: 100%;
		line-height: 40rpx;
		display: flex;
		font-size: 24rpx;
		color: #333;
		flex-wrap: wrap;
	}

	.order-info .info .row .name {
		width: 130rpx;
		height: 40rpx;
		line-height: 40rpx;
	}

	.order-info .info .row .content {
		width: calc(100% - 162rpx);
		padding-left: 30rpx;
		border-left: solid 1rpx #f6f6f6;
	}

	.buttons {
		width: 100%;
		display: flex;
		background: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		justify-content: center;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.buttons .button {
		width: 50%;
		height: 98rpx;
		line-height: 98rpx;
		text-align: center;
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}

	.buttons .button.pay {
		background: #E84118;
		color: #fff;
	}

	.buttons .button.pick{
		background: #0CC112;
		color: #fff;
	}

	button {
		display: unset;
		padding-left: unset;
		padding-right: unset;
		box-sizing: unset;
		font-size: unset;
		text-align: center;
		text-decoration: unset;
		line-height: unset;
		border-radius: unset;
		-webkit-tap-highlight-color: unset;
		overflow: unset;
		color: unset;
		background-color: unset;
	}

	button::after {
		border: none;
	}
</style>
