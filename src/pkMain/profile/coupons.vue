<template>
	<view :style="'height:'+winHeight+'px;width:100%'">
		<view class="swiper-tab">
		  <view class="nav-container">
			<view v-for="(item, index) in nav" :key="index" class="swiper-tab-item" @tap="clickTab(item.status)">{{item.title}}</view>
		  </view>
		  <view class="line-controller" :style="'transform:translateX('+100*curIndex+'%);'">
		  	<view class="line"></view>
		  </view>
		</view>
		<swiper :current="curIndex" duration="300" @change="swiperTab">
		  <!-- 全部 -->
		  <swiper-item v-for="(item,index) in nav" :key="index" v-if="showSwiper">
			<view class="no-data" v-if="coupons[index]=== undefined || coupons[index].length===0">
			<!-- <view class="no-data" v-if="false"> -->
			  <image src="../../static/empty.png" class="no-data-img"></image>
			  <view class="text">暂无优惠券</view>
			</view>
			<scroll-view scroll-y="true" :style="'height:'+winHeight+'px;'" upper-threshold="50" @scrolltolower="getCoupons(curIndex, curPage[curIndex], false)" v-else>
				<view class='items'>
					<coupon-card v-for="(coupon, idx) in coupons[index]" :coupon="coupon" :showBtn="true" :isGet="false" handlerText="已过期" btnText="立即使用" :key="idx"></coupon-card>
					<uni-load-more :loadingType="loadingType" :contentText="contentText"></uni-load-more>
					<view style="height: 150upx;"></view>
				</view>
			</scroll-view>
		  </swiper-item>
		</swiper>
	</view>
</template>

<script>
	import Config from '../../common/js/Config.js'
	import Util from '../../common/js/util.js'
	import Toast from '../../common/js/toast.js'
	import Pay from '../../common/js/pay.js'

	import UniLoadMore from '../../components/uni-load-more.vue'
	import CouponCard from '../../components/yx_view/myCouponCard.vue'
	export default {
		data() {
			return {
				id: '',
				isLoading: false,
				shouldReload: false, //再次进入时，是否需要刷新
				leader_key: -1,
				nav: [{
				  title: "未使用",
				  status: 0
				}, {
				  title: "使用纪录",
				  status: 1
				}, {
				  title: "已过期",
				  status: 2
				}],
				coupons: [[],[],[]],
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
			}
		},
		mixins:[Toast, Pay],
		components: {UniLoadMore, CouponCard},
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
			this.curIndex = parseInt(options.status)
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
				self.getCoupons(options.status, 1, true)

				uni.getSystemInfo({
					success(system) {
						if (system.errMsg === "getSystemInfo:ok") {
							self.systemInfo = system
						}
					}
				})
			},
			getCoupons: function(status, page, showSwiper) {
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
					user_key: self.userInfo.user_key,
					token: self.userInfo.access_token,
					page: self.curPage[status],
					limit: Config.PAGE_LIMIT,
					state: status
				}
				self.$http.post(Config.URLS.myCoupons, data).then((res) => {
					self.toast(true)
					self.isLoading = false
					res = res.data
					if (res.code === 0) {
						if (res.data.length !== 0) {
							self.curPage[status]++
						} else {
							self.curPage[status] = -1
							self.showSwiper = true
							return
						}

						self.image_root = res.other.img_root

						var list = res.data
						if (list.length < Config.PAGE_LIMIT) {
							self.curPage[status] = -1
							self.loadingType = 2
						} else {
							self.loadingType = 1
						}
						let coupons = self.coupons
						coupons[status] = coupons[status].concat(list)

						self.coupons = Object.assign({}, coupons)
						for (var i = 0; i < 4; i++) {
								setTimeout(()=>{
									self.coupons = Object.assign({}, coupons)
								}, 200)
						}
						self.showSwiper = true
					}
				})
			},
			swiperTab: function(e) {
				this.clickTab(e.detail.current)
			},
			clickTab: function(curIndex) {
				console.log('length:'+this.coupons[curIndex].length+',curPage[curIndex]:'+this.curPage[curIndex] + ',curIndex'+curIndex)
				this.curIndex = curIndex
				if (this.coupons[curIndex].length === 0 && this.curPage[curIndex] === 1) {
					this.getCoupons(curIndex, this.curPage[curIndex], true)
				} else {
					if (this.curPage[curIndex] === -1) {
						this.loadingType = 2
					} else {
						this.loadingType = 0
					}
				}
			},
			getProductNum: function(list) {
			  var num = 0;
			  for (var i = 0; i < list.length; i++) {
				num += list[i].num
			  }
			  return num
			},
			setReload: function(shouldReload) {
				this.shouldReload = shouldReload
			},
			reloadCurrentPage: function() {
				this.curPage[this.curIndex] = 1
				let coupons = this.coupons
				coupons[this.curIndex] = []
				this.coupons = Object.assign({}, coupons)
				this.getCoupons(this.curIndex, 1, true)
			}
		}
	}
</script>

<style>
	@import url("../../common/css/animation.css");
	page {
	  background: #F8F8F8;
	}

	.swiper-tab {
	  text-align: center;
	  height: 80rpx;
	  line-height: 80rpx;
	  display: flex;
	  flex-direction: column;
	  justify-content: space-between;
	  background: #fff;
	}
	.swiper-tab-item {
		line-height: 2.8;
	}
	.nav-container {
		width: 100%;
		height: 74upx;
		display: flex;
		flex-direction: row;
	}

	.line-controller {
		width: 33.3%;
		position: relative;
		bottom: 0;
		left: 0;
		height: 6rpx;
		transition: all .3s ease-out .1s;
		display: flex;
		align-content: center;
		justify-content: center;
	}
	.line {
		height: 100%;
		width: 150upx;
		background: #1dc422;
		border-radius: 6upx;
	}
	.swiper-tab-item {
	  width: 33.3%;
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
