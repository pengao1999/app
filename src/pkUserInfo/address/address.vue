<template>
	<view>
		<view class="cu-bar search fixed">
			<view class="search-form round">
				<text class="icon-search"></text>
				<input type="text" placeholder="请输入小区名称" v-model="keyword"  @input='inputKeyword' @confirm="search"></input>
			</view>
		</view>
		<view class="fixed-top">
			<view class='top'></view>
			<view style="background-image: url('../../static/top_bg.png');" class='top-bg-img'></view>
		</view>
		<scroll-view scroll-y="true" style="width: 100%; display: flex; flex-direction: column; " :style="'height:'+windowHeight+'px;'"
		 upper-threshold="50" @scrolltolower="loadMore()">
		<view class='items fade-in'>
		  <view class='item' @tap='selectGroup(item)' v-for="item in olist" :key="item.id">
			<view class='item-top'>
			  <image class='head-img' :src="item.pic?item.pic:'../../static/img-default-image.png'"></image>
			  <text class='name'>{{item.community}}</text>
			  <text class='range'>距离{{item.distance/1000}}Km</text>
			</view>
			<view class='group'>
			  <image src='../../static/ic_group.png'></image>
			  <text>{{item.name}}</text>
			</view>
			<view class='address'>
			  <image src='../../static/ic_coordinate_gray.png'></image>
			  <text @tap.stop='openMap(item)'>{{item.address}}</text>
			</view>
		  </view>
		  <view class="more_leader">
		  	<uni-load-more v-if="is_load_more" class = "more_leader"   :loadingType="loadingType" :contentText="contentText"></uni-load-more>
		  </view>
		</view>
		</scroll-view>
		<!-- <view style="height: 150rpx;"></view> -->
	</view>
</template>

