<template>
	<view class="container" :class="getFixedClass">
		<scroll-view scroll-y class="scrollView" lower-threshold="200" :scroll-top="scrollTop" @scroll="scrollFn($event)">

			<!-- 保证性能勿删 -->
			<view class="scroll-container">
				<!-- 保证性能勿删 -->
				<block v-if="getShow">
					<swiper class="bg-white" style="width: 690rpx;height:312rpx;border-radius: 12rpx;" autoplay circular interval='3000'
					 indicator-dots="true">
						<swiper-item v-for="(item, key) in swiperList" :key="key">
							<!-- 图片imageborder-radius: 12rpx; -->
							<image style="width: 100%; max-height: 100%;" :src="item.pic" @click="clickIndexAd(item)" mode="aspectFill"
							 @error="imageError(item)" />
						</swiper-item>
					</swiper>

					<view class="notice-box">
						<view class="icon-lb-notice">
							<image src="/static/chaoyuezu/index/icon-notice.png" class="icon-img-notice" mode="widthFix"></image>
						</view>
						<view class="notice title" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{demoBugOut[demoRange]}}</view>
					</view>

					<view class="row-container mrg-top-20" style="width: 690upx;">
						<image src="/static/chaoyuezu/index/zulin-index-tip.png" style="width:44upx;height:44upx;" />
						<view style="font-size:28upx;font-family:PingFangSC-Medium,PingFang SC;font-weight:500;color:#222222;margin-left: 14upx;">信用免押
							不为残值买单</view>
						<view style="margin-left: auto;background: #E2F3FF;padding: 5upx 10upx 5upx 20upx;border-radius:12upx">
							<view class="row-container align-center">
								<view style="color:#1677FF;" @click.stop="tooneminute()">租机攻略</view>
								<view class="round text-center" style="width: 30upx;height: 30upx;line-height:30upx;background:#1677FF;margin-left: 5upx;">
									<text class="icon-right text-white" style="font-size: 6upx;"></text>
								</view>
							</view>
						</view>
					</view>

					<view style="width: 750upx;">
						<my-menu :propData="menuData" @clickNavList="clickNavList"></my-menu>
					</view>
					<img class="bg-gray" v-if="regions.length > 0" :src="imgRoot+regions[0].cate_img" @click="toClassify(regions[0])"
					 style="width: 690upx;height: 172upx;border-radius:8upx" />
					<view style="height: 20upx;"></view>
					<view style="margin-bottom: 20upx;" v-for="(classify, cIndex) in productList" v-if="classify.goods.length > 0"
					 :key="cIndex">
						<image :src="imgRoot + classify.cate_img" style="position: absolute;margin-left: 0upx;margin-top: 0upx;width: 100%;height: 500upx;z-index: -1;"></image>
						<view class="cu-barsolid-bottom" style="zoom: 1;">
							<view class="action">
								<!--            <text class="icon-titles text-green" style="color: #f37b1d;"></text>-->
								<view class="text-white row-container align-center" v-if="classify.name!=''" style="padding-top: 30upx;padding-left: 40upx;width:720upx;font-family:MFJianHei_Noncommercial-Regular,MFJianHei_Noncommercial;font-weight:400;">
									<view style="font-size: 36upx;">{{classify.name}}</view>
									<view style="margin-left: auto;" @click="toClassify(classify)">更多<text class="icon-right"></text></view>
								</view>
								<text class="bg-gray" style="width: 120upx;height: 30upx;" v-else></text>
								<count-down-timer ref="countdown" :time="time" @finish="onFinish" v-if="cIndex==0&&time>0">
									<template v-slot="{day, hour, minute, second, remain, time}">
										<view class="row-container" style="margin-left: 40rpx;color:white">
											<text style="margin-right: 10rpx;">秒杀限时优惠剩余</text>
											<view class="custom">
												<view class="clock">{{hour + (day * 24)}}</view>
												<view>:</view>
												<view class="clock">{{minute}}</view>
												<view>:</view>
												<view class="clock">{{second}}</view>
											</view>
										</view>
									</template>
								</count-down-timer>
								<!-- <count-down-timer ref="countdown" :time="time" @finish="onFinish">
									<template v-slot="{day, hour, minute, second, remain, time}">
										<view class="case">
											<view class="title">基本：</view>
											<view>{{day}}天{{hour}}时{{minute}}分{{second}}秒</view>				
										</view>
									</template>
								</count-down-timer> -->
							</view>
						</view>

						<scroll-view scroll-x :scroll-left="0" class="tabs-scroll mrg-top-20" style="width: 750upx;"
						 scroll-with-animation>
							<view class="row-container ">
								<view class="justify-center" v-for="(product,index) in classify.goods" :key="index" style="width:50%;display: flex;margin-bottom: 20upx;">
									<view style="margin-left: 40upx;zoom: 0.8;">
										<product-card :img="imgRoot+product.pic" :tag="product.tags" :title="product.name" :price="product.price"
										 :productKey="product.goods_key" @clickItem="toProduct"></product-card>
									</view>
								</view>
							</view>
						</scroll-view>
						<view style="height: 2px;background: #F8F8F8;"></view>
					</view>
					<view style="margin-bottom: 20upx;">
						<view class="cu-barsolid-bottom" style="zoom: 1;">
							<view class="action">
								<!--            <text class="icon-titles text-green" style="color: #f37b1d;"></text>-->
								<view class="text-black row-container align-center" style="padding-top: 30upx;padding-left: 40upx;width:720upx;font-family:MFJianHei_Noncommercial-Regular,MFJianHei_Noncommercial;font-weight:400;">
									<view style="font-size: 36upx;">合作伙伴</view>
								</view>
								<text class="bg-gray" style="width: 120upx;height: 30upx;"></text>
							</view>
						</view>
					</view>
					<view style="width: 750upx;">
						<my-menu :propData="parners"></my-menu>
					</view>
					<view style="height: 200upx;"></view>

				</block>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import Config from '@/common/js/Config.js'
	import Toast from '@/common/js/toast.js'
	import myMenu from '@/components/yx_view/myMenu.vue'
	import ProductCard from '../../productCard/productCard'
	import Util from '@/common/js/util.js'
	import ImageCache from '@/common/js/ImageCache.js'
	// 组件必须
	import {
		QSTabsWxsListMixin
	} from '../mixins/QS-tabs-wxs-list-mixin.js';
	import {
		mapMutations
	} from 'vuex'
	import CountDownTimer from '@/components/countdown-timer/countdown-timer.vue'
	export default {
		components: {
			myMenu,
			ProductCard,
			CountDownTimer
		},
		mixins: [QSTabsWxsListMixin(), Toast], // 组件必须
		data() {
			return {
				demoBugOut: [
					"大众传媒 欧** 租赁一台华为Mate30 Pro  已收货",
					"长沙职院 李** 租赁一台IphoneXS Max  已收货",
					"长沙师范 张** 租赁一台IphoneXS  已付款",
					"信息学院 黄** 租赁一台华为P40  已收货",
					"湖南机电 严** 租赁一台Iphone 11 Pro Max  已收货",
					"电子科职 梁** 租赁一台IphoneXS Max  已收货",
					"财经学院 罗** 租赁一台Iphone11  已收货"
				],
				demoRange: 0,
				list: [],
				sendData: {
					pageNum: 1,
					pageSize: 50,
					tabId: this.tab.id
				},
				statusText: {},
				refreshClear: false,
				imgRoot: '',
				swiperList: [{
						pic: ''
					},
					{
						pic: ''
					},
					{
						pic: ''
					}
				],
				time: 0,
				menuData: [{
						id: 1,
						cate_img: 'https://res.chaoyuezu.cn/attachment/images/20200424/e0f080071370457f95e18f4be9cd5006.jpg',
						name: '电脑平板'
					},
					{
						id: 2,
						cate_img: 'https://res.chaoyuezu.cn/attachment/images/20200424/cf0d497641e24def8a7936bfc7023797.jpg',
						name: '智能手机'
					},
					{
						id: 3,
						cate_img: 'https://res.chaoyuezu.cn/attachment/images/20200318/06714270ef61461a92d22b0421a2189a.png',
						name: '娱乐影音'
					},
					{
						id: 4,
						cate_img: 'https://res.chaoyuezu.cn/attachment/images/20200318/bf4aab8981634410822904f095d784be.png',
						name: '企业租赁'
					},
					{
						id: 5,
						cate_img: 'https://res.chaoyuezu.cn/attachment/images/20200318/1ebd79b4bb74468eb5b9cb78a0243f6a.png',
						name: '精选配件'
					}
				],
				parners: [{
						id: 1,
						cate_img: '/static/chaoyuezu/index/zhima.png',
						name: '芝麻信用'
					},
					{
						id: 2,
						cate_img: '/static/chaoyuezu/index/liantong.png',
						name: '中国联通'
					},
					{
						id: 3,
						cate_img: '/static/chaoyuezu/index/pingguo.png',
						name: '苹果'
					},
					{
						id: 4,
						cate_img: '/static/chaoyuezu/index/huawei.png',
						name: '华为'
					},
				],
				regions: [],
				productList: [{
					name: '',
					goods: [{
							name: '',
							pic: '',
							price: 0,
							original_price: 0
						},
						{
							name: '',
							pic: '',
							price: 0,
							original_price: 0
						},
						{
							name: '',
							pic: '',
							price: 0,
							original_price: 0
						},
						{
							name: '',
							pic: '',
							price: 0,
							original_price: 0
						},
						{
							name: '',
							pic: '',
							price: 0,
							original_price: 0
						},
						{
							name: '',
							pic: '',
							price: 0,
							original_price: 0
						}
					]
				}],
			}
		},
		computed: {
			getColor() {
				let color;
				switch (this.type) {
					case 'setColor':
						color = '#fff';
						break;
					case 'index':
						color = '#fff';
						break;
					default:
						color = '#999';
						break;
				}
				return color;
			}
		},
		created() {
			var self = this;
			setInterval(function() {
				self.demoRange++;
				if (self.demoRange === 6) {
					self.demoRange = 0;
				}

			}, 5000)
		},
		methods: {
			...mapMutations(['setCatId']),
			init(refresh) { //若是用户触发下拉刷新则refresh为true
				let self = this
				if (!self.refreshClear) self.oldScrollTop = 0;
				self.toast({
					type: 'loading'
				})
				self.getAd()
				// self.getClassify()
				self.getGoodsOrderByClassify()
				self.getActivityTime()
				setTimeout(() => {
					self.$emit('refreshEnd');
				}, 1500)
			},
			clickBanner: function(curBanner) {

				//console.log(curBanner.param)
				if (curBanner.param !== '') {
					uni.navigateTo({
						url: '/pkChaoYueZu/index/detail?key=' + curBanner.param
					})
				}
			},
			getActivityTime: function() {
				const self = this
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getActivityTime, {}).then(res => {
					res = res.data
					if (res.code === 0) {
						let now = (new Date()).getTime()
						let time = res.msg ? parseInt(res.msg) * 1000 : 0
						//console.log("time:" + time + ",now:" + now)
						if (time > now) {
							self.time = time - now
							self.$refs.countdown.restart()
						}
					}
				})
			},
			getAd() {
				let self = this
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getAds, {}).then(res => {
					// self.toast(true)
					res = res.data
					if (res.code === 0) {
						//console.log(res)
						self.imgRoot = res.other.img_root
						res.data.banner.forEach((item, index) => {
							let name = item.pic
							let imageUrl = self.imgRoot + item.pic
							item.pic = ImageCache.get(name, imageUrl)
							item.picName = name
							item.originalPic = imageUrl
						})
						self.swiperList = res.data.banner
						//console.log(self.swiperList)

						self.indexAd = Object.assign(res.data.indexAd, {
							picName: res.data.indexAd.pic,
							originalPic: res.other.img_root + res.data.indexAd.pic,
							pic: ImageCache.get(res.data.indexAd.pic, res.other.img_root + res.data.indexAd.pic)
						})
					}
				})
			},
			onFinish() {
				uni.showToast({
					icon: 'none',
					title: '活动结束'
				})
			},
			clickIndexAd(item) {
				switch (item.type) {
					case 'business-apply':
						uni.navigateTo({
							url: '/pkUserInfo/info/protocolDetails?id=1a4db6ef00ae4b189ffc40805d8b9a9f&title=产品介绍'
						})
						break
					case 'product':
						uni.navigateTo({
							url: '/pkChaoYueZu/index/detail?key=' + item.param
						})
						break;
					case 'url':
						uni.setStorageSync("indexUrl", item.param)
						uni.navigateTo({
							url: '/pkChaoYueZu/index/children/web'
						})
						break;
				}
			},
			getClassify: function() {
				let self = this
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getClassify, {}).then((res) => {
					//console.log(res)
					res = res.data
					if (res.code === 0) {
						self.menuData = []
						self.regions = []
						let img_root = res.other.img_root
						res.data.main.forEach((item, index) => {
							item.cate_img = img_root + item.cate_img
							if (self.menuData.length < 8) {
								self.menuData.push(item)
							}
						})
						//console.log(self.menuData)
						res.data.regions.forEach((item, index) => {
							item.cate_img = item.cate_img
							if (self.regions.length < 3) {
								self.regions.push(item)
							}
						})
					}
				})
			},
			getGoodsOrderByClassify: function() {
				let self = this
				let data = {
					is_selling: 0
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getGoodsOrderByClassify, data).then(res => {
					self.toast(true)
					res = res.data
					//console.log(res)
					if (res.code === 0) {
						res.data.forEach((item, index) => {
							item.unit = self.parseUnit(item.periodType) || item.unit
						})
						self.imgRoot = res.other.img_root
						self.productList = res.data
					}
				})
				//console.log(self.productList)
			},
			parseUnit(peroidType) {
				let unit = ''
				switch (peroidType) {
					case 1:
						unit = '日'
						break;
					case 2:
						unit = '周'
					case 3:
						unit = '月'
						break;
					case 4:
						unit = '年'
						break;
				}
				return unit;
			},
			toProduct: function(key) {
				// window.location.href = 'http://www.baidu.com'
				// window.open('http://h5app.test.youxuanbest.com/#/pkPointMall/index/detail?id='+id+'&token=' + this.point_token, '商品详情')
				uni.navigateTo({
					url: '/pkChaoYueZu/index/detail?key=' + key
				})
			},
			tooneminute: function() {
				//console.log('进来了')
				uni.navigateTo({
					url: '/pkChaoYueZu/index/cyzoneminute'
				})
			},
			clickNavList: function(index) {
				//console.log(index)
				this.setCatId(index)
				uni.switchTab({
					url: '/pkChaoYueZu/category/category'
				})
				// uni.switchTab({
				// 	url: '/pkChaoYueZu/category/category?id=' + this.menuData[index].id
				// })
			},
			toClassify(classify) {
				//console.log(classify)
				uni.setStorageSync("children_classify", classify)
				uni.navigateTo({
					url: '/pkChaoYueZu/index/children/classify?key=' + classify.category_key
				})
			},
			fillWithZero(num, n) {
				var len = num.toString().length;
				while (len < n) {
					num = "0" + num;
					len++;
				}
				return num;
			},
			imageError(e) {
				e.pic = e.originalPic
				ImageCache.remove(e.picName)
			},
			imageCateError(e) {
				e.cate_img = e.originalPic
				ImageCache.remove(e.picName)
			}
		}
	}
