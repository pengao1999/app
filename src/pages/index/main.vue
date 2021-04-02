<template>
	<view>
		<view class="index-content" v-if="loadingPageSuccess">
			<error-tip :propData="errorData" @hide="errorHide"></error-tip>
			<view class='top'>
				<view class='address' @tap='toStoreList'>
					<image src='../../static/ic_coordinate.png'></image>
					<text>{{store.store_name? store.store_name:"请选择您的小区"}}</text>
					<image src='../../static/ic_arrow_down_white.png' class='arrow'></image>
				</view>
				<!-- <view class="roll" style="background: url('https://wxapp.test.youxuanbest.com/attachment/images/8/2019/01/z64H6Z9o3GvMFMMT4v4O4ZmAG3fL74.png');">
					<swiper :vertical="true" :autoplay="autoplay" :interval="4000" :duration="1000" :circular="true">
						<swiper-item class='item' v-for="(item,index) in newOrders" :key="index" catchtouchmove="move">
							<image class="head" :src="item.userImg"></image>
							<view class="text">买了{{item.goodseName}}</view>
						</swiper-item>
					</swiper>
				</view> -->
				<view class='search'>
					<input class='keyword' type='text' @tap="toSearch" placeholder='请输入商品名称' placeholder-class='placeholder' disabled="true"></input>
				</view>
			</view>
			<swiper class="swiper" v-if="showSwiper" indicator-dots autoplay :interval="5000" :duration="1000" :circular="true"
			 @change="changeSwiperImg">
				<swiper-item v-for="(item,index) in banners" :key="index" @tap="bannerTap(item)">
					<image mode="aspectFill" :lazy-load="true" :src="item.pic"></image>
				</swiper-item>
			</swiper>

			<block v-if="showComponents">
				<my-menu :propData="menuData" @clickNavList="clickNavList"></my-menu>
			<!-- 	<my-picker :propData="pickData" @switchItem="switchItem" :countDownDay="countDownDay" :countDownHour="countDownHour"
				 :countDownMinute="countDownMinute" :countDownSecond="countDownSecond"></my-picker> -->
				<newcomers-card v-if="isNewcomers" :propData="group" :pickData="pickData" :activity_key="activity_key"
				 :activity_endtime="activity_endtime" :userdata="userInfo" @setNewPageTag="setNewPageTag" :cardI="globalI"></newcomers-card>
			</block>
			<!-- <tab-bar :cTabBars="cTabBars" :cIndex="cIndex" @tapTab="tapTab"></tab-bar> -->
			<view class='items' v-if="showGoods">
				<view class='item item-saleout' v-for="(item, index) in lists" :key="item.id" :class="item.stock==0?'':'fade-in'"
				 :style="item.opacityCustom?'opacity:0.6':''" @click="toProduct(lists[index],activity_key,activity_endtime)">
				
					<view class="sale-out" v-if="item.opacityCustom">{{item.opacityText}}</view>
					<image :src='image_root+item.pic' :lazy-load="true"></image>
					<text class='title'>{{item.name}}</text>
					<text v-if="item.subheading!==undefined && item.subheading!==null" class='desc'>{{item.subheading}}</text>
					<view class='info'>
						<text class='sales'>销量：{{item.sales_num}}</text>
						<text class='price'>￥{{item.price}}</text>
						<text v-if="item.unit!==undefined && item.unit!==null" class='goods_unit'>/{{item.unit}}</text>
						<text class='cost-price'>￥{{item.original_price}}</text>
						<!-- <text class='sub-price'>.99</text> -->

					</view>
					<view class='bottom'>
						<view class='progress'>
							<progress class="my-progress" border-radius="14" :percent="(item.stock/(item.sales_num+item.stock))*100"
							 activeColor="#1dc422" active stroke-width="22" />
							<text :style="(item.stock/(item.sales_num+item.stock))*100 < 60? 'color:black':''">剩余{{item.stock}}</text>
							
						</view>

						<view class='buy-container'>
							<!-- <view class="cart-container fade-in"  @tap.stop="tryBuy(item, index)">
								<image class="text-white cart" style="width: 32upx;height: 32upx;" src="/static/gouwuche.png"></image>
							</view> -->
							<view class='buy' v-if="item.showCart" @tap.stop="tryBuy(lists[index],index)">{{item.stock==0?'已售罄':'加入购物车'}}</view>
							<view class="add-reduce-container row-container fade-in" v-else>
								<image class="uni-icon uni-icon-minus-filled btn-container" :lazy-load="true" style="width:50upx;height:50upx;font-size: 24px;color:#aaaaaa"
								 @tap.stop="reducePlat(lists[index], index)"></image>
								<view class="btn-container">{{item.cart_num}}</view>
								<image class="uni-icon uni-icon-plus-filled btn-container" :lazy-load="true" style="width:50upx;height:50upx;font-size: 24px;color:#e84118"
								 @tap.stop="addPlat(lists[index], index)"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
			<uni-load-more :loadingType="loadingType" :contentText="contentText"></uni-load-more>
			<my-top-button :propData="topBottom" @toTop="toTop"></my-top-button>
			<product-selector :propData="selectorData" @close="closeSelector" @reduce="reduceNum" @add="addNum" @submit="submit"
			 @selectAttrItem="selectAttrItem"></product-selector>
			<my-ad-diaolog :propData="adDialogData" @closeAdDialog="closeAdDialog" @adClick="bannerTap(adDialogData)"></my-ad-diaolog>
		</view>
		<block v-if="showComponents">
			<!--  #ifdef  MP-WEIXIN || H5 -->
			<my-wx-login :propData="loginDialogData" @handleClose="handleClose" @getUserInfoSuccess="getUserInfoSuccess"
			 @getUserInfoH5="getUserInfoH5"></my-wx-login>
			<!--  #endif -->
			<position-dialog :showPositionDialog="showPositionDialog" @authLocation="authLocation"></position-dialog>
			<service-center-dialog :showPositionDialog="showCenterDialog" @enter="toArea"></service-center-dialog>
			<coupon-dialog :bannerShow="showCouponDialog" :bannerStyle="couponDialogBackground" :coupons="coupons"
			 @closeCouponDialog="closeCouponDialog" @getCoupons="getCoupons"></coupon-dialog>
			<update-dialog :show="showUpdate" :updateInfo="updateInfo" @close="closeUpdate()"></update-dialog>
		</block>
	</view>