<script>
	import Config from '../../common/js/Config.js'
	import QQMapWX from '../../common/third/qqmap/qqmap-wx-jssdk.js'
	import Util from '../../common/js/util.js'
	import UniLoadMore from '../../components/uni-load-more.vue'
	import Toast from '../../common/js/toast.js'
	import {mapMutations} from 'vuex'
	import Auth from '../../pages/auth.js'

	var qqMap = new QQMapWX({
	  key: Config.QQMAPKEY // 必填
	});

	export default {
		data() {
			return {
				is_load_more: 0,
				address: "请选择地址",
				page: 1,
				limit: 10,
				olist: [],
				keyword: '',
				currentPage: 1,
				location: {},
				addressKeyVal: '',
				isGettingLocation: false,
				i:8,
				//fanxiaojiao
				loadingType: 1,
				isLoadingData: false,
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				},
				isTryGetLocation: false,
				userLocation: {},
				systemInfo:{},
				windowHeight:0,
			}
		},
		components: {UniLoadMore},
		mixins: [Toast,Auth],
		computed: {
			// userLocation() {
			// 	return this.$store.state.userLocation
			// },
			group() {
				return this.$store.state.group
			},
			userCustomLocation() {
				return this.$store.state.userCustomLocation
			},
			userInfo() {
				return this.$store.state.userInfo
			},
			globalI() {
				return this.$store.state.globalI
			},
			couldModifyGroup() {
				return this.$store.state.couldModifyGroup
			},
			uuid() {
				return this.$store.state.uuid
			}
		},
		watch: {
			systemInfo: {
				handler() {
					if (!Util.isEmptyObject(this.systemInfo)) {
						this.windowHeight = this.systemInfo.windowHeight
						console.log("windowHeight:"+this.windowHeight)
					}
				}
			}
		},
		onLoad(options) {
			let self = this
			// #ifdef MP-WEIXIN || APP-PLUS
			self.checkUserLocation()
			// #endif
			// #ifdef H5
			self.getCityNearLeaderList({})
			// #endif
			uni.getSystemInfo({
				success(system) {
					console.log(JSON.stringify(system))
					if (system.errMsg === "getSystemInfo:ok") {
						self.systemInfo = system
					}
				}
			})
		},
		methods: {
			...mapMutations(['setUserLocation','setCouldModifyGroup','setGroupForce', 'setLoginWx', 'setUserInfo','setGroup','setGlobalI', 'setUserCustomLocation', 'setReLoginByGlobalI']),
			checkUserLocation:function() {
				let self = this
				uni.getLocation({
					type: "wgs84",
					success: (res) => {
						self.getCityNearLeaderList(res)
					},
					fail: (res) => {
						self.getCityNearLeaderList({})
					}
				})
			},
			loginAgain:function(){
				let self = this
				let data = {
					i:self.globalI,
					name: this.userInfo.nickName,
					img: this.userInfo.avatarUrl,
					tel: this.userInfo.tel,
					openid: this.userInfo.openid,
					unionid: self.userInfo.unionid,
				}
				self.$http.post(Config.URLS.wxLogin, data).then((res) => {
					res = res.data
					self.setUserInfo(res.data)
				})
			},
			getNearLeader: function(location) {
				let self = this;
				let data =  {
					i:self.globalI,
					longitude: location.longitude,
					latitude: location.latitude,
					keyword: self.keyword,
					page: 1,
					limit: 1
				}
				self.$http.post(Config.URLS.nearLeader,data).then((res)=> {
					console.log('getNearLeader')
					res = res.data
					self.olist = res.data
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
						self.location = Object.assign(userLocation)
					},
					fail: function(res) {},
					complete: function(res) {
					}
				});
			},
			getCityNearLeaderList: function(location,type, isForce=false) {
				let self = this;
				self.userLocation = location
				if (self.isLoadingData&&!isForce) {
					return
				}
				self.isLoadingData = true
				if(type === 1){
					self.currentPage = 1
				}
				let data =  {
					i:self.globalI,
					longitude: self.userLocation.longitude ? self.userLocation.longitude: 0,
					latitude: self.userLocation.latitude ? self.userLocation.latitude: 0,
					keyword: self.keyword,
					page: this.currentPage,
					limit: Config.PAGE_LIMIT
				}
				self.$http.post(Config.URLS.cityLeader, data).then((res)=> {
					self.isLoadingData = false
					res = res.data
					//加载完毕,没有更多
					if(res.data.length < Config.PAGE_LIMIT){
						this.loadingType = 2
					}else{
						this.loadingType = 0
					}
					let list = []
					if (type === 1) {
						list = res.data
					} else {
						list = self.olist.concat(res.data)
					}
					self.olist = Object.assign(list)
					for (var i=0; i<4; i++) {
						setTimeout(()=>{
							self.olist = Object.assign([], list)
						}, 100)
					}
				})
				this.currentPage++
			},
			toArea: function() {
				uni.navigateTo({
					url: '/pkUserInfo/address/area?page=0'
				})
			},
			inputKeyword: function(e) {
				this.addressKeyVal = e.detail.value
			},
			search: function() {
				this.getCityNearLeaderList(this.userLocation, 1, true)
				// this.getCoordinate(this.location.city + this.addressKeyVal)
			},
			openMap: function(group) {
					uni.openLocation({
							name: group.community,
							latitude: parseFloat(group.latitude),
							longitude: parseFloat(group.longitude),
							success: () => {
								console.log('open map.')
							}
					});
			},
			isUserLogin: function() {
				let self = this
				if ((self.userInfo === undefined) ||
					(self.userInfo != undefined && !Util.containsKey(self.userInfo, 'user_key'))) {
					return false
				}
				return true
			},
			selectGroup: function(group) {
				let self = this
				console.log(group)
				// #ifdef H5
				self.userInfo.bind_leader_key=group.user_key
				self.userInfo.community_name=group.name
				self.userInfo.community_address=group.address
				self.userInfo.community=group.community
				self.setUserInfo(self.userInfo)
				console.log(JSON.stringify(self.userInfo))
				self.$event.$emit(Config.EVENT.REFRESH_DEFAULT_LEADER, {})
				uni.navigateBack()
				return
				// #endif
				if (!this.isUserLogin()) {
					this.loginDialogData = Object.assign({}, this.loginDialogData, {
						show: true
					})
					return
				}
				if (!this.checkLogin()) return
				let postData = {
					user_key : self.userInfo.user_key,
					leader_key : group.user_key
				}
				self.$http.post(Config.URLS.setDefaultLeader, postData).then(res => {
					res = res.data
					if (res.code === 0) {
						self.userInfo.bind_leader_key=group.user_key
						self.userInfo.community=group.community
						self.setUserInfo(self.userInfo)
						console.log(JSON.stringify(self.userInfo))
						uni.navigateBack()
						self.$event.$emit(Config.EVENT.REFRESH_DEFAULT_LEADER, {})
					}
				})
			},

			getCoordinate: function(city) {
					var self = this
					if (self.isGettingLocation) return
					self.isGettingLocation = true
					qqMap.geocoder({
							address: city,
							success: (res) => {
								var location = {
									latitude: res.result.location.lat,
									longitude: res.result.location.lng,
									city: res.result.address_components.city
								}
								self.setUserCustomLocation(location)
						},
						fail: (res) => {
						},
						complete: (res) => {
								self.isGettingLocation = false
						}
					});
			  },
			  loadMore(){
				  this.is_load_more=1;
				  this.loadingType=1;
				  this.getCityNearLeaderList(this.userLocation,0, false);
			  }
		},
		onReachBottom() {
			// this.is_load_more=1;
			// this.loadingType=1;
			// this.getCityNearLeaderList(this.userLocation,0, false);
		},
		onShareAppMessage() {
			return {
				title: '友邻优选-大家都在用的社区团购APP',
				path: '/pages/index/main?user_key='+this.userInfo.user_key+'&i='+self.globalI
			}
		}
	}
</script>

