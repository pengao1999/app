<template>
	<view>
		<view class="top">
			<text class="time" v-if="order.status == 'unPay'&&order.flex_segment2=='1'">待支付</text>
			<text class="time" v-if="order.status == 'unPay'&&order.flex_segment2!='1'">审核中</text>
			<!-- <text class="desc" v-if="order.status == 'unPay'">待支付，请去支付</text> -->
			<text class="time" v-if="order.status == 'payFail'">支付失败，请重新下单</text>
			<!-- <text class="desc" v-if="order.status == 'payFail'">待付款，超时订单自动关闭</text> -->
			<text class="time" v-if="order.status == 'paySuccess'&&order.flex_segment2==1">待发货</text>
			<text class="time" v-if="order.status == 'paySuccess'&&order.flex_segment2!=1">审核中</text>
			<!-- <text class="desc" v-if="order.status == 'paySuccess'">备货中，请耐心等待</text> -->
			<text class="time" v-if="order.status == 'sending'">发货中</text>
			<!-- <text class="desc" v-if="order.status == 'sending'">配送中，请耐心等待</text> -->
			<text class="time" v-if="order.status == 'arrive'">待收货</text>
			<!-- <text class="desc" v-if="order.status == 'arrive'">商品已到达，请及时上门提货</text> -->
			<text class="time" v-if="order.status == 'completed'">已完成</text>
			<text class="time" v-if="order.status == 'using'">租用中</text>
			<!-- <text class="desc" v-if="order.status == 'completed'">已完成交易，期待下次继续购买</text> -->
			<text class="time" v-if="order.status == 'cancel'">已取消</text>
			<!-- <text class="desc" v-if="order.status == 'cancel'">订单已取消，请重新下单</text> -->
			<text class="time" v-if="order.status == 'shortage'">缺货取消</text>
			<!-- <text class="desc" v-if="order.status == 'shortage'">{order.msg||'订单已取消，请重新下单'}</text> -->
		</view>

		<view class="tack-info">
			<view class="tack-row">
				<image src="/static/chaoyuezu/location.png" class="img-loc" />
				<view class="info-wrap">
					<view>
						<text v-if="!isoneprice">租户：</text>
						<text v-else>用户：</text>
						<text style="color: black; margin-right: 40rpx;">{{order.name}}</text>
						<text style="color: black;">{{order.mobile}}</text>
					</view>
					<view>
						<text>地址：</text>
						<text style="color: black;">{{order.address}}</text>
					</view>
				</view>
			</view>
		</view>

		<template v-if="config.devliery_plan_switch === '1'">
			<view class="product" v-if="arrive.length > 0">
				<view class="col-top">
					<text class="time">待签收</text>
					<text class="num">共{{ arriveNum }}件商品</text>
				</view>
				<view class="items" v-for="(item, index) in arrive" :key="index">
					<view class="item" style="height: 180upx;" @tap="detail(item.goods_id)">
						<image :src="item.image" />
						<text class="title">{{ item.name }}</text>
						<text class="tag">数量：{{ item.num }}</text>
						<!-- <text class='tag' v-if="item.attr_names">规格：{{item.attr_names}}</text> -->
						<view class="bottom">
							<text></text>
							<button class="contact pick" @click.stop="pickUp(item.id, item.delivery_id)">确认签收</button>
						</view>
					</view>
				</view>
			</view>
		</template>

		<view class="product">
			<view class="col-top">
				<text class="time">超悦租商城</text>
				<image src="/static/ic_arrow_right.png" style="height: 24rpx; width: 24rpx; margin-left: 8rpx;" />
				<!-- <text class="num">共{{ productNum }}件商品</text> -->
			</view>
			<view class="items" v-for="(item, index) in order.ordergoodses" :key="index">
				<view class="item" @tap="detail(item.goods_id)">
					<image :src="image_root + item.pic" />
					<!-- <text class="title">{{ item.goods_name }}</text>
          <text class="tag">数量：{{ item.num }}</text>
          <text class="tag" v-if="item.attr_names">规格：{{ item.attr_names }}</text>-->
					<view class="center">
						<text class="title">{{ item.goods_name }}</text>
						<text class="tag" style="color: #666666;" v-if="item.attr_names">规格：{{ item.attr_names }}</text>
					</view>
					<view class="right">
						<text class="tag">￥{{item.goods_name == '碎屏宝' || item.sku_goods_price == 0?  item.amount : item.sku_goods_price/100}}</text>
						<text class="tag" style="color: #999">x {{ item.num }}</text>
					</view>
					<!-- <view class="bottom">
            <text>实付金额：</text>
            <text class="price">￥{{ item.amount }}</text>
            <button
              class="contact"
              @click.stop="plan(item.goods_id)"
              v-if="config.devliery_plan_switch === '1'"
            >配送计划</button>
          </view>-->
				</view>
			</view>
			<!-- 增值服务 -->
			<view class="items" v-for="(item, index) in JSON.parse(order.prefer_json)" :key="index">
				<view class="item" @tap="detail(item.goods_id)">
					<image :src="image_root + item.pic" />
					<!-- <text class="title">{{ item.goods_name }}</text>
			<text class="tag">数量：{{ item.num }}</text>
			<text class="tag" v-if="item.attr_names">规格：{{ item.attr_names }}</text>-->
					<view class="center">
						<text class="title">{{ item.name }}</text>
						<text class="tag" style="color: #666666;" v-if="item.attr_names">规格：{{ item.attr_names }}</text>
					</view>
					<view class="right">
						<text class="tag">￥{{item.price}}</text>
						<text class="tag" style="color: #999">x {{order.ordergoodses[0].num}}</text>
					</view>
					<!-- <view class="bottom">
			  <text>实付金额：</text>
			  <text class="price">￥{{ item.amount }}</text>
			  <button
			    class="contact"
			    @click.stop="plan(item.goods_id)"
			    v-if="config.devliery_plan_switch === '1'"
			  >配送计划</button>
			</view>-->
				</view>
			</view>
			<view class="price-block">




				<!-- <block v-if="origin_price">
					<view class="row">
						<text>商品总额</text>
						<text class="right">¥ {{order.amount-order.delivery_money}}</text>
					</view>
					<view class="row">
						<text>运费</text>
						<text class="right">¥ {{order.delivery_money}}</text>
					</view>
					<view class="row">
						<text>订单合计</text>
						<text class="right">¥ {{order.amount}}</text>
					</view>
				</block>
				<block v-else>
					<view class="row">
						<text>总租金</text>
						<text class="right">¥ {{allzj}}</text>
					</view>
					<view class="row">
						<text>运费</text>
						<text class="right">¥ {{order.delivery_money}}</text>
					</view>
					<view class="row">
						<text>订单合计</text>
						<text class="right">¥ {{allmount}}</text>
					</view>
				</block> -->





				<view style="width: 100%; height: 1rpx; background:#f4f4f4; margin: 20rpx 0;"></view>
				<!--<view class="row">-->
				<!--<text>未付租金</text>-->
				<!--<text class="right">¥ {{order.owing_amount.toFixed(2)}}</text>-->
				<!--</view>-->
				<block v-if="!isoneprice">
					<view class="row" v-if="insurance > 0">
						<text>月租金</text>
						<text class="right">¥ {{(order.pay_amount - (insurance * order.ordergoodses[0].num) - order.use_deposit_money - order.bargain_fee - (JSON.parse(order.prefer_json) !== null && JSON.parse(order.prefer_json) !== undefined &&JSON.parse(order.prefer_json).length > 0 && JSON.parse(order.prefer_json)[0].rent_type == 1?0:order.prefer_amount)).toFixed(2)}}</text>
					</view>
					<view class="row" v-if="insurance == 0">
						<text>月租金</text>
						<text class="right">¥ {{(order.pay_amount - (insurance * order.ordergoodses[0].num) - order.use_deposit_money - order.bargain_fee - (JSON.parse(order.prefer_json) !== null && JSON.parse(order.prefer_json) !== undefined && JSON.parse(order.prefer_json).length > 0 &&JSON.parse(order.prefer_json)[0].rent_type == 1?0:order.prefer_amount)).toFixed(2)}}</text>
					</view>
					<view class="row" v-if="insurance > 0">
						<text>碎屏宝</text>
						<text class="right">¥ {{(insurance * order.ordergoodses[0].num).toFixed(2)}}</text>
					</view>
					<view class="row" v-if="order.bargain_fee && order.bargain_fee != 0">
						<text>溢价费</text>
						<text class="right">¥ {{order.bargain_fee.toFixed(2)}}</text>
					</view>
					<view class="row">
						<text>押金</text>
						<text class="right" v-if="!order.use_deposit_money">待审核</text>
						<text class="right" v-if="order.use_deposit_money">¥ {{order.use_deposit_money.toFixed(2)}}</text>
					</view>
				</block>
				<view class="bottom-right" v-if="!isoneprice">
					<text>实付款：</text>
					<text class="final-price">¥ {{order.pay_amount.toFixed(2)}}</text>
				</view>
				<view class="bottom-right" v-else>
					<text>总金额：</text>
					<text class="final-price">¥ {{allmoney}}</text>
				</view>
			</view>
		</view>

		<view class="order-info">
			<!-- <view class="col-top">
        <text>订单信息</text>
      </view>-->
			<view class="info">
				<view class="row" v-if="order.flex_segment3">
					<text class="name">IMEI</text>
					<text class="content">{{ order.flex_segment3 }}</text>
					<!-- <text class="row-right" @click="copyOrderNumber">复制</text> -->
				</view>
				<view class="row">
					<text class="name">订单编号</text>
					<text class="content">{{ order.order_no }}</text>
					<!-- <text class="row-right" @click="copyOrderNumber">复制</text> -->
				</view>
				<view class="row" v-if="order.time">
					<text class="name">下单时间</text>
					<text class="content">{{ order.pay_time }}</text>
				</view>
				<view class="row" v-if="order.kd_company_name">
					<text class="name">物流公司</text>
					<text class="content">{{ order.kd_company_name }}</text>
					<!-- <text class="row-right" @click="copyOrderNumber">复制</text> -->
				</view>
				<view class="row" v-if="order.send_orderno">
					<text class="name">物流单号</text>
					<text class="content">{{ order.send_orderno }}</text>
					<!-- <text class="row-right" @click="copyOrderNumber">复制</text> -->
				</view>
			</view>
		</view>
		<view style="height:120rpx; width:100%;"></view>

		<view class="buttons">
			<!-- <block v-if="order.state=='unPay'&&order.expire_time>nowTime">
      <!-- #ifdef MP-WEIXIN-->
			<!-- <view class="button pay" @tap="payNow(false)">立即支付</view> -->
			<!-- #endif -->
			<!-- #ifdef APP-PLUS || H5 -->
			<!-- <view class="button pay" @tap="toOrder()">重新下单</view> -->
			<!-- #endif -->
			<!-- </block> -->

			<!-- <block v-if="order.state == 'unPay' && order.flex_segment2=='1'">
				<view class="button" style="background: #bbbbbb;color: #525252;" @tap="cancelOrder()">取消订单</view>
			</block> -->

			<!-- <view
        v-if="order.state=='payFail'&&order.expire_time>nowTime"
        class="button pick"
        @tap="toOrder()"
        style="width: 100%;"
      >重新下单</view>-->

			<view v-if="order.state == 'unPay' && order.flex_segment2=='1'" class="button blue" @tap="payNow()" style="width: 100%;">去支付</view>

			<view v-if="order.state == 'unPay' && order.flex_segment2!='1'" class="button blue" @tap="cancelOrder()" style="width: 100%;">取消订单</view>

			<view v-if="order.state == 'arrive' || order.state == 'sending'" class="button blue" @tap="confirmGoods()" style="width: 100%;">确认收货</view>

			<view v-if="order.state === 'completed' || order.state === 'cancel'" class="button" @tap="home()" style="width: 100%;">返回首页</view>
			<!-- <view class="button pick" @tap="home()" style="width: 100%;">返回首页</view> -->
			<!-- <view
        class="button"
        @tap="deleteOrder"
        v-if="order.state=='completed'|order.state=='cancel'|(order.state=='unPay'&order.expire_time<=nowTime)"
      >删除订单</view>-->
		</view>
		<view @click="home()" class="round bg-gray flex-container align-center justify-center" style="opacity: 0.7;position: fixed;bottom: 110rpx;right: 20rpx;z-index: 999;width: 80rpx;height: 80rpx;">
			<text class="icon-home" style="font-size: 45rpx; color: #ef4136;"></text>
		</view>
		<pay-dialog :show="showPayDialog" @selectWeixinPay="selectWeixinPay" @close="closePayDialog"></pay-dialog>
		<myDialog confirmColor="var(--blue)" :title="dialogTitle" :content="dialogContent" :dialog-show="dialogShow"
		 @cancelButton="dialogShow=false" @confirmButton="comfirmDialog()"></myDialog>
	</view>