</script>

<style scoped>
	@import url("../css/QS-tabs-wxs-list-components.css");

	swiper,
	.img-view {
		width: 750upx;
		height: 500upx;
	}

	.Card {
		padding: 40upx;
	}

	.Card-img {
		margin-top: 50upx;
		width: 100upx;
		height: 120upx;
	}

	.border-20 {
		-webkit-border-radius: 20upx;
		-moz-border-radius: 20upx;
		border-radius: 20upx;
	}

	.tabs-scroll {
		width: 100%;
		white-space: nowrap;
		position: relative;
	}

	.page-section-title {
		margin-top: 50upx;
	}

	.tower-swiper .tower-item {
		transform: scale(calc(0.5 + var(--index) / 10));
		margin-left: calc(var(--left) * 100upx - 150upx);
		z-index: var(--index);
	}

	.list-title {
		font-size: 40upx;
		font-weight: bold;
		margin-left: 20upx;
	}

	.list-title::before {
		content: "";
		left: 0upx;
		top: 0upx;
		height: 50upx;
		width: 4upx;
		background: #00be06;
	}

	/* ==================
		         轮播
		 ==================== */
	swiper .a-swiper-dot {
		display: inline-block;
		width: 16upx;
		height: 16upx;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 50%;
		vertical-align: middle;
	}

	swiper .wx-swiper-dots,
	swiper .a-swiper-dots,
	swiper .uni-swiper-dots {
		display: flex;
		align-items: center;
		width: 100%;
		justify-content: center;
	}

	swiper.square-dot .wx-swiper-dot,
	swiper.square-dot .a-swiper-dot,
	swiper.square-dot .uni-swiper-dot {
		background-color: var(--white);
		opacity: 0.4;
		width: 10upx;
		height: 10upx;
		border-radius: 20upx;
		margin: 0 8upx !important;
	}

	.product-banner {
		width: 690upx;
		height: 160upx;
	}

	swiper.square-dot .wx-swiper-dot.wx-swiper-dot-active,
	swiper.square-dot .a-swiper-dot.a-swiper-dot-active,
	swiper.square-dot .uni-swiper-dot.uni-swiper-dot-active {
		opacity: 1;
		width: 30upx;
	}

	swiper.round-dot .wx-swiper-dot,
	swiper.round-dot .a-swiper-dot,
	swiper.round-dot .uni-swiper-dot {
		width: 10upx;
		height: 10upx;
		position: relative;
		margin: 4upx 8upx !important;
	}

	swiper.round-dot .wx-swiper-dot.wx-swiper-dot-active::after,
	swiper.round-dot .a-swiper-dot.a-swiper-dot-active::after,
	swiper.round-dot .uni-swiper-dot.uni-swiper-dot-active::after {
		content: "";
		position: absolute;
		width: 10upx;
		height: 10upx;
		top: 0upx;
		left: 0upx;
		right: 0;
		bottom: 0;
		margin: auto;
		background-color: var(--white);
		border-radius: 20upx;
	}

	swiper.round-dot .wx-swiper-dot.wx-swiper-dot-active,
	swiper.round-dot .a-swiper-dot.a-swiper-dot-active,
	swiper.round-dot .uni-swiper-dot.uni-swiper-dot-active {
		width: 18upx;
		height: 18upx;
	}

	.screen-swiper {
		min-height: 375upx;
	}

	.screen-swiper image,
	.screen-swiper video,
	.swiper-item image,
	.swiper-item video {
		width: 100%;
		display: block;
		height: 100%;
		margin: 0;
		pointer-events: none;
	}

	.card-swiper {
		height: 420upx !important;
	}

	.card-swiper swiper-item {
		width: 610upx !important;
		left: 70upx;
		box-sizing: border-box;
		padding: 40upx 0upx 20upx;
		overflow: initial;
	}

	.card-swiper swiper-item .swiper-item {
		width: 100%;
		display: block;
		height: 100%;
		border-radius: 10upx;
		transform: scale(0.9);
		transition: all 0.2s ease-in 0s;
		overflow: hidden;
	}

	.card-swiper swiper-item.cur .swiper-item {
		transform: none;
		transition: all 0.2s ease-in 0s;
	}

	.tower-swiper {
		height: 420upx;
		position: relative;
		max-width: 750upx;
		overflow: hidden;
	}

	.tower-swiper .tower-item {
		position: absolute;
		width: 300upx;
		height: 380upx;
		top: 0;
		bottom: 0;
		left: 50%;
		margin: auto;
		transition: all 0.2s ease-in 0s;
		opacity: 1;
	}

	.tower-swiper .tower-item.none {
		opacity: 0;
	}

	.tower-swiper .tower-item .swiper-item {
		width: 100%;
		height: 100%;
		border-radius: 6upx;
		overflow: hidden;
	}

	.btn-container {
		width: 40upx;
		height: 50upx;
		line-height: 50upx;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.notice-box {
		overflow: hidden;
		margin: 20rpx auto;
		width: 93%;
		height: 50upx;
		line-height: 50upx;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		border-radius: 50upx;
		background: #f0f0f0;
	}

	.notice-box .icon-lb-notice {
		margin-left: 20upx;
		width: 50upx;
		height: 50upx;
		display: flex;
		align-items: center;
	}

	.notice-box .icon-lb-notice .icon-img-notice {
		width: 40upx;
		height: 40upx;
	}

	.notice-box .notice-title {
		flex: 1;
		height: 50upx;
		background: #00f;
	}

	.custom {
		display: flex;
	}

	.clock {
		width: 50rpx;
	}

	.custom :nth-child(odd) {
		background-color: rgb(22, 119, 255);
		padding: 0upx 4upx;
		color: white;
		border-radius: 5upx;
		text-align: center;
	}

	.custom :nth-child(even) {
		padding: 0 5upx;
	}
</style>
