<template>
	<view>
		<view class="isMaskPhone" v-if="showPositionDialog"></view>
		<view class="isPhone" v-if="showPositionDialog">
		  <view class="loginTitle">提示</view>
		  <view class="shopImg">
			<span>您的附近没有运营中心，请进入列表选择～</span>
		  </view>
		  <view class="isLoginBtn">
			<button @tap="enter"><text>去选择</text></button>
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
			enter: function() {
				this.$emit('enter');
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
