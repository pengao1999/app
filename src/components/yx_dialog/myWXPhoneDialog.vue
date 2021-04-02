<template>
	<view v-if="propData.show">
	<view @tap="phoneGrant" class="isMaskPhone"></view>
	<view class="isPhone">
		<view class="loginTitle">微信授权</view>
		<view class="shopImg">
			<span>友邻优选将获取你的手机号</span>
		</view>
		<view class="isLoginBtn">
			<navigator url="/pkUserInfo/info/phone">取消</navigator>
			<button @getphonenumber="getPhoneNumber" open-type="getPhoneNumber">同意</button>
		</view>
	</view>
	</view>
</template>

<script>
	export default {
		props: {
			propData: {
				type: Object,
				default() {
					return {}
				}
			}
		},
		methods: {
			getPhoneNumber: function(e) {
				if (e.detail.errMsg === 'getPhoneNumber:ok') {
					this.$emit('getPhoneNumber', e.detail)
				}
			}
		}
	}
</script>

<style lang="scss">
	.isMaskPhone {
	  width: 100%;
	  height: 100%;
	  position: fixed;
	  top: 0;
	  left: 0;
	  z-index: 1000;
	  background: #000;
	  opacity: 0.5;
	}
	
	.isPhone {
	  position: fixed;
	  width: 480rpx;
	  height: 250rpx;
	  background: #fff;
	  top: 50%;
	  left: 50%;
	  margin-left: -265rpx;
	  margin-top: -185rpx;
	  z-index: 1001;
	  padding: 50rpx 50rpx;
	  border-radius: 12rpx;
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
