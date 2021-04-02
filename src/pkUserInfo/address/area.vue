<template>
	<view>
		<view class="cu-bar bg-white search fixed" style="background:white;box-shadow: 0 1upx 6upx rgba(0, 0, 0, 0.1);">
			<view class="search-form round">
				<text class="icon-search"></text>
				<input type="text" placeholder="请输入店铺名称" v-model="key" @confirm="getHotCity(true)"></input>
			</view>
			<view style="padding-right: 30upx;" @click="showRightDrawer=true">地区</view>
		</view>
		<view style="margin-top:100upx;">
			<view class="title" style="margin-left: 20upx;padding-top: 30upx;">为您推荐</view>
			<view class="store" v-for="(store, sIndex) in stores" @click="selectStore(store)" :key="store.app_key">
				<image class="store-avatar" :src="store.avatar?imgRoot+store.avatar:'/static/ic_notstore.jpg'"></image>
				<view class="store-content">
					<view class="title row-container">
						<view>{{store.store_name}}</view>
						<view class="text-green" style="margin-left: auto;">距离{{store.distance_desc}}</view>
					</view>
					<view class="store-address two-line-dot">{{store.address}}</view>
					<view class="store-goods">
						<view class="good" v-for="(good, gIndex) in store.goods" v-if="store.goods.length>0" :key="gIndex">
							<image :src="imgRoot+good.pic"></image>
							<view class="two-line-dot">{{good.name}}</view>
							<view class="money">¥ {{good.price}}</view>
						</view>
						<view class="good" v-for="(good,index) in 3" :key="index" v-else>
							<image src="/static/ic_non%20product.png"></image>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="cu-modal drawer-modal justify-end" :class="showRightDrawer?'show':''" @click="showRightDrawer=false">
			<view class="cu-dialog basis-lg" @tap.stop="" >
				<view class="cu-list menu text-left" style="padding: 30upx;">
					<view class="title">当前定位</view>
					<button class="cu-btn bg-gray round" @click="showRightDrawer=false">
						<text class="icon-loading2 iconfont-spin" v-if="!city"></text> {{city ? city:'定位中'}}</button>
					<view class="title" style="margin-top: 20upx;">热门城市</view>
					<!-- <button class="cu-btn bg-gray round mrg-right-10" @click="selectCity('济南')">济南</button>
					<button class="cu-btn bg-gray round mrg-right-10" @click="selectCity('郑州')">郑州</button> -->
					<button class="cu-btn bg-gray round mrg-right-10" v-for="(city, index) in hotCitys" :key="index" @tap="selectCity(city)">{{city.label}}</button>

					<!-- <view class="title" style="margin-top: 20upx;">选择位置</view>
					<uni-collapse accordion="true">
						<uni-collapse-item v-for="(city, idx) in cityList" :key="idx" :title="city.label" :cityList="city.children" @chooseCity="chooseCity">
							<view class="item" v-for="(city, cIndex) in cityList[0].children" @tap="chooseCity(city.label)" :key="cIndex">
								{{city.label}}
							</view>
						</uni-collapse-item>
					</uni-collapse> -->
				</view>
			</view>
		</view>
		<!-- <view class="item-letter">当前定位</view>
		<view class='current' @tap="chooseCity(city)">
			<view class="current-city">{{city}}</view>
			<view class='location' @tap='getLocation'>{{isGettingUserLocation? "定位中..." : city?'GPS定位':'定位失败'}}</view>
		</view> -->
		<!-- <view class="hot-history-citys">
			<view class="title">热门</view>
			<view class="item-container">
				<view class="city-item" v-for="(city, index) in hotCitys" :key="index" @tap="chooseCity(city)">{{city.store_name}}</view>
			</view>
			<view class="title" v-if="historyCitys.length">历史记录</view>
			<view class="item-container">
				<view class="city-item" v-for="(city, index) in historyCitys" :key="index"  @tap="chooseCity(city)">{{city.store_name}}</view>
			</view>
		</view> -->
		<!-- <view class="item-letter">选择位置</view>
		<uni-collapse accordion="true">
			<uni-collapse-item v-for="(city, idx) in cityList" :key="idx" :title="city.label" :cityList="city.children" @chooseCity="chooseCity">
				<view class="item" v-for="(city, cIndex) in cityList[0].children" @tap="chooseCity(city.label)" :key="cIndex">
					{{city.label}}
				</view>
			</uni-collapse-item>
		</uni-collapse> -->

	</view>
</template>

