<template>
	<view>
		<view class="isMaskPhone" v-if="showPositionDialog"></view>
		<view class="isPhone" v-if="showPositionDialog">
		  <!-- #ifdef MP-WEIXIN -->
		  <view class="loginTitle">微信授权</view>
		  <!-- #endif -->
		  <!-- #ifdef APP-PLUS -->
		  <view class="loginTitle">定位授权</view>
		  <!-- #endif -->
		  <!-- #ifdef H5 -->
		   <view class="loginTitle">定位失败</view>
		  <!-- #endif -->
		  <view class="shopImg">
			 <!-- #ifdef MP-WEIXIN || APP-PLUS -->
			<span>开启定位权限才能正常使用喔~</span>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<span>选择位置才能正常使用喔~</span>
			<!-- #endif -->
		  </view>
		  <view class="isLoginBtn">
			<!-- #ifdef MP-WEIXIN -->
			<button @opensetting="handlerEvent" open-type="openSetting"><text>去开启</text></button>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS || H5 -->
			<button @tap="authFail"><text>去开启</text></button>
			<!-- #endif -->
		  </view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			showPositionDialog: {
				type: Boolean,
				default: false
			}
		},
		onLoad() {
			console.log('showPositionDialog')
		},
		methods: {
			handlerEvent: function(res) {
				let self = this
				console.log(res)
				if (res.detail.authSetting["scope.userLocation"]) {
					self.$emit('authLocation', true);
				} else {
					self.$emit('authLocation', false);
				}
			},
			authFail: function() {
				this.$emit('authLocation', false);
			}
		}
	}
</script>

<style>
	.isMaskPhone {
	  width: 100%;
	  height: 100%;
	  position: fixed;
	  top: 0;
	  left: 0;
	  z-index: 10000;
	  background: #000;
	  opacity: 0.5;
	}

	.isPhone {
	  position: absolute;
	  width: 480rpx;
	  height: 250rpx;
	  background: #fff;
	  left: calc(50% - 290rpx);
	  top: calc(50% - 175rpx);
	  z-index: 10001;
	  padding: 50rpx 50rpx;
	  border-radius: 12rpx;
	}

	.isLoginBtn {
	  display: flex;
	  justify-content: space-around;
	}

	.isLoginBtn button {
	  background: #1dc422;
	  height: 80rpx;
	  line-height: 80rpx;
	  font-size: 30rpx;
	  width: 300rpx;
	  text-align: center;
	  color: #fff;
	  border-radius: 50rpx;
	}

	.loginTitle {
		font-size: 34rpx;
	}

	.shopImg {
		height: 80rpx;
		display: flex;
		align-items: center;
		padding: 20rpx 0rpx;
		justify-content: center;
		font-size: 28rpx;
	}

	.shopImg>image {
		margin: 0 14rpx 0 0;
		width: 68rpx;
		height: 68rpx;
		border-radius: 50%;
	}

</style>
