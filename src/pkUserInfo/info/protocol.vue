<template>
	<view>
		<view class='col' @tap='protocol(10)'>
		  <text class='name'>用户协议</text>
		  <image class='arrow' src='../../static/ic_arrow_right.png'></image>
		</view>
		<view class='col' @tap='protocol(11)'>
		  <text class='name'>社区电商隐私政策</text>
		  <image class='arrow' src='../../static/ic_arrow_right.png'></image>
		</view>
	</view>
</template>

<script>
	export default {
		methods: {
			protocol: function(id) {
				uni.navigateTo({
					url: '/pkUserInfo/info/protocolDetails?id='+id
				})
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
		onShareAppMessage() {
			return {
				title: '友邻优选-大家都在用的社区团购APP',
				path: '/pages/index/main?user_key='+this.userInfo.user_key+'&i='+this.globalI
			}
		}
	}
</script>

<style>
	page {
	  background: #fff;
	}

	.col {
	  width: calc(100% -52rpx);
	  height: 100rpx;
	  margin-left: 26rpx;
	  margin-right: 26rpx;
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  border-bottom: solid 1rpx #F6F6F6;
	}

	.col .name {
	  font-size: 28rpx;
	  font-weight: 500;
	  color: #333;
	}

	.col .arrow{
	  width: 20rpx;
	  height: 20rpx;
	}

</style>