<style>
	@import url("../../common/css/animation");
	page {
	  background: #F6F6F6;
	}

	.top {
	  width: 100%;
	  height: 460rpx;
	  background: #1dc422;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	}

	.top .search {
	  width: calc(100% - 60rpx);
	  height: 68rpx;
	  border-radius: 34rpx;
	  background: #fff;
	  margin-left: 30rpx;
	  margin-right: 30rpx;
	  margin-top: 30rpx;
	  display: flex;
	  align-items: center;
	}

	.top .search .area {
	  width: 120rpx;
	  height: 68rpx;
	  margin-left: 30rpx;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	}

	.top .search .area-text {
	  font-size: 24rpx;
	  font-weight: 500;
	  color: #333;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  white-space: nowrap;
	}

	.top .search .arrow-down {
	  width: 14rpx;
	  height: 14rpx;
	  margin-left: 10rpx;
	  margin-right: 10rpx;
	}

	.top .search .line {
	  width: 1rpx;
	  height: 20rpx;
	  background: #999;
	  margin-left: 10rpx;
	  margin-right: 10rpx;
	}

	.top .search .keyword {
	  height: 68rpx;
	  line-height: 68rpx;
	  font-size: 24rpx;
	  color: #666;
	  width: calc(100% - 260rpx);
	  margin-left: 20rpx;
	}

	.placeholder {
	  font-size: 24rpx;
	  font-weight: 500;
	  color: #999;
	}

	.fixed-top {
		position: fixed;
		top: 0upx;
		width: 100%;
	}

	.top .search .button {
	  width: 28rpx;
	  height: 28rpx;
	  padding: 10rpx;
	}

	.top .head-img {
	  width: 120rpx;
	  height: 120rpx;
	  border-radius: 60rpx;
	  margin-top: 30rpx;
	}

	.top .group-info{
	  width: 100%;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	}

	.top .group-info .nickname {
	  font-size: 28rpx;
	  color: #fff;
	  margin-top: 15rpx;
	  font-weight: bold;
	}

	.top .group-info .community {
	  display: flex;
	  margin-top: 10rpx;
	  justify-content: center;
	  align-items: center;
	}

	.top .group-info .community image {
	  width: 26rpx;
	  height: 26rpx;
	}

	.top .group-info .community text {
	  line-height: 30rpx;
	  font-size: 28rpx;
	  color: #fff;
	  margin-left: 10rpx;
	  font-weight: 500;
	}

	.top .group-info .address {
	  font-size: 20rpx;
	  color: #fff;
	  margin-top: 10rpx;
	  font-weight: 500;
	}

	.top .select-notice{
	  width: 300rpx;
	  height: 80rpx;
	  background: #fff;
	  line-height: 80rpx;
	  text-align: center;
	  font-size: 28rpx;
	  color: #333333;
	  font-weight:500;
	  border-radius:40px;
	  margin: 60rpx;
	}

	.items {
	  width: calc(100% -60rpx);
	  margin-left: 30rpx;
	  margin-right: 30rpx;
	  top: 180rpx;
	  display: flex;
	  flex-direction: column;
	  position: relative;
	}

	.items .item {
	  width: calc(100% - 60rpx);
	  padding: 30rpx;
	  border-radius: 20rpx;
	  background: #fff;
	  box-shadow: 0px 10px 20px 0px rgba(201, 201, 201, 0.1);
	  margin-bottom: 30rpx;
	}

	.items .item .item-top {
	  width: 100%;
	  display: inline-flex;
	  align-items: center;
	}

	.items .item .item-top .head-img {
	  width: 100rpx;
	  height: 100rpx;
	  border-radius: 50%;
	}

	.items .item .item-top .name {
	  width: calc(100% - 320rpx);
	  font-size: 32rpx;
	  color: #333;
	  margin-left: 30rpx;
	  font-weight: 500;
	}

	.items .item .item-top .range {
	  width: 170rpx;
	  text-align: right;
	  font-size: 20rpx;
	  color: #fbc531;
	  margin-left: 20rpx;
	  font-weight: 500;
	}

	.items .item .group {
	  width: 100%;
	  margin-top: 10rpx;
	  display: inline-flex;
	}

	.items .item .group image {
	  width: 30rpx;
	  height: 30rpx;
	}

	.items .item .group text {
	  width: calc(100% - 76rpx);
	  line-height: 36rpx;
	  font-size: 28rpx;
	  color: #333;
	  font-weight: 500;
	  margin-left: 40rpx;
	}

	.items .item .address {
	  width: 100%;
	  margin-top: 10rpx;
	  display: inline-flex;
	}

	.items .item .address image {
	  width: 30rpx;
	  height: 30rpx;
	}

	.items .item .address text {
	  width: calc(100% - 76rpx);
	  line-height: 36rpx;
	  font-size: 24rpx;
	  color: #999;
	  margin-left: 40rpx;
	  font-weight: 500;
	}
	.top-bg-img {
	  width: 100%;
	  height: 60rpx;
	  background-repeat: no-repeat;
	  /* background-size: 100% 100%;
	  -moz-background-size: 100% 100%; */
	}
	.more_leader{
		display: flex;
		flex-direction: column;
		position: relative;
	}
</style>