</template>

<script>
	// js
	import Config from '../../common/js/Config.js'
	import Scroll from './indexScroller.js'
	import QQMapWX from '../../common/third/qqmap/qqmap-wx-jssdk.js'
	import TimerCounter from '../../common/js/timeCounter.js'
	import Util from '../../common/js/util.js'
	import Navi from './navi.js'
	import Toast from '../../common/js/toast.js'
	import Auth from '../auth.js'
	import Cart from '../cartsResfresh.js'

	// components
	import MyPicker from '../../components/yx_view/myPicker.vue'
	import MyLoading from '../../components/yx_view/myLoading.vue'
	import MyTopButton from '../../components/yx_view/myToTopBottom.vue'
	import MyAdDiaolog from '../../components/yx_dialog/myAdDialog.vue'
	import UniLoadMore from '../../components/uni-load-more.vue'
	import NewcomersCard from '../../components/yx_view/newcomersCard.vue'
	import PositionDialog from '../../components/yx_dialog/myPositionDialog.vue'
	import ProductSelector from '../../components/yx_dialog/myProductSelector.vue'
	import CouponDialog from '../../components/yx_dialog/myCouponDialog.vue'
	import ServiceCenterDialog from '../../components/yx_dialog/myServiceCenterDialog.vue'
	import ErrorTip from '../../components/yx_dialog/myErrorTip.vue'
	import myMenu from '../../components/yx_view/myMenu.vue'
	import UpdateDialog from '../../components/yx_dialog/updateDialog.vue'

	import {
		mapMutations
	} from 'vuex'

	const CURRENT_CAT_TYPE = 0;
	const NEXT_CATE_TYPE = 2;
	var qqMap = new QQMapWX({
		key: Config.QQMAPKEY // 必填
	});
	export default {
		data() {
			return {
				loadingPageSuccess: false,
				indicatorDots: true,
				autoplay: true,
				showPositionDialog: false,
				showCenterDialog: false,
				interval: 2000,
				duration: 500,
				lists: [],
				activity_key: 0,
				activity_endtime: 0,
				curSwiper: 0,
				banners: [],
				newOrders: [],
				image_root: '',
				goods: {},
				userLocation: undefined,
				pickData: {
					isFixed: false,
					stage1: '正在抢购',
					stage2: '下期团购',
					checkIndex: 0,
				},
				nextPageGoods: [], //下一页的商品信息
				topBottom: {
					show: false
				},
				currentPage: 1,
				isGettingNextPageData: false,
				inBottom: false,
				adDialogData: {
					id: 0,
					show: false,
					pic: '',
					image_root: ''
				},
				loginDialogData: {
					show: false
				},
				loadingType: 1,
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				},
				selectorData: {
					show: false
				},
				selectorIdx: 0,
				goodses: [],
				scrollLeft: 0, //分类
				// cTabBars: [{ //分类类别
				// 	name: '全部商品',
				// 	id: '0',
				// 	recommend: 0
				// }],
				// cIndex:0,
				showCouponDialog: false,
				couponDialogBackground: "background-image:url('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553766038605&di=cec79c102103dbb466038150e4286e6d&imgtype=0&src=http%3A%2F%2Fku.90sjimg.com%2Fback_pic%2F04%2F03%2F72%2F02580891f451e4c.jpg%2521%2Ffwfh%2F804x1134%2Fquality%2F90%2Funsharp%2Ftrue%2Fcompress%2Ftrue%2Fwatermark%2Ftext%2FOTDorr7orqE%3D%2Ffont%2Fsimkai%2Falign%2Fsoutheast%2Fopacity%2F20%2Fsize%2F50')",
				coupons: [],
				menuData: [],
				// 错误提示
				errorData: {
					show: false,
					desc: ''
				},
				mapLists: new Map(),
				showUpdate: false,
				updateInfo: {},
				isGettingCoupon: false,
				isGettingBanner: false,
				isGettingClassify: false,
				isGettingNewOrder: false,
				showSwiper: false,
				showComponents: false,
				showGoods: false,
				isError: false,
				isLoading: false,
				isShowDialog:false,
				// showNewcomers:false
			}
		},
		mixins: [Scroll, TimerCounter, Navi, Toast, Auth, Cart], 
		components: {
			MyPicker,
			MyLoading,
			MyTopButton,
			MyAdDiaolog,
			UniLoadMore,
			NewcomersCard,
			PositionDialog,
			ProductSelector,
			CouponDialog,
			ServiceCenterDialog,
			myMenu,
			ErrorTip,
			UpdateDialog
		},
		watch: {
			isNearTop: {
				handler() {
					if (this.isNearTop) {
						this.topBottom.show = false
					} else {
						this.topBottom.show = true
					}
				},
				immediate: true
			},
			userInfo: {
				handler(newest, old) {
					if ((this.userInfo === undefined) ||
						(this.userInfo != undefined && !Util.containsKey(this.userInfo, 'user_key'))) {} else {
						if (Util.containsKey(newest, 'user_key') && !Util.containsKey(old, 'user_key')) {
							this.mapLists = new Map()
							this.loadingType = 1
							this.cIndex = 0
							this.getGoods(this.pickData.checkIndex == 1 ? NEXT_CATE_TYPE : CURRENT_CAT_TYPE, this.currentPage, true)
						}
						this.loginDialogData = Object.assign({}, this.loginDialogData, {
							show: false
						})
					}

					// if (this.userInfo != undefined && Util.containsKey(this.userInfo, 'user_key')) {
					// 	this.getCouponList()
					// }

					if (this.userInfo != undefined && Util.containsKey(this.userInfo, 'user_key')) {
						this.resfreshCartNum(this.userInfo.user_key, (res) => {})
						this.handelShare()
						this.checkBindLeader()
					}
				},
				immediate: true
			},
			loadingPageSuccess: {
				handler() {
					let self = this
					if (!self.loadingPageSuccess) {
						setTimeout(() => {
							self.loadingPageSuccess = true
						}, 1000)
					}
					if (self.loadingPageSuccess) {
						setTimeout(() => {
							self.swiperHeight = 340
							// self.queryMyPickerYPostion();
						}, 800)

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
			uuid: {
				handler() {
					if (this.uuid) {
						this.changeClassify();
						this.getBanner();
						this.getStoreInfo();

						// this.mapLists = new Map()
						// this.loadingType = 1
						// this.cIndex = 0
						// this.getGoods(this.pickData.checkIndex == 1 ? NEXT_CATE_TYPE : CURRENT_CAT_TYPE, this.currentPage, true)
					}
				},
				immediate: true
			},
			refreshIndexGoodList: {
				handler() {
					if (this.refreshIndexGoodList.length > 0) {
						this.refreshCartNum()
					}
				},
				immediate: true
			},
			isNewcomers: {
				handler() {},
				immediate: true
			},
			isTryGetUserInfo: {
				handler() {
					if (this.isTryGetUserInfo && !Util.containsKey(this.userInfo, 'user_key')) {
						this.getGoods(this.pickData.checkIndex == 1 ? NEXT_CATE_TYPE: CURRENT_CAT_TYPE,1,true);
					}
					// this.enterJudge()
				},
				immediate: true
			},
			shareLeader: {
				handler() {
					console.log("shareLeader:" + JSON.stringify(this.shareLeader))
					this.handelShare()
				},
			}
		},
		computed: {
			systemInfo() {
				return this.$store.state.systemInfo
			},
			userInfo() {
				return this.$store.state.userInfo
			},
			isTryGetUserInfo() {
				return this.$store.state.isTryGetUserInfo
			},
			group() {
				return this.$store.state.group
			},
			acts() {
				return this.$store.state.acts
			},
			globalI() {
				return this.$store.state.globalI
			},
			refreshIndexGoodList() {
				return this.$store.state.refreshIndexGoodList
			},
			refreshCart() {
				return this.$store.state.refreshCart
			},
			isNewcomers() {
				return this.$store.state.isNewcomers
			},
			uuid() {
				return this.$store.state.uuid
			},
			store() {
				return this.$store.state.store
			},
			op_uuid() {
				return this.$store.state.op_uuid
			},
			shareLeader() {
				return this.$store.state.shareLeader
			}
		},
		onShow() {
			console.log('showUpdate:' + this.showUpdate)
			if (this.refreshCart) {
				this.resfreshCartNum(this.userInfo.user_key, (res) => {})
			}
			if (this.isUserLogin()) {
				this.checkBindLeader();
			}
		},
		onLoad(options) {
			let self = this
			console.log(' main onLoad')
			self.toast({
				type: 'loading',
				desc: '加载中...',
				time: 3000
			})

			self.getClassify();
			self.getBanner();
			// self.getNewOrder();
			self.isShowNewcomers();
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
				self.checkUpdate(widgetInfo)
			})
			// #endif

			setTimeout(() => {
				self.showSwiper = true
			}, 80)
			setTimeout(() => {
				self.showComponents = true
			}, 120)
			setTimeout(() => {
				self.showGoods = true
			}, 160)
		},
		methods: {
			...mapMutations(['setUserLocation', 'setGlobalI', 'setGroup', 'setUserInfo', 'setAds', 'setLoginWx',
				'setActs', 'setRefreshCart', 'setCatId', 'addCategoryRefresh', 'emptyIndexRefresh',
				'setInChooseProductCartNum', 'couldModifyGroup', 'setIsNewcomersPage', 'setisNewcomers', 'setStore', 'setUuid','setShareLeader'
			]),
			checkUserLocation: function() {
				// #ifdef APP-PLUS || MP-WEIXIN || H5
				let self = this
				this.userLocation = self.$store.state.userLocation
				if (!this.userLocation) {
					uni.getLocation({
						type: "wgs84",
						success: (res) => {
							self.getIbyLocation(res)
						},
						fail: (res) => {
							if (self.group === undefined || self.group === '') {
								// self.showCenterDialog = true
							}
						}
					})
				}
				// #endif
			},
			handelShare() {
				let self = this
				if(this.isShowDialog){
					return
				}
				if (Util.containsKey(this.userInfo, 'user_key') && Util.containsKey(this.shareLeader, 'community')) {
					if (String(this.shareLeader.user_key) === String(this.userInfo.bind_leader_key)) {
						return
					}
					if (this.userInfo.community !== null) {
						this.isShowDialog = true
						uni.showModal({
							content: "您绑定的店铺为[" + this.userInfo.community + ']是否要切换到[' + this.shareLeader.community + ']',
							success: function(res) {
								if (res.confirm) {
									self.bindLeader(self.shareLeader.user_key)
								}else{
									this.setShareLeader({})
								}
							}
						})
					} else {
						self.bindLeader(self.shareLeader.user_key)
					}

				}
			},
			bindLeader: function(leader_key) {
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
						self.setShareLeader({})
					}
				})
			},
			checkBindLeader() {
				if (this.userInfo.bind_leader_key === 0 || this.userInfo.bind_leader_key === '' || this.userInfo.bind_leader_key === null) {
					this.toLeaderList()
				}
			},
			enterJudge: function() {
				console.log('enterJudge')
				let self = this
				if (self.userInfo === undefined || self.userInfo === null || !self.userInfo.bind_uuid) {
					if (self.op_uuid) {
						self.setUuid(self.op_uuid)
					}
				}
			},
			getStoreInfo: function() {
				let self = this
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getStoreInfo, {}).then(res => {
					res = res.data
					if (res.code === 0) {
						self.setStore(res.data)
					}
				})
			},
			getIbyLocation: function(location) {
				let self = this
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getIbyLocation, location).then((res) => {
					res = res.data
					if (res.code === 0) {
						if (res.data.uniacid === "") {
							// self.showCenterDialog = true
						} else {
							self.setGlobalI(res.data.uniacid)
							self.getQQMapLocation(location)
							self.getNearLeader(location)
						}
					}
				})
			},
			checkUserLocationH5: function() {
				// #ifdef H5
				let self = this
				// #endif
			},
			/**
			 *
			 */
			changeClassify: function() {
				// this.menuData=[{ //分类类别
				// 	name: '全部商品',
				// 	id: '0',
				// 	recommend: 0
				// }]
				this.menuData = []
				this.getClassify();
			},
			getQQMapLocation: function(location) {
				let self = this;
				qqMap.reverseGeocoder({
					location: {
						latitude: location.latitude,
						longitude: location.longitude
					},
					success: function(r) {
						var userLocation = {
							latitude: location.latitude,
							longitude: location.longitude,
							city: r.result.address_component.city
						}
						self.setUserLocation(userLocation)
						self.userLocation = userLocation
					},
					fail: function(res) {},
					complete: function(res) {}
				});
			},
			setGroupIfHasLeaderId: function(leader_key) {
				console.log('setGroupIfHasLeaderId')
				let self = this
				if (self.group !== undefined && !self.couldModifyGroup) {
					return
				}
				let data = {
					user_key: leader_key,
					i: self.globalI
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getMyLeader, data).then((res) => {
					res = res.data
					if (res.code === 0 && res.data !== null) {
						self.setGroup(res.data)
					} else {
						self.checkUserLocation()
					}
				}).catch(err => {
					if (self.isError) return
					self.isError = true
					uni.showModal({
						title: '温馨提示',
						content: '抱歉，获取提货点信息失败，请检查网络！',
						showCancel: false,
						comfirmText: '重试',
						success: (res) => {
							self.setGroupIfHasLeaderId(leader_key)
						}
					})
				})
			},
			getNearLeader: function(location) {
				let self = this;
				let data = {
					i: self.globalI,
					longitude: location.longitude,
					latitude: location.latitude,
					keyword: "",
					page: 1,
					limit: 1
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.nearLeader, data).then((res) => {
					res = res.data
					if (res.code == 0 & res.data.length > 0) {
						self.group = res.data[0]
					}

					self.setGroup(res.data[0])
				})
			},
			queryMyPickerYPostion: function() {
				// 				let self = this
				// 				var query = uni.createSelectorQuery()
				// 				query.select('.swiper').boundingClientRect(data => {
				// 					self.swiperHeight = data.height
				// 				}).exec();
				// 				query.select('.top').boundingClientRect(data => {
				// 					self.swiperHeight += data.height
				// 				}).exec();
			},
			showAd: function(adData) {
				if (adData && this.fmtDate(uni.getStorageSync('showAdTime')) != this.fmtDate(Date.parse(new Date()))) {
					uni.setStorageSync("showAdTime", Date.parse(new Date()))
					this.adDialogData = Object.assign({}, this.adDialogData, adData)
					this.adDialogData.show = true
				}
			},
			fmtDate: function(obj) {
				var date = new Date(obj);
				var y = 1900 + date.getYear();
				var m = "0" + (date.getMonth() + 1);
				var d = "0" + date.getDate();
				return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
			},
			getClassify: function() {
				let self = this
				self.$Phttp.post(Config.JAVA_SAAS_URLS.classify, {}).then((res) => {
					self.isGettingClassify = false
					res = res.data
					if (res.code === 0)
						self.menuData = []
					let img_root = res.other.img_root
					res.data.forEach((item, index) => {
						item.cate_img = img_root + item.cate_img
						if (item.name === '全部商品') {
							item.id = 0
						}
						self.menuData.push(item)
					})
				})
			},
			getGoods: function(catType = CURRENT_CAT_TYPE, page = 1, isForce = false) {
				let self = this
				if (self.isLoading) {
					setTimeout(() => {
						self.isLoading = false
					}, 2000)
					return
				}
				self.isLoading = true
				if (isForce) {
					self.lists = []
					self.currentPage = 1
				}
				let data = {
					i: self.globalI,
					act_type: catType,
					page: self.currentPage,
					limit: Config.PAGE_LIMIT,
					// latitude: self.group.latitude,
					// longitude: self.group.longitude,
					cat_key: 0,
					user_key: Util.containsKey(self.userInfo, 'user_key') ? self.userInfo.user_key : 0,
					is_super_plat: true
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getSaasGoods, data).then((res) => {
					self.isLoading = false
					self.toast(true)
					uni.stopPullDownRefresh()
					self.loadingPageSuccess = true
					res = res.data

					if (res.data.goods.length < Config.PAGE_LIMIT) {
						self.loadingType = 2
					} else {
						self.loadingType = 0
					}
					let lists = res.data.goods
					if (page === 1) {
						self.lists = []
					}
					lists.forEach((item, index) => {
						item.opacityCustom = false
						if (item.cart_num > 0) {
							item.showCart = false
						} else {
							item.showCart = true
						}
						if (item.stock === 0) {
							item.opacityCustom = true
							item.opacityText = '已抢光'
						}
						if (item.goods_begin_time > (new Date()).getTime() / 1000) {
							item.opacityCustom = true
							item.opacityText = '活动未开始'
						}
						if (item.end_time2 < (new Date()).getTime() / 1000) {
							item.opacityCustom = true
							item.opacityText = '活动已结束'
						}
						self.lists.push(item)
						self.mapLists.set(item.id, self.lists.length - 1)
					})
					self.globalImage_root = res.other.img_root
					self.adDialogData.image_root = res.other.img_root
					self.clearTimerCounter()
					self.currentPage++;
				}).catch(err => {
					if (self.isError) return
					self.isError = true
					uni.showModal({
						title: '温馨提示',
						content: '抱歉，获取商品列表失败，请检查网络！',
						showCancel: false,
						comfirmText: '重试',
						success: () => {
							self.getGoods(catType, page)
						}
					})
				})
			},
			getBanner: function() {
				let self = this
				if (self.isGettingBanner) return
				self.isGettingBanner = true
				self.banners = Object.assign([])
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getBanner, {}).then((res) => {
					self.isGettingBanner = false
					res = res.data

					// 缓存首页轮播图
					let banners = Util.obj2Array(res.data.banner) || []
					banners.forEach((item, index) => {
						banners[index].pic = res.other.img_root + banners[index].pic
					})
					self.banners = Object.assign([], banners)
					self.curSwiper = 0
					self.image_root = res.other.img_root
					self.showAd(res.data.indexDialogAd)
					self.setAds(res.data)
				})
			},
			isShowNewcomers: function() {
				let self = this
				return
				let data = {
					i: self.globalI,
					m: 'sqtg_sun',
					user_key: self.userInfo.user_key,
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.isNewcomers, data).then((res) => {
					res = res.data
					if (res.code === 0) {
						if (res.data.isNewComers == true) {
							self.setisNewcomers(1)
							// self.showNewcomers = true
						} else {
							self.setisNewcomers(0)
						}
					}
				})
			},
			getNewOrder: function() {
				let self = this
				if (self.isGettingNewOrder) return
				self.isGettingNewOrder = true
				let data = {
					i: self.globalI,
					m: 'sqtg_sun',
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getNewBuyer, data).then((res) => {
					self.isGettingNewOrder = false
					res = res.data
					self.newOrders = res.data
				})
			},
			switchItem: function(checkIndex) {
				let self = this
				self.pickData = Object.assign({}, self.pickData, {
					checkIndex: checkIndex
				})
				this.clearTimerCounter()
				this.mapLists = new Map()
				this.loadingType = 1
				this.cIndex = 0
				this.getGoods(checkIndex == 1 ? NEXT_CATE_TYPE : CURRENT_CAT_TYPE, this.currentPage, true)
				// this.getNextPageGoods(checkIndex== 1 ? NEXT_CATE_TYPE: CURRENT_CAT_TYPE, this.currentPage)
			},
			toTop: function(e) {
				this.doScrollTop()
				this.topBottom.show = false
			},
			closeAdDialog: function() {
				this.adDialogData.show = false
			},
			adClick: function(adData) {
				this.adDialogData.show = false
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
			wxLogin: function() {
				let self = this
				// 用户登录
				let data = Object.assign({}, this.userInfo, {
					i: self.globalI,
					name: this.userInfo.nickName,
					img: this.userInfo.avatarUrl,
					email: "",
					share_user_key: ""
				})

				self.$Phttp.post(Config.JAVA_SAAS_URLS.wxLogin, data).then((res) => {
					res = res.data
					self.setUserInfo(res.data)
				})
			},
			handleClose: function() {
				this.loginDialogData.show = false
			},
			authLocation(isSuccess) {
				if (isSuccess) {
					this.showCenterDialog = false
					this.checkUserLocation()
				} else {
					this.toArea()
				}
			},
	
			tryBuy: function(item, index) {
				
				let self = this
				if (!self.hasRegister())  return
				if (item.use_attr !== 0) {
					self.selectorIdx = index
					self.buy(item)
				} else {
					if (this.userInfo.community === null) {
						this.toLeaderList()
						return
					}
					if (!this.isGoodAvailable(item)) return
					self.addCart(item, index)
				}
			},
			isUserLogin: function() {
				let self = this
				if ((self.userInfo === undefined) ||
					(self.userInfo != undefined && !Util.containsKey(self.userInfo, 'user_key'))) {
					return false
				}
				return true
			},
			addCart: function(item, index) {
				let self = this
				if (!self.hasRegister())  return
				self.toast({
					type: 'loading',
					desc: '加载中...',
				})
				let data = {
					user_key: self.userInfo.user_key,
					goods_key: item.goods_key,
					activity_key: self.activity_key, //活动id
					activity_endtime: self.activity_endtime, //活动结束时间
					store_key: 0,
					num: 1,
					token: self.userInfo.access_token,
					attr_keys: '',
					attr_names: ''
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.joinCart, data).then((res) => {
					res = res.data
					if (res.code === 0) {
						self.setRefreshCart(true)
						self.toast({
							desc: '已加入购物车',
							type: 'success',
							time: 1500
						})
						self.lists[index].cart_num = 1
						self.addCategoryRefresh({
							goods_key: item.goods_key,
							cart_num: 1,
							cart_key: res.data.cart_key
						})
						self.lists[index].cart_key = res.data.cart_key
						self.lists[index].showCart = false
						
					} else {
						self.toast({
							desc: res.msg,
							type: 'warn',
							time: 3000
						})
					}
					self.resfreshCartNum(this.userInfo.user_key, (res) => {})
				})
			},
			buy: function(item) {
				let self = this
				if (item.stock === 0) {
					self.toast({
						desc: '已售罄,刷新重试'
					})
					return
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.goodDetail, {goods_key: item.id}).then(res => {
					res = res.data
					if (res.code === 0) {
						self.selectorData = Object.assign({}, res.data, {
							show: true,
							image_root: self.globalImage_root,
							num: 1,
						})
						setTimeout(() => {
							self.selectorData = Object.assign({}, self.selectorData)
						}, 200)
						self.selectorData.goods_key = res.data.goods_key

						self.retSetAttrGroupStatus()
						if (self.selectorData.attrgroups.length > 0) {
							self.selectAttrItem({
								groups_idx: 0,
								attrs_idx :0
							})
						}
					}
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
			selectAttrItem: function(e) {
				let self = this
				self.toast({
					type: 'loading',
					desc: '加载中...'
				})
				let groups_idx = e.groups_idx
				let attrs_idx = e.attrs_idx
				if (groups_idx !== undefined && attrs_idx !== undefined)
					self.setAttrGroupStatus(groups_idx, attrs_idx)

				var attr_keys = ','
				var chooseSpec = ''
				self.selectorData.attrgroups.forEach((item, idx) => {
					attr_keys += item.attrs[item.selectAttrsId].id + ','
					chooseSpec += item.attrs[item.selectAttrsId].name + " "
				})
				let data = {
					attr_keys: attr_keys,
					goods_key: self.selectorData.goods_key,
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getGoodAttrs, data).then((res) => {
					self.toast(true)
					res = res.data
					if (res.code === 0) {
						self.selectorData = Object.assign({}, self.selectorData, res.data, {
							chooseSpec: chooseSpec,
							attr_keys: attr_keys,
							attr_names: chooseSpec
						})
						console.log(self.selectorData)
						self.attr_keys = attr_keys
					}
				})
			},
			retSetAttrGroupStatus: function() {
				let self = this
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
			toSearch: function() {
				uni.navigateTo({
					url: '/pkMain/goodslist/goodslist'
				})
			},
			submit: function() {
				let self = this
				if (!this.checkLogin()) return //判断是否登录
				if (!this.isAvailable()) return
				if (this.userInfo.community === null) {
					this.toLeaderList()
					return
				}
				self.toast({
					type: 'loading',
					desc: '加载中...',
				})
				let data = {
					i: self.globalI,
					user_key: self.userInfo.user_key,
					goods_key: self.selectorData.goods_key,
					store_key: 0,
					activity_key: this.activity_key, //活动id
					activity_endtime: this.activity_endtime, //活动
					num: self.selectorData.num,
					token: self.userInfo.access_token,
					attr_keys: self.selectorData.attr_keys === undefined ? '' : self.selectorData.attr_keys,
					attr_names: self.selectorData.chooseSpec === undefined ? '' : self.selectorData.chooseSpec
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.joinCart, data).then((res) => {
					res = res.data
					if (res.code === 0) {
						self.setRefreshCart(true)
						self.toast({
							desc: '已加入购物车',
							type: 'success',
							time: 3000
						})
						self.lists[self.selectorIdx].cart_num += self.selectorData.num
						self.addCategoryRefresh({
							goods_key: self.selectorData.goods_key,
							cart_num: self.lists[self.selectorIdx].cart_num,
							cart_key: res.data
						})
						self.lists[self.selectorIdx].cart_key = res.data
						self.lists[self.selectorIdx].showCart = false
						self.selectorData.show = false
					} else {
						self.toast({
							desc: res.msg,
							type: 'warn',
							time: 3000
						})
					}
					self.resfreshCartNum(this.userInfo.user_key, (res) => {})
				})
				// 				this.selectorData = Object.assign({}, this.selectorData, {
				// 					goods_key: this.selectorData.origin_id,
				// 					user_key: this.userInfo.user_key,
				// 					leader_key: this.group.leader_key
				// 				})
				// 				delete this.selectorData.id
				// 				this.goodses = [this.selectorData]
				// 				this.selectorData.show = false
				// 				uni.navigateTo({
				// 					url : '/pages/order/create'
				// 				})
			},
			isGoodAvailable: function(item) {
				let self = this
				var totalSecond = item.end_time2 - Date.parse(new Date()) / 1000;
				if (totalSecond <= 0) {
					self.toast({
						type: 'warn',
						desc: '活动已结束'
					})
					return false
				}
				if (item.stock < 1) {
					self.toast({
						type: 'warn',
						desc: '库存不足'
					})
					return false
				}
				if ((new Date()).getTime() / 1000 < item.goods_begin_time) {
					self.toast({
						type: 'warn',
						desc: '活动未开始'
					})
					return false
				}
				if ((new Date()).getTime() / 1000 > item.end_time2) {
					self.toast({
						type: 'warn',
						desc: '活动已结束'
					})
					return false
				}
				return true
			},
			isAvailable: function() {
				let self = this
				if (this.selectorData.stock < 1) {
					self.toast({
						type: 'warn',
						desc: '库存不足'
					})
					return false
				}
				return true
			},
			bannerTap: function(banner) {
				switch (banner.type) {
					case 'group-apply':
						uni.navigateTo({
							url: '/pkUserInfo/info/apply'
						})
						break
					case 'product':
						let item = {
							id: banner.param,
							cart_num: this.mapLists.get(parseInt(banner.param)) !== undefined ? this.lists[this.mapLists.get(parseInt(
								banner.param))].cart_num : 0
						}
						this.toProduct(item, this.activity_key, this.activity_endtime)
						break
				}
			},
			move: function(e) {
				return false
			},
			/**
			 * tabbar点击事件
			 * @param {Object} index
			 */
			// tapTab: function(index) {
			// 	this.cIndex = index
			// 	this.clearTimerCounter()
			// 	this.lists = []
			// 	this.currentPage = 1
			// 	this.loadingType = 1
			// 	this.getGoods(this.pickData.checkIndex == 1 ? NEXT_CATE_TYPE: CURRENT_CAT_TYPE, this.currentPage)
			// 	// this.getNextPageGoods(this.pickData.checkIndex == 1 ? NEXT_CATE_TYPE: CURRENT_CAT_TYPE, this.currentPage)
			// },
			// 优惠券相关
			closeCouponDialog: function() {
				this.showCouponDialog = false
			},
			getCoupons: function() {
				let self = this
				let coupon_id = []
				self.coupons.forEach((item, index) => {
					coupon_id.push(item.id)
				})
				let data = {
					i: self.globalI,
					coupon_id: coupon_id.join(','),
					user_key: self.userInfo.user_key
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
				self.closeCouponDialog()
			},
			getCouponList: function() {
				let self = this
				if (self.isGettingCoupon) return
				self.isGettingCoupon = true
				let data = {
					i: self.globalI,
					user_key: self.userInfo.user_key,
					limit: 10,
					page: 1
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.couponDialog, data).then((res) => {
					self.isGettingCoupon = false
					res = res.data
					if (res.code === 0) {
						let coupons = res.data
						self.coupons = coupons
						if (self.coupons.length !== 0)
							self.showCouponDialog = true
					}
				})
			},
			// 优惠券相关
			changeSwiperImg: function(e) {
				this.curSwiper = parseInt(e.detail.current)
			},
			clickNavList: function(index) {
				console.log("clickNavList")
				this.setCatId(index)
				// hard code url here ???
				// let h5_url = 'http://h5app.test.youxuanbest.com/#/pkPointMall/index/main?token=c7387ca7d8184c4b9c9346656661570e'
				// let shop_view = plus.webview.create(h5_url, 'test', {width:'100%',height:'100%',top:'0px',left:'0px',additionalHttpHeaders:{}});
				// shop_view.show()
				uni.switchTab({
					url: '/pages/category/category'
				})
			},
			reducePlat: function(item, idx) {
				console.log(idx)
				let self = this
				if (item.use_attr) {
					this.errorData = Object.assign({
						show: true,
						desc: '多规格商品只能去购物车移除'
					})
					return
				}
				if (!this.checkLogin()) return //判断是否登录
				if (!this.isGoodAvailable(item)) return
				self.updateCart(item.goods_key,item.cart_key, item.cart_num - 1, idx)
			},
			updateCart: function(goods_key, cart_key, num, idx) {
				
				let self = this
				self.toast({
					type: 'loading',
					desc: '处理中...'
				})
				let data = {
					user_key: self.userInfo.user_key,
					token: self.userInfo.access_token,
					cart_key: cart_key,
					num: num
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.updateCart, data).then((res) => {
					self.toast(true)
					res = res.data
					if (res.code === 0) {
						self.setRefreshCart(true)
						if (num === 0) {
							self.toast({
								type: 'success',
								desc: '已移除购物车'
							})
							self.lists[idx].cart_num = 0
							self.addCategoryRefresh({
								goods_key: goods_key,
								cart_num: 0
							})
							self.lists[idx].showCart = true
						} else {
							self.lists[idx].cart_num = num
							self.addCategoryRefresh({
								goods_key: goods_key,
								cart_num: num
							})
						}
					} else {
						self.toast({
							type: 'warn',
							desc: '库存不足'
						})
					}
					self.resfreshCartNum(this.userInfo.user_key, (res) => {})
				})
			},
			addPlat: function(item, idx) {
				let self = this
				if (!self.checkLogin()) return //判断是否登录
				if (item.use_attr === 1) {
					self.selectorIdx = idx
					self.buy(item)
					return
				}
				if (!self.isGoodAvailable(item)) return
				self.updateCart(item.goods_key, item.cart_key, item.cart_num + 1, idx)
			},

			setNewPageTag: function() {
				let self = this
				this.setCatId(1)
				self.setIsNewcomersPage(1)
			},
			// 错误隐藏
			errorHide: function(e) {
				if (!e.detail) {
					this.errorData.show = false;
					return
				}
				this.errorData = e.detail
			},
			refreshCartNum: async function() {
				let self = this
				if (self.lists.length === 0) {
					self.emptyIndexRefresh()
					return
				}
				self.refreshIndexGoodList.forEach((item, index) => {
					item.multi ? item.cart_num = self.lists[self.mapLists.get(parseInt(item.goods_key))].cart_num + item.cart_num :
						null;
					if (item.cart_num > 0) {
						self.lists[self.mapLists.get(parseInt(item.goods_key))].cart_num = item.cart_num
						self.lists[self.mapLists.get(parseInt(item.goods_key))].showCart = false
						item.cart_key ? self.lists[self.mapLists.get(parseInt(item.goods_key))].cart_key = item.cart_key : null
					} else {
						self.lists[self.mapLists.get(parseInt(item.goods_key))].cart_num = 0
						self.lists[self.mapLists.get(parseInt(item.goods_key))].showCart = true
					}
				})
				self.emptyIndexRefresh()
			},
			checkUpdate(widgetInfo) {
				let self = this
				let version = widgetInfo.version
				version = version.replace(/\./g, '')
				let postData = {
					platform: plus.os.name, //plus.os.name
					version_code: version
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.checkUpdate, postData).then((res) => {
					console.log('check update')
					res = res.data
					console.log(JSON.stringify(res))
					if (res.code === 0) {
						self.showUpdate = true;
						self.updateInfo = res.data
						if (self.updateInfo.is_force == 1) {
							uni.hideTabBar({
								animation: false
							})
						}
					}
				})
			},
			closeUpdate: function() {
				this.showUpdate = false
			},
			toLeaderList: function() {
				// uni.navigateTo({
				// 	url: '/pkUserInfo/address/address'
				// })
			},
			toStoreList: function() {
				uni.navigateTo({
					url: '/pkUserInfo/address/area'
				})
			}
		},
		onReachBottom() {
			if (this.loadingType === 2) {
				return
			}
			this.loadingType = 1
			this.getGoods(this.pickData.checkIndex == 1 ? NEXT_CATE_TYPE : CURRENT_CAT_TYPE, this.currentPage, false)
		},
		onShareAppMessage() {
			let url = ''
			if (this.isRegister) {
				url = '/pages/index/main?user_key=' + this.userInfo.user_key
			} else {
				url = '/pages/index/main'
			}
			return {
				title: '缪可周期购--订购牛奶，周期配送上门',
				path: url
			}
		},
		onPullDownRefresh() {
			// if (this.group !== undefined && this.group !== '') {
			this.mapLists = new Map()
			this.loadingType = 1
			this.showCenterDialog = false
			this.getGoods(this.pickData.checkIndex == 1 ? NEXT_CATE_TYPE : CURRENT_CAT_TYPE,1, true);
			this.getClassify();
			this.getBanner();
			// }
		}
	}
</script>

<style>
	@import url("../../common/css/animation");

	.index-content {
		min-height: 100%;
		display: flex;
		flex-direction: column;
	}

	.top {
		width: 100%;
		height: 100rpx;
		background: #1dc422;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.top .address {
		height: 40upx;
		line-height: 40upx;
		display: flex;
		align-items: center;
		padding-left: 30rpx;
		padding-right: 30rpx;
	}

	.top .address image {
		width: 30rpx;
		height: 30rpx;
	}

	.top .address text {
		line-height: 38rpx;
		font-size: 32rpx;
		font-weight: 500;
		color: #fff;
		margin-left: 10rpx;
		max-width: 280rpx;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.top .address .arrow {
		width: 28rpx;
		height: 28rpx;
		margin-left: 10rpx;
		margin-top: 4rpx;
	}

	.top .roll {
		height: 50rpx;
		width: 300rpx;
		overflow: hidden;
		background: #eee;
		border-radius: 25rpx;
		margin-right: 20rpx;
	}

	.roll swiper {
		height: 50rpx;
	}

	.top .roll .item {
		line-height: 42rpx;
		height: 42rpx;
		display: flex;
		align-items: center;
		margin-left: 4rpx;
	}

	.top .roll .item .head {
		width: 42rpx;
		height: 42rpx;
		border-radius: 50%;
		background: #eee;
		margin-left: 4rpx;
	}

	.top .roll .item .text {
		flex: 1;
		font-size: 22rpx;
		color: #fff;
		margin-left: 10rpx;
		margin-right: 10rpx;
		text-overflow: ellipsis;
		white-space: nowrap;
		letter-spacing: ;
		ter-spacing: 4rpx;
		overflow: hidden;
	}

	.top .search {
	  width: calc(100% - 60rpx);
	  height: 58rpx;
	  border-radius: 34rpx;
	  background: #fff;
	  margin-left: 30rpx;
	  margin-right: 30rpx;
	  margin-top: 10rpx;
	  display: flex;
	  align-items: center;
	}

	.top .search .keyword {
	  height: 68rpx;
	  line-height: 68rpx;
	  font-size: 24rpx;
	  color: #666;
	  width: calc(100% - 100rpx);
	  margin-left: 40rpx;
	}

	.top .search .button {
	  width: 28rpx;
	  height: 28rpx;
	  float: right;
	}

	.swiper {
		width: 100%;
		height: 320rpx;
	}

	.swiper image {
		width: 100%;
		height: 100%;
	}

	.center-bar {
		width: calc(100% - 50rpx);
		height: 120rpx;
		padding-left: 30rpx;
		padding-right: 20rpx;
		align-items: center;
		background: #fff;
	}

	.stages {
		width: 360rpx;
		height: 60rpx;
		border-radius: 30rpx;
		background: #eff1f6;
		display: inline-flex;
	}

	.stages .stage {
		width: 180rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border-radius: 30rpx;
		font-size: 26rpx;
		font-weight: 500;
		color: #2f3640;
	}

	.stages .activate {
		background: #1dc422;
		color: #fff;
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
		height: 220rpx;
		padding-top: 30rpx;
		padding-bottom: 30rpx;
		background: #fff;
		position: relative;
		border-bottom: solid 1rpx #eee;
	}

	.items .item-saleout {
		stop-opacity: 0.7;
	}

	.items .item image {
		width: 220rpx;
		height: 220rpx;
		border-radius: 20rpx;
		float: left;
	}

	.items .item .title {
		width: calc(100% - 240rpx);
		height: 50rpx;
		line-height: 50rpx;
		font-size: 32rpx;
		color: #2f3640;
		margin-left: 20rpx;
		float: left;
		font-weight: bold;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.items .item .desc {
		width: calc(100% - 240rpx);
		height: 40rpx;
		line-height: 40rpx;
		font-size: 26rpx;
		color: #888;
		margin-left: 20rpx;
		font-weight: 400;
		float: left;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.uni-swiper-tab {
		border-bottom: 0upx;
	}

	.items .item .tag {
		height: 26rpx;
		line-height: 26rpx;
		font-size: 18rpx;
		color: #ccc;
		margin-left: 20rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
		border: solid 1rpx #ccc;
		border-radius: 26rpx;
		float: left;
		margin-top: 10rpx;
	}

	.items .item .info {
		width: calc(100% - 240rpx);
		margin-left: 20rpx;
		margin-top: 10rpx;
		float: left;
		display: flex;
		align-items: baseline;
	}

	.items .item .info .sales {
		font-size: 26rpx;
		color: #888;
	}

	.items .item .info .price {
		font-size: 36rpx;
		color: #e84118;
		font-weight: bold;
		margin-left: auto;
	}

	.items .item .info .sub-price {
		font-size: 18rpx;
		color: #e84118;
		font-weight: bold;
	}

	.items .item .info .cost-price {
		font-size: 18rpx;
		color: #888;
		text-decoration: line-through;
		margin-left: 20rpx;
	}

	.items .item .info .goods_unit {
		font-size: 18rpx;
		color: #888;
		margin-left: 10rpx;
	}


	.items .item .bottom {
		width: calc(100% - 240rpx);
		position: absolute;
		right: 0rpx;
		bottom: 30rpx;
		display: flex;
	}

	.items .item .bottom .progress {
		width: calc(100% - 220rpx);
		height: 50rpx;
	}

	.items .item .bottom .progress uni-progress {
		margin-top: 4rpx;
		width: 100%;
	}

	.items .item .bottom .progress text {
		width: calc(100% - 220rpx);
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		position: absolute;
		top: 0;
		left: 0;
		font-size: 24rpx;
		color: #fff;
	}

	.items .item .bottom .buy-container {
		margin-left: auto;
		width: 140rpx;
		height: 50rpx;
	}

	.items .item .bottom .buy {
		width: 140rpx;
		height: 50rpx;
		line-height: 50rpx;
		background: #e84118;
		border-radius: 25rpx;
		text-align: center;
		font-size: 20rpx;
		color: #fff;
		font-weight: 500;
	}

	/* .items .item .bottom .buy {
		height: 50upx;
		line-height: 50upx;
		width: 140upx;
		margin-left: auto;
	} */
	.cart-container {
		width: 60upx;
		height: 60upx;
		line-height: 60up;
		border-radius: 50%;
		background: #1dc422;
		align-items: center;
		justify-content: center;
		display: flex;
		margin-left: 70upx;
	}

	.add-reduce-container {
		height: 50upx;
	}

	.row-container {
		display: flex;
		flex-direction: row;
	}

	.btn-container {
		width: 50upx;
		height: 50upx;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	uni-progress,
	.uni-progress-bar,
	.uni-progress-inner-bar {
		border-radius: 15px !important;
	}

	.sale-out {
		width: 150upx;
		height: 150upx;
		border-radius: 50%;
		color: white;
		background: black;
		opacity: 0.7;
		text-align: center;
		line-height: 150upx;
		position: absolute;
		margin-left: 35upx;
		margin-top: 35upx;
	}
</style>