<script>
	import Config from '../../common/js/Config.js'
	import QQMapWX from '../../common/third/qqmap/qqmap-wx-jssdk.js'
	import cityData from '../../common/js/City.js'
	import Util from '../../common/js/util.js'
	import Toast from '../../common/js/toast.js'

	import uniCollapse from '../../components/uni-collapse.vue'
	import uniCollapseItem from '../../components/uni-collapse-item.vue'
	import {mapMutations} from 'vuex'

	var qqMap = new QQMapWX({
		key: Config.QQMAPKEY // 必填
	});
	const COME_FROM_INDEX = '1'
	const COME_FROM_ADDRESS = '0'
	export default {
		data() {
			return {
				comePage: 0,
				searchLetter: [],
				showLetter: "",
				winHeight: 0,
				// tHeight: 0,
				// bHeight: 0,
				cityList: cityData,
				isShowLetter: false,
				scrollTop: 0, //置顶高度
				scrollTopId: '', //置顶id
				systemInfo: {},
				city: '' ,//当前城市
				timer: Object ,//定时器,
				userLocation: undefined, //用户当前定位
				isGettingUserLocation: true, //正在获取用户当前定位
				isGettingLocation: false, //正在定位
				stores:[],
				hotCitys: [
					{"value":370100,"label":"济南市"},
					{"value":410100,"label":"郑州市"}
				], //热门城市列表
				historyCitys: [], //历史记录
				showRightDrawer: false,
				imgRoot: '',
				key: '',
				currentPage: 1,
				latitude: 0,
				longitude: 0,
			}
		},
		components: {uniCollapse, uniCollapseItem},
		mixins: [Toast],
		watch: {
			userLocation: {
				handler() {
					if (this.userLocation !== undefined) {
						this.city = this.userLocation.city
					}
				},
				immediate: true
			},
			systemInfo: {
				handler() {
					if (!Util.isEmptyObject(this.systemInfo)) {
						this.winHeight = this.systemInfo.windowHeight
					}
				},
				deep: true
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
			this.comePage = options.page
			this.initPage()
			this.getUserLocation()
		},
		methods: {
			...mapMutations(['setUserCustomLocation', 'setRefreshCart', 'setUuid', 'setStore', 'setUserInfo']),
			initPage: function() {
				let self = this
				// self.getHotCity(true)

				self.historyCitys = Object.assign([], self.getHistorayCity())
			},
			getUserLocation: function() {
				let self = this
				uni.getLocation({
					type: "wgs84",
					success: (res) => {
						self.getQQMapLocation(res)
					},
					fail: (res) => {
						self.isGettingUserLocation = false
					}
				})
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
						self.userLocation = userLocation
						self.latitude=location.latitude
						self.longitude=location.longitude
						self.getHotCity(true)
					},
					fail: function(res) {},
					complete: function(res) {
						self.isGettingUserLocation = false
					}
				});
			},
			getHotCity: function(isForce) {
				let self = this
				if (isForce) {
					self.stores = []
					self.currentPage = 1
				}
				let postData = {
					page: self.currentPage,
					key: self.key,
					latitude: self.latitude,
					longitude: self.longitude,
				}
				self.toast({
					type: 'loading'
				})
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getCity, postData).then((res) => {
					self.toast(true)
					res = res.data
					if (res.code === 0) {
						self.currentPage ++;
						res.data.forEach((store, index) => {
							if (store.distance > 1000) {
								store.distance_desc = (store.distance/1000).toFixed(2) + 'km'
							} else {
								store.distance_desc = store.distance + 'm'
							}
						})
						self.stores = Object.assign([], res.data)
						self.imgRoot = res.other.img_root
					}
				})
			},
			bindUuid: function(app_key) {
				let self = this
				if (!self.userInfo) return
				let postData = {
					user_key: self.userInfo.user_key,
					app_key: app_key,
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.bindUuid, postData).then((res) => {
					res = res.data
					if (res.code === 0) {
						self.setUuid(app_key)
						self.setUserInfo({bind_uuid: app_key})
					}
				})
			},
			resetTimeOut: function() {
				let self = this
				clearTimeout(self.timer)
				self.timer = setTimeout(() => {
					self.isShowLetter = false
				}, 1000)
			},
			clickLetter: function(letter) {
				let self = this
				self.showLetter = letter
				self.isShowLetter = true
				self.scrollTopId = letter
				self.resetTimeOut()
			},
			selectCity: function(city) {
				this.showRightDrawer=false
				this.getCoordinate(city)
			},
			selectStore:function(store){
				this.setRefreshCart(true)
                this.setUuid(store.app_key)
				this.bindUuid(store.app_key)
                uni.reLaunch({
                    url: '/pages/index/main'
                })
			},
			getCoordinate: function(city) {
				var self = this
				if (self.isGettingLocation) return
				self.isGettingLocation = true
				qqMap.geocoder({
					address: city.label,
					success: (res) => {
						console.log(res)
						var location = {
							latitude: res.result.location.lat,
							longitude: res.result.location.lng,
							city: city
						}
						self.latitude=location.location.lat
						self.longitude=location.location.lng
						// self.userLocation=location
						self.setUserCustomLocation(location)
						this.getHotCity(true)

						// if (self.comePage === COME_FROM_ADDRESS) {
						// 	uni.navigateBack({
						// 		delta: 1
						// 	})
						// } else if (self.comePage === COME_FROM_INDEX) {
						// 	uni.redirectTo({
						// 		url: '/pkUserInfo/address/address'
						// 	})
						// }
					},
					fail: (res) => {
					},
					complete: (res) => {
						console.log(res)
						self.isGettingLocation = false
					}
				});
			},
			setHistoryCity: function(city) {
				let historyCitys = uni.getStorageSync('historyCitys')
				if (historyCitys===undefined || historyCitys === '') {
					historyCitys = []
				}
				if (historyCitys.indexOf(city) !== -1) return
				historyCitys.push(city)
				uni.setStorageSync('historyCitys', historyCitys)
			},
			getHistorayCity: function() {
				return uni.getStorageSync('historyCitys') || []
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

<style lang="scss">
	page {
		background: #fff;
	}
	.title {
		font-size: 34upx;
		font-weight: bold;
		color: black;
		margin-bottom: 10upx;
	}
	.store {
		padding: 20upx;
		border-bottom: 1px solid #E6E6E6;
		display: flex;
		flex-direction: row;
		.store-avatar {
			width: 170upx;
			height: 170upx;
		}
		.store-content {
			width: 500upx;
			padding: 0 20upx;
			display: flex;
			flex-direction: column;
			.store-address {
				color: #666;
				font-size: 28upx;
			}
			.store-goods {
				display: flex;
				flex-direction: row;
				.good {
					width: 160upx;
					display: flex;
					flex-direction: column;
					margin-right: 20upx;
					image {
						width: 160upx;
						height: 160upx;
						background: #f6f6f6;
					}
					.money {
						color: #FF3200;
					}
				}
			}
		}
	}
	/* .item-letter {
	  width: calc(100% - 48rpx);
	  padding-left: 24rpx;
	  padding-right: 24rpx;
	  height: 60rpx;
	  line-height: 60rpx;
	  background: #f6f6f6;
	  font-size: 24rpx;
	  color: #999;
	  font-weight: 500;
	}
	.current {
	  width: calc(100% -48rpx);
	  height: 160rpx;
	  background: #fff;
	  padding-left: 24rpx;
	  padding-right: 24rpx;
	  display: flex;
	  align-items: center;
	}

	.current-city {
	  font-size: 48rpx;
	  font-weight: bold;
	  color: #05bf0a;
	}
	.hot-history-citys {
		width: 100%;
		background: #F6F6F6;
		display: flex;
		flex-direction: column;
	}
	.hot-history-citys .title {
		font-size: 24upx;
		font-weight: 500;
		color: #999;
		margin-left: 24upx;
		margin-top: 20upx;
	}
	.hot-history-citys .item-container {
		width: calc(100% - 48rpx);
		padding: 10upx 24upx;
		display:-webkit-box;
		display:-webkit-flex;
		display:-ms-flexbox;
		display:flex;
		-webkit-flex-wrap:wrap;
		-ms-flex-wrap:wrap;
		flex-wrap:wrap;
		overflow:hidden;
	}
	.hot-history-citys .item-container .city-item {
		width: 210upx;
		background: white;
		padding: 15upx auto;
		color: inherit;
		padding: 5upx auto;
		border-radius: 10upx;
		font-size: 32upx;
		text-align: center;
	}
	.hot-history-citys .item-container .city-item:nth-child(n+2) {
		margin-left: 15upx;
	}
	.hot-history-citys .item-container .city-item:nth-child(3n+1) {
		margin-left: 0upx;
	}
	.hot-history-citys .item-container .city-item:nth-child(n+4) {
		margin-top: 15upx;
	}
	.location {
	  font-size: 24rpx;
	  font-weight: 500;
	  color: #999;
	  margin-left: 30rpx;
	}
	.item {
		width: calc(100%-30rpx);
		margin-left: 30upx;
		height: 80upx;
		line-height: 80upx;
		border-bottom: 1upx solid #EEE;
	} */

</style>
