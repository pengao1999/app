<template>
	<view :style="'height:'+winHeight+'px;width:100%'">
		<view class="swiper-tab">
		  <view v-for="(item, index) in nav" :key="index" :class="{'swiper-tab-item':true,'active':curIndex===item.status-1}" @tap="clickTab(item.status-1)">{{item.title}}</view>
		</view>
		<swiper :current="curIndex" :duration="50" @change="swiperTab">
		  <!-- 全部 -->
		  <swiper-item v-for="(item,index) in nav" :key="index" v-if="showSwiper">
			<view class="no-data" v-if="olist[index]=== undefined || olist[index].length===0">
			  <image src="../../static/empty.png" class="no-data-img"></image>
			  <view class="text">暂无配送</view>
			</view>
			<scroll-view scroll-y="true" :style="'height:'+winHeight+'px;'" upper-threshold="50" @scrolltolower="getOrders(curIndex, curPage[curIndex], false)" v-else>
				<view class='items'>
					<view class='item' v-for="(order, idx) in olist[index]" :key="idx">
					  <view class="top">
						  <view class="order-no"></view>
						  <view class="status" v-if="order.state===1">待支付</view>
						  <view class="status" v-if="order.state===2">待配送</view>
						  <view class="status" v-if="order.state===3">配送中</view>
						  <view class="status" v-if="order.state===4">已送达</view>
						  <view class="status" v-if="order.state===5">已签收</view>
					  </view>
					  <view class="content">
						  <view class="col">
							  <view class="name">配送时间</view>
							  <view class="value">{{order.plan_time}}</view>
						  </view>
						  <view class="col">
							  <view class="name">数量</view>
							  <view class="value">{{order.plan_num}}</view>
						  </view>
						  <view class="col">
							  <view class="btn edit" style="margin-left: auto;" @click="showEditPlanDialog(order,idx,curIndex)" v-if="order.state<3">修改</view>
							  <!-- <view class="btn delete">删除</view> -->
						  </view>
					  </view>
					</view>
					<uni-load-more :loadingType="loadingType" :contentText="contentText"></uni-load-more>
					<view style="height: 150upx;"></view>
				</view>
			</scroll-view>
		  </swiper-item>
		</swiper>
		<pay-dialog :show="showPayDialog" @selectWeixinPay="selectWeixinPay" @close="closePayDialog"></pay-dialog>
		<edit-plan-dialog :show="showEditPlan" :item="editItem" :index="index" :curIndex="curIndex" @close="closeEditPlanDialog"></edit-plan-dialog>
	</view>
</template>

<script>
	import Config from '../../common/js/Config.js'
	import Util from '../../common/js/util.js'
	import Toast from '../../common/js/toast.js'
	import Pay from '../../common/js/pay.js'

	import UniLoadMore from '../../components/uni-load-more.vue'
	import PayDialog from '../../components/yx_dialog/myPayDialog.vue'
	import EditPlanDialog from '../../components/yx_dialog/editPlanDialog.vue'
	export default {
		data() {
			return {
				id: '',
				isLoading: false,
				shouldReload: false, //再次进入时，是否需要刷新
				leader_key: -1,
				nav: [{
				  title: "待支付",
				  status: 1
				}, {
				  title: "待配送",
				  status: 2
				}, {
				  title: "配送中",
				  status: 3
				}, {
				  title: "已送达",
				  status: 4
				}, {
				  title: "已签收",
				  status: 5
				}],
				olist: [[],[],[],[],[]],
				curPage: [1,1,1,1,1],
				curIndex: 0,
				goodsId:0,
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
				isWeiXinPay: true,
				showEditPlan:false,
				editItem:{},
				index:0
			}
		},
		mixins:[Toast, Pay],
		components: {UniLoadMore, PayDialog, EditPlanDialog},
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
			this.curIndex = parseInt(options.status-1)
			this.goodsId = parseInt(options.goodsId)
			this.orderId = parseInt(options.orderId)
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
				self.getOrders(options.status, 1, true)

				uni.getSystemInfo({
					success(system) {
						if (system.errMsg === "getSystemInfo:ok") {
							self.systemInfo = system
						}
					}
				})
			},
			getOrders: function(status, page, showSwiper) {
				let self = this
				if (self.isLoading) return
				self.isLoading = true
				if (self.curPage[status] === -1) {
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
					page: self.curPage[status-1],
					limit: Config.PAGE_LIMIT,
					goodsId:self.goodsId,
					orderId:self.orderId,
					state: status
				}

				self.$http.post(Config.URLS.orderDeliveryPlan, data).then((res) => {
					self.toast(true)
					self.isLoading = false
					res = res.data
					if (res.code === 0) {
						if (res.data.length !== 0) {
							self.curPage[status-1]++
						} else {
							self.curPage[status-1] = -1
							self.showSwiper = true
							return
						}

						self.image_root = res.other.img_root
						var list = res.data

						if (list.length < Config.PAGE_LIMIT) {
							self.loadingType = 2
						} else {
							self.loadingType = 1
						}

						let orders = self.olist
						orders[status-1] = orders[status-1].concat(list)
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
				this.curIndex = curIndex
				if (this.olist[curIndex].length === 0 && this.curPage[curIndex] === 1) {
					console.log("22222")
					this.getOrders(curIndex+1, this.curPage[curIndex], true)
				}
			},

			reloadCurrentPage: function() {
				this.curPage[this.curIndex] = 1
				let orders = this.olist
				orders[this.curIndex] = []
				this.olist = Object.assign({}, orders)
				this.getOrders(this.curIndex, 1, true)
			},
			showEditPlanDialog(item,index){
				this.index=index
				this.editItem=item
				this.showEditPlan=true;
			},
			closeEditPlanDialog:function (obj) {
				this.showEditPlan=false
				if(obj){
					console.log(JSON.stringify(obj))
					console.log(JSON.stringify(this.olist[obj.curIndex][obj.index]))
					this.olist[obj.curIndex][obj.index].plan_time=obj.plan_time
					console.log(JSON.stringify(this.olist[obj.curIndex][obj.index]))
				}
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

	.items .item .top .order-no{
	  font-size:30rpx;
	  font-weight:400;
	  color: #222;
	}

	.items .item .top .status{
	  font-size:30rpx;
	  color: #666;
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
	  padding: 30rpx;
	  display: flex;
	  flex-direction: column;
	}

	.items .item .content .col{
	  width: 100%;
	  height: 60rpx;
	  line-height: 60rpx;
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	}

	.items .item .content .col .name{
		font-size: 28rpx;
		color: #222;
	}

	.items .item .content .col .value{
		font-size: 28rpx;
		color: #666;
	}

	.items .item .content .btn.delete{
	  width:140rpx;
	  height:48rpx;
	  line-height: 48rpx;
	  text-align: center;
	  border:1rpx solid #888888;
	  border-radius:25rpx;
	  font-size:22rpx;
	  font-weight:500;
	  color: #888888;
	  margin-left: 20rpx;
	}

	.items .item .content .btn.edit{
	  width:140rpx;
	  height:50rpx;
	  line-height: 50rpx;
	  text-align: center;
	  border-radius:25rpx;
	  font-size:22rpx;
	  font-weight:500;
	  background: #E84118;
	  color: #fff;
	}
</style>
