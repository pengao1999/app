<template>
	<view class="cu-modal bottom-modal" @click="close" :class="show?'show':''">
		<view class="cu-dialog bg-white" @click.stop="donthide" style="min-height:1150upx;">
			<view class="cu-bar">
				<view class="title text-black" style="margin-left: 20upx;">配送方式</view>
				<text class="icon-close" style="margin-right: 20upx;font-size: 40upx;" @click="close"></text>
			</view>

			<view class="content">
				<view class="cu-tag round border tag" v-if="devliery_home_switch=='1'" @click="selectPattern('home')" :class="pattern=='home'?'select-tag':'un-select-tag'">送货到家</view>
				<view class="cu-tag round border tag" v-if="devliery_leader_switch=='1'" @click="selectPattern('self')" :class="pattern=='self'?'select-tag':'un-select-tag'">上门自提</view>
			</view>
			<view class="cu-list menu" v-if="pattern=='home'">
				<view class="cu-item" style="padding-left: 0upx;">
					<view class="content">
						<text class="icon-recharge text-green"></text>
						<text class="text-black">运费</text>
					</view>
					<view class="action">
						{{devliery_cost_setting}}元
					</view>
				</view>
				<view class="cu-item bottom-border" style="padding-left: 0upx;">
					<view class="content">
						<text class="icon-countdown text-green"></text>
						<text class="text-black">备货期</text>
					</view>
					<view class="action">
						{{delivery_stocking_period}} 天
					</view>
				</view>

				<view class="cu-item bottom-border" style="padding-left: 0upx;">
					<view class="content">
						<text class="icon-countdown text-green"></text>
						<text class="text-black">最早起送日</text>
					</view>
					<view class="action">
						{{delivery_day}}
					</view>
				</view>
			</view>
			<scroll-view scroll-y style="height: 780upx;text-align: left;" v-if="pattern=='self'">
				<radio-group class="item row-container" @click="toLeaderList" style="padding:20upx;border-bottom: 1upx solid #F6F6F6;padding-bottom: 20upx;padding-top: 10upx;" v-for="(store, index) in olist" v-if="olist.length>0" :key="index">
					<image class="cu-avatar round bg-gray" style="width: 80upx;height: 80upx;margin-top: 15upx;" :src="store.img"></image>
					<view class="coloum-container store-info" style="margin-left: 20upx;">
						<view>自提点：{{store.name}}</view>
						<view class="title">地址：{{store.address}}</view>
					</view>
					<view class="select icon-right"></view>
				</radio-group>
				<radio-group class="item row-container" @click="toLeaderList" style="padding:20upx;border-bottom: 1upx solid #F6F6F6;padding-bottom: 20upx;padding-top: 10upx;"  v-if="olist.length==0">
					<image class="cu-avatar round bg-gray" style="width: 80upx;height: 80upx;margin-top: 15upx;" :src="store.img"></image>
					<view class="coloum-container store-info" style="margin-left: 20upx;">
						<view>无自提点历史记录</view>
						<view class="title">请点击选择附近自提点</view>
					</view>
					<view class="select icon-right"></view>
				</radio-group>
				<view class="cu-list menu">
					<view class="cu-item" style="padding-left: 0upx;">
						<view class="content">
							<text class="icon-recharge text-green"></text>
							<text class="text-black">运费</text>
						</view>
						<view class="action">
							0元
						</view>
					</view>
					<view class="cu-item bottom-border" style="padding-left: 0upx;">
						<view class="content">
							<text class="icon-countdown text-green"></text>
							<text class="text-black">预计到达日期</text>
						</view>
						<view class="action">
							{{delivery_day}}
						</view>
					</view>
				</view>
			</scroll-view>
			<button class="cu-btn btn bg-green round" @click="submit">保存</button>
		</view>
	</view>
</template>

<script>
	import Config from '../../common/js/Config.js'
	import Toast from '../../common/js/toast.js'
	import Util from '../../common/js/util.js'

	export default {
		data() {
			return {
				pattern: 'home',
				userLocation: {},
				isLoadingData: false,
				olist: [],
				currentPage: [],
				loadingType: 1,
				selectStoreIndex: -1,
				delivery_day: ''
			}
		},
		props: {
			show: {
				type: Boolean,
				default: false
			},
			devliery_home_switch: {
				type: String,
				default: '1'
			},
			devliery_leader_switch: {
				type: String,
				default: '1'
			},
			delivery_stocking_period: {
				type: String,
				default: '1'
			},
			devliery_cost_setting: {
				type: String,
				default: '1'
			}
		},
		watch: {
			devliery_home_switch: {
				handler() {
					if (this.devliery_home_switch === '0') {
						this.selectPattern('self')
					} else {
						this.selectPattern('home')
					}
				},
				immediate: true
			},
			delivery_stocking_period: {
				handler() {
					this.delivery_day = Util.timestampToTime(parseInt(this.delivery_stocking_period))
				},
				immediate: true
			}
		},
		mixins: [Toast],
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			}
		},
		created() {
			let self = this
			self.$event.$on(Config.EVENT.REFRESH_DEFAULT_LEADER, ({}) => {
				self.getCityNearLeaderList(true)
			})
		},
		methods: {
			selectPattern(pattern) {
				this.pattern = pattern
				if (this.pattern === 'self') {
					if (this.olist.length === 0) {
						if (!Util.isEmptyObject(this.userLocation)) {
							this.getCityNearLeaderList(this.userLocation)
						} else {
							this.getCityNearLeaderList(true)
						}
					}
				}
			},
			getCityNearLeaderList: function(isForce=false) {
				let self = this;
				if (self.isLoadingData&&!isForce) {
					return
				}
				self.isLoadingData = true
				if(isForce){
					self.olist = []
				}
				let data =  {
					user_key: self.userInfo.user_key
				}
				self.toast({
					type: 'loading'
				})
				self.$http.post(Config.URLS.getDefaultLeader, data).then((res)=> {
					self.toast(true)
					self.isLoadingData = false
					res = res.data
					if (res.data) self.olist.push(res.data)
				})
				this.currentPage++
			},
			checkChange: function(e) {
				this.selectStoreIndex = parseInt(e.detail.value)
			},
			donthide: function() {

			},
			close: function() {
				this.$emit('close')
			},
			submit: function() {
				if (this.pattern === 'home') {
					this.$emit('modeHome')
				} else {
					if (this.olist.length === 0) {
						this.toast({
							desc: '无自提点可选'
						})
						return
					}
					this.$emit('modeSelf', this.olist[0])
				}
			},
			toLeaderList: function() {
				uni.navigateTo({
					url: '/pkUserInfo/address/address'
				})
			}
		}

	}
</script>

<style>
	.title {
		font-size: 30upx;
		font-weight: bold;
		margin-bottom: 10upx;
	}
	.content {
		text-align: left;
		padding:20upx;
	}
	.tag {
		height: 70upx;
		min-width: 120upx;
		padding: 10upx 30upx;
		font-size: 32upx;
		border: 1upx solid #F1F1F1;
	}
	.un-select-tag {
		background: white;
	}
	.select-tag {
		border-color: var(--red);
		color: var(--red);
	}
	.store-info {
		width: 70%;
	}
	.select {
		position: absolute;
		right: 40upx;
		margin-top: 50upx;
	}
	.btn {
		width: 690upx;
		height: 80upx;
		position: fixed;
		bottom: 30upx;
		left: 30upx;
	}
</style>
