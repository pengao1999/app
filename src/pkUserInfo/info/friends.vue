<template>
	<!-- 邀请好友 -->
	<view>
		<view class="Friend-top">
			<view class="tip1">邀请好友，获得优惠券</view>
			<view class="tip2">已成功邀请<text class="num">{{total_num || 0}}</text>人</view>
		</view>
		<view class="invite-container">
			<view class="circle-top"></view>
			<view class="tip1" style="margin-top: 0upx;"> 每邀请{{coupon_invite_total}}人，可获取一张优惠券 </view>
			<button class="btn" open-type="share"> 现在邀请 </button>
		</view>
		<view class="line"></view>
		<view class="friends-container">
			<view class="tip1">已邀请好友列表</view>
			<view class="friends">
				<image v-for="(item, index) in friends" :key="index" class="friend" :src="item.img"></image>
			</view>
		</view>
	</view>
	<!-- 邀请好友 -->
</template>

<script>
	import Config from '../../common/js/Config.js'
	import toast from '../../common/js/toast.js'
	import Util from '../../common/js/util.js'
	
	import ErrorTip from '../../components/yx_dialog/myErrorTip.vue'
	
	import {mapMutations} from 'vuex'
	export default {
		data() {
			return {
				total_num: '',//总的好友人数
				friends:[],//已邀请的好友列表
				coupon_invite_total: 0, //邀请满coupon_invite_total人数送优惠券
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
			this.initPage()
		},
		
		methods:{
			//点击事件,现在邀请,跳转到分享页
			initPage: function() {
				this.getFriendList()
			},
			getFriendList: function() {
				let self = this
				let data = {
					user_key : self.userInfo.user_key,//传递参数,用户user_key
				}
				self.$http.post(Config.URLS.inviteDetail, data).then((res) => {
					res = res.data
					if (res.code === 0) {
						self.total_num = res.data.total_num
						self.friends = res.data.list
						self.coupon_invite_total = res.data.coupon_invite_total
					}
				})
			},
		},
		onShareAppMessage() {
			console.log('/pages/index/main?invite_id='+this.userInfo.user_key)
			return {
				title: '友邻优选-大家都在用的社区团购APP',
				path: '/pages/index/main?user_key='+this.userInfo.user_key+'&leader_key='+this.userInfo.user_key+'&i='+this.globalI
			}
		}
		
	}
</script>

<style>
	.Friend-top {
		width: 100%;
		height: 300upx;
		background: #FFE7BA;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.tip1 {
		font-size: 30upx;
		font-weight: bold;
		margin-top: 20upx;
	}
	.tip2 {
		margin-top: 40upx;
		font-size: 40upx;
		color: #F4A460;
	}
	.circle-top {
		width: 100upx;
		height: 100upx;
		background: white;
		border-radius: 50upx;
		margin-top: -30upx;
	}
	.num {
		font-size: 32upx;
		border: 1upx solid #F4A460;
		padding: 0upx 10upx;
		border-radius: 10upx;
		margin-left: 8upx;
		margin-right: 8upx;
	}
	.invite-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.btn {
		margin-top: 40upx;
		font-size: 30upx;
		width: 500upx;
		height: 88upx;
		background: #1dc422;
		text-align: center;
		color: white;
		line-height: 88upx;
		border-radius: 44upx;
	}
	.line {
		width: 100%;
		height: 20upx;
		background: #F8F8F8;
		margin-top: 50upx;
	}
	.friends-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.friends {
		padding:15rpx 46rpx;
		display:-webkit-box;
		display:-webkit-flex;
		display:-ms-flexbox;
		display:flex;
		align-items: left;
		-webkit-flex-wrap:wrap;
		-ms-flex-wrap:wrap;
		flex-wrap:wrap;
		overflow:hidden;
	}
	.friend {
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		margin: 15upx;
		background: red;
	}
</style>