</template>

<script>
	import Config from '../../common/js/Config.js'
	import Util from '../../common/js/util.js'
	import Timer from '../../common/js/timeCounter.js'
	import Toast from '../../common/js/toast.js'
	import Pay from '../../common/js/pay.js'
	import Auth from '../auth'

	import PayDialog from '../../components/yx_dialog/myPayDialog.vue'
	import {
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				isoneprice: false,
				allmoney: 0,
				id: '',
				origin_price: 0,
				dialogTitle: "",
				dialogContent: "",
				dialogShow: false,
				dialogOp: '',
				surplusTime: '',
				order: {},
				productNum: 0,
				expectTime: '',
				insurance: 0,
				nowTime: 0,
				image_root: '',
				timer: Object,
				showPayDialog: false,
				isWeiXinPay: true,
				arriveNum: 0,
				arrive: [],
				config: {
					devliery_day_setting: '0', //运达天数
					devliery_cost_setting: '0', //运费
					devliery_home_switch: '0', //开启送到家
					devliery_plan_switch: '0', //开启配送计划
					devliery_leader_switch: '0', //开启送到提货点
				},
				kd_companys: [{
						name: "京东",
						code: "jd"
					},
					{
						name: "百世快递",
						code: "HTKY"
					},
					{
						name: "EMS",
						code: "EMS"
					},
					{
						name: '韵达快递',
						code: 'YD'
					},
					{
						name: '顺丰速运',
						code: 'SF'
					}
				]
			}
		},
		mixins: [Timer, Toast, Pay, Auth],
		components: {
			PayDialog,
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			},
			globalI() {
				return this.$store.state.globalI
			},
			allmount() {
				let allmount = 0
				this.order.ordergoodses.forEach((item, index) => {
					if (item.goods_name == '碎屏宝' || item.sku_goods_price == 0) {
						allmount += item.amount
					} else {
						allmount += item.sku_goods_price / 100
					}

				})
				return allmount
			},
			allzj() {
				let allzj = 0
				this.order.ordergoodses.forEach((item, index) => {
					if (item.goods_name !== '碎屏宝') {
						allzj += item.price
					}
				})
				console.log(this.order)
				return allzj
			}
		},
		onLoad(options) {
			console.log(options)
			this.setUuid(Config.PLAT_UUID)
			this.nowTime = Date.parse(new Date()) / 1000
			console.log('nowTime', this.nowTime)
			if (options.key) {
				this.id = options.key
				this.getOrderDetail()
			}
			options.orderNo && this.getOrderDetailByNo(options.orderNo)
		},
		methods: {
			...mapMutations(['setUuid']),
			updateRentOrderInfo: function(order) {
				let self = this
				let getData = {
					order_key: order.order_key,
					order_type: ""
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.updateRentOrderInfo, getData).then(res => {
					res = res.data
					if (res.code === 0) {
						self.order = Object.assign(res.data)
					}
				})
			},
			getOrderDetailByNo: function(order_no) {
				let self = this
				let data = {
					orderNo: order_no,
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getOrder, data).then(res => {
					res = res.data
					console.log(res);
					res.ordergoodses.forEach((item, index) => {
						console.log(item)
						if (item.attr_names.indexOf('一口价') !== -1) {
							self.isoneprice = true
						}
					})
					if (res.code === 0) {
						self.id = res.data.id
						self.order = res.data
						self.order.pay_time = self.timestampToTime(self.order.pay_time)
						self.image_root = res.other.img_root
						self.productNum = self.getProductNum(res.data.ordergoodses)
						// self.expectTime = self.timestampToTime(new Date(res.data.create_time).getTime())
						if (res.data.state === 1) {
							self.cutDown2(res.data.create_time)
						}
						let arriveArr = []
						this.arriveNum = 0
						for (let i = 0; i < res.data.arrive.length; i++) {
							this.arriveNum += res.data.arrive[i].plan_num
							arriveArr.push({
								id: res.data.arrive[i].id,
								goods_id: res.data.arrive[i].goods_id,
								delivery_id: res.data.arrive[i].delivery_id,
								name: res.data.arrive[i].goods_name,
								image: res.other.img_root + res.data.arrive[i].pic,
								date: Util.getDate(res.data.arrive[i].plan_time),
								num: res.data.arrive[i].plan_num,
							})
						}
						self.arrive = arriveArr
					}
				})
			},
			getOrderDetail: function() {
				let self = this
				let data = {
					order_key: self.id,
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.orderDetail, data).then(res => {
					res = res.data
					if (res.code === 0) {
						console.log(res)
						for (let i = 0; i < res.data.ordergoodses.length; i++) {
							if (String(res.data.ordergoodses[i].attr_names).indexOf('一口价') !== -1) {
								self.isoneprice = true
							}
						}
						if (res.data.status) {
							res.data.state = res.data.status
						}
						self.kd_companys.forEach((company, index) => {
							if (res.data.send_kd_code === company.code) {
								res.data.kd_company = company.name
							}
						})
						self.order = res.data
						res.data.ordergoodses.forEach((item, index) => {
							console.log(Number(item.goods_name == '碎屏宝' || item.sku_goods_price == 0 ? item.amount : item.sku_goods_price /
								100))
							self.allmoney += item.goods_name == '碎屏宝' || item.sku_goods_price == 0 ? item.amount : item.sku_goods_price /
								100
						})
						console.log(self.allmoney)
						console.log(self.order, 'order')
						self.image_root = res.other.img_root
						// if (self.order.flex_segment2==='1' && !self.order.flex_segment3) {
						//  self.updateRentOrderInfo(self.order)
						// }
						self.productNum = self.getProductNum(res.data.ordergoodses)
						// self.expectTime = self.timestampToTime(new Date(res.data.create_time).getTime())

						let origin_price = 0
						res.data.ordergoodses.forEach(item => {
							if (item.type === 1) {
								origin_price = item.origin_price
							}
						})
						self.origin_price = origin_price
						let insurance = 0
						console.log(res.data.ordergoodses);
						res.data.ordergoodses.forEach((good, gIndex) => {
							if (good.type === 4) {
								insurance = good.price
							}
						})
						self.insurance = insurance
						console.log(self.insurance);
					}
				})
			},
			toDelivery: function() {
				uni.navigateTo({
					url: '/pages/order/logistics?order_no=' + this.order.send_orderno,
				})
			},
			getProductNum: function(list) {
				var num = 0
				for (var i = 0; i < list.length; i++) {
					num += list[i].num
				}
				return num
			},
			cutDown2: function(createTime) {
				let self = this
				var totalSecond = Date.parse(createTime.replace(/-/g, '/')) / 1000 - Date.parse(new Date()) / 1000 + 1800

				self.timer = setInterval(
					function() {
						// 秒数
						var second = totalSecond

						// 天数位
						var day = Math.floor(second / 3600 / 24)
						var dayStr = day.toString()
						if (dayStr.length == 1) dayStr = '0' + dayStr

						// 小时位
						var hr = Math.floor((second - day * 3600 * 24) / 3600)
						var hrStr = hr.toString()
						if (hrStr.length == 1) hrStr = '0' + hrStr

						// 分钟位
						var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60)
						var minStr = min.toString()
						if (minStr.length == 1) minStr = '0' + minStr

						// 秒位
						var sec = second - day * 3600 * 24 - hr * 3600 - min * 60
						var secStr = sec.toString()
						if (secStr.length == 1) secStr = '0' + secStr

						self.surplusTime = minStr + ':' + secStr
						totalSecond--
						if (totalSecond < 0) {
							self.clearTimer()
							self.surplusTime = '订单已取消'
						}
					}.bind(self),
					1000
				)
			},
			clearTimer: function() {
				if (!Util.isEmptyObject(this.timer)) clearInterval(this.timer)
			},
			toOrder: function() {
				uni.redirectTo({
					url: '/pkChaoYueZu/order/create',
				})
			},
			cancelOrder: function() {
				let self = this
				this.dialogTitle = '提示'
				this.dialogContent = '确认取消该订单吗？'
				this.dialogShow = true
				this.dialogOp = 'cancelOrderInDetail'
			},
			cancelOrderReal() {
				let self = this
				let data = {
					order_key: self.id,
				}
				self.toast({
					desc: '处理中...',
					type: 'loading',
					time: 8000,
				})
				self.$Phttp.post(Config.JAVA_SAAS_URLS.cancelOrder, data).then(res => {
					res = res.data
					if (res.code === 0) {
						self.toast({
							type: 'success',
							desc: '取消成功',
						})
						setTimeout(() => {
							uni.navigateBack({
								delta: 1,
							})
						}, 500)
					}
				})
			},
			confirmGoods: function() {
				let self = this
				this.dialogTitle = '提示'
				this.dialogContent = '确认收到货了吗？'
				this.dialogShow = true
				this.dialogOp = 'confirmGoods'
			},
			confirmGoodsReal: function() {
				let self = this
				let data = {
					order_id: self.id,
				}
				self.toast({
					desc: '处理中...',
					type: 'loading',
					time: 8000,
				})
				self.$Phttp
					.post(Config.JAVA_SAAS_URLS.completeOrder, {
						order_key: self.id,
					})
					.then(res => {
						res = res.data
						if (res.code === 0) {
							self.toast({
								type: 'success',
								desc: '收货成功',
							})
							setTimeout(() => {
								uni.navigateBack({
									delta: 1,
								})
							}, 500)
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
					desc: '正在生成...',
					type: 'loading',
					time: 8000,
				})
				let data = {
					user_key: self.userInfo.user_key,
					token: self.userInfo.access_token,
					order_key: self.id,
					user_origin: 'zulin'
				}
				data = Object.assign(data, {
					order_type: self.isWeiXinPay ? 'wxapppay' : 'alipay',
				})

				data.order_type = "wxapppay"
				self.$Phttp.post(Config.JAVA_SAAS_URLS.payOrder, data).then(res => {
					self.toast(true)
					res = res.data
					if (res.code === 0) {
						let payData = res.data.paydata
						let orderInfo = res.data.orderInfo
						// #ifdef APP-PLUS
						orderInfo = Object.assign(orderInfo, {
							provider: 'wxpay',
						})
						// #endif
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
			getConfig: function() {
				let self = this
				self.$http.post(Config.URLS.orderSetting, {}).then(res => {
					res = res.data
					if (res.code === 0) {
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
					},
				})
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
				this.dialogTitle = '提示'
				this.dialogContent = '确定删除该订单吗？'
				this.dialogShow = true
				this.dialogOp = 'deleteOrder'
			},
			deleteOrderReal: function() {
				let self = this
				let data = {
					i: self.globalI,
					user_key: self.userInfo.user_key,
					token: self.userInfo.access_token,
					order_id: self.order.id,
				}
				self.toast({
					desc: '处理中...',
					type: 'loading',
					time: 8000,
				})
				self.$http.post(Config.URLS.delOrder, data).then(res => {
					res = res.data
					if (res.code === 0) {
						self.toast({
							type: 'success',
							desc: '删除成功',
							time: 1000,
						})
						setTimeout(() => {
							uni.navigateBack({
								delta: 1,
							})
						}, 300)
					}
				})
			},
			pickAll() {
				let ids = []
				if (this.arrive.length === 0) {
					uni.showToast({
						title: '商品已经全部提完',
						icon: 'none',
					})
					return
				}
				let delivery_id = ''
				this.arrive.forEach((item, idx) => {
					ids.push(item.id)
					delivery_id = item.delivery_id
				})
				let plan_ids = ids.join(',')
				this.pickUp(plan_ids, delivery_id)
			},
			pickUp(ids, delivery_id) {
				let self = this
				let data = {
					plan_ids: ids,
					delivery_id: delivery_id,
				}
				uni.showLoading({
					title: '处理中...',
				})
				self.$http.post(Config.URLS.userPickUp, data).then(res => {
					res = res.data
					if (res.code === 0) {
						uni.hideLoading()
						self.getOrderDetail()
					}
				})
			},
			comfirmDialog() {
				switch (this.dialogOp) {
					case "cancelOrderInDetail":
						this.cancelOrderReal()
						break;
					case "confirmGoods":
						this.confirmGoodsReal()
						break;
					case "deleteOrder":
						this.deleteOrderReal()
						break;
					case "takeDelivery":
						this.takeDelivery(this.dialogIdx, false)
				}
			},
			plan(goodsId) {
				uni.navigateTo({
					url: 'planDetail?goodsId=' + goodsId + '&orderId=' + this.id,
				})
			},
			detail(id) {
				// uni.navigateTo({
				// 	url:'/pages/index/product?id='+id
				// })
			},
			home() {
				uni.switchTab({
					url: '/pkChaoYueZu/index/main',
				})
			},
		},
		onUnload() {
			this.clearTimer()
		},
	}
</script>

<style>
	page {
		background: #f6f6f6;
	}

	.top {
		width: 100%;
		height: 180rpx;
		background: linear-gradient(180deg, rgba(82, 171, 252, 1) 0%, rgba(6, 135, 255, 1) 100%);
		display: flex;
		padding-top: 130rpx;
		flex-direction: column;
		align-items: center;
	}

	.top .time {
		font-size: 40rpx;
		font-weight: bold;
		color: #ffffff;
	}

	.top .desc {
		font-size: 24rpx;
		font-weight: 500;
		color: #f6f6f6;
		margin-top: 20rpx;
	}

	.tack-info {
		width: 100%;
		/* margin-left: 24rpx;
  margin-right: 24rpx; */
		/* height: 330rpx; */
		background: #fff;
		/* border-radius: 20rpx; */
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		margin-top: -50rpx;
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

	.tack-info .tack-row {
		display: flex;
		flex-direction: row;
		width: 100%;
		padding: 40rpx 0;
	}

	.tack-info .tack-row .img-loc {
		width: 68rpx;
		height: 68rpx;
		margin: 0 30rpx;
	}

	.tack-info .tack-row .info-wrap {
		display: flex;
		flex-direction: column;
		color: #999;
		font-size: 26rpx;
	}

	.product {
		width: 100%;
		/* margin-left: 24rpx;
  margin-right: 24rpx; */
		background: #fff;
		/* border-radius: 20rpx; */
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
		justify-content: flex-start;
	}

	.product .col-top .time {
		font-size: 30rpx;
		/* font-weight: 500; */
		color: #222;
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
		border-bottom: 1rpx solid #f4f4f4;
	}

	.product .items .item {
		width: calc(100% - 40rpx);
		height: 130rpx;
		padding: 20rpx;
		position: relative;
		display: flex;
		flex-direction: row;
	}

	.product .items .item .center {
		flex: 1;
	}

	.product .items .item .right {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.product .items .item image {
		width: 130rpx;
		height: 130rpx;
		border-radius: 20rpx;
		float: left;
	}

	.product .items .item .title {
		/* width: calc(100% - 160rpx); */
		width: 400rpx;
		font-size: 28rpx;
		color: #2f3640;
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
		bottom: 0rpx;
	}

	.product .items .item .bottom text {
		font-size: 20rpx;
		color: #333;
		font-weight: 500;
	}

	.product .items .item .bottom .price {
		font-size: 28rpx;
		color: #e84118;
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
		border: 1rpx solid #0cc112;
		background: #FF4230;
		color: #fff;
	}

	.product .price-block {
		margin: 20rpx;
		display: flex;
		flex-direction: column;
		border-bottom: 1rpx solid #f4f4f4;
		padding-bottom: 20rpx;
	}

	.product .price-block .row {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		color: #666;
	}

	.product .price-block .row .right {
		color: #222;
		font-size: 22rpx;
		font-weight: bold;
	}

	.product .price-block .bottom-right {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		color: #222;
		font-size: 28rpx;
		font-weight: bold;
	}

	.product .price-block .bottom-right .final-price {
		color: #e84118;
	}

	.order-info {
		width: 100%;
		/* margin-left: 24rpx;
  margin-right: 24rpx; */
		background: #fff;
		/* border-radius: 20rpx; */
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
		color: #666;
	}

	.order-info .info .row .content {
		width: calc(100% - 240rpx);
		padding-left: 30rpx;
		border-left: solid 1rpx #f6f6f6;
	}

	.order-info .info .row .row-right {
		width: 66rpx;
		height: 30rpx;
		line-height: 30rpx;
		border-radius: 15rpx;
		border: 1rpx solid grey;
		text-align: center;
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

	.buttons .button.blue {
		color: #fffFFF;
		background: linear-gradient(180deg, rgba(82, 171, 252, 1) 0%, rgba(6, 135, 255, 1) 100%);
	}

	.buttons .button.pay {
		background: #ef4136;
		color: #fff;
	}

	.buttons .button.pick {
		background: #ef4136;
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
