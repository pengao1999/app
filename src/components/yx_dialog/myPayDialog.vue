<template>
	<view v-if="show">
		<view class="PayDialog-mask" @tap.stop="close"></view>
		<view class="PayDialog-bottom slide-up">
			<view class='pays'>
				<view class='PayDialog-top'>
				  <text>支付方式</text>
				</view>
				<view class='item' @tap.stop="selectWeixinPay(true)">
				  <image src='../../static/ic_weixin_pay.png'></image>
				  <view class='centet'>
					<text class='name'>微信支付</text>
					<text class='desc'>微信安全支付</text>
				  </view>
				</view>
				<view class='item' @tap.stop="selectWeixinPay(false)">
				  <image src='../../static/ali.png'></image>
				  <view class='centet'>
					<text class='name'>支付宝支付</text>
					<text class='desc'>支付宝安全支付</text>
				  </view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			selectWeixinPay: function(isWeiXinPay) {
				this.$emit('selectWeixinPay', isWeiXinPay)
			},
			close: function() {
				this.$emit('close')
			}
		}
	}
</script>

<style>
	@import url("../../common/css/animation.css");
	.PayDialog-mask {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: #000;
		opacity: 0.2;
		overflow: hidden;
		z-index: 98;
		color: #fff;
	}
	.PayDialog-bottom {
		width: 100%;
		/* height: 670rpx; */
		background: #f6f6f6;
		border-radius: 20px 20px 0px 0px;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 99;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.pays {
	  width: calc(100% - 48rpx);
	  margin-left: 24rpx;
	  margin-right: 24rpx;
	  margin-top: 30rpx;
	  display: flex;
	  flex-direction: column;
	  background: #fff;
	  border-radius: 20rpx;
	}
	
	.pays .PayDialog-top {
	  width: calc(100% - 60rpx);
	  height: 76rpx;
	  line-height: 76rpx;
	  padding-left: 30rpx;
	  padding-right: 30rpx;
	  font-size: 24rpx;
	  color: #888;
	  display: flex;
	  align-items: center;
	  border-bottom: solid 1rpx #eee;
	}
	
	.pays .item{
	  width: calc(100% - 68rpx);
	  height: 110rpx;
	  padding-left: 15rpx;
	  padding-right: 15rpx;
	  margin-left: 15rpx;
	  margin-right: 15rpx;
	  margin-top: 20rpx;
	  margin-bottom: 20rpx;
	  display: flex;
	  align-items: center;
	  border: dashed #08c00d 4rpx;
	  border-radius: 20rpx;
	}
	
	.pays .item image{
	  width: 60rpx;
	  height: 60rpx;
	}
	
	.pays .item .centet{
	  display: flex;
	  flex-direction: column;
	  margin-left: 20rpx;
	}
	
	.pays .item .centet .name{
	  font-size: 28rpx;
	  color: #333;
	}
	
	.pays .item .centet .desc{
	  font-size: 20rpx;
	  color: #999;
	  margin-top: 5rpx;
	}
	.myCheckBox {
		margin-left: auto;
		border-radius: 50%; /* 圆角 */
		width: 40rpx; /* 背景的宽 */
		height: 40rpx; /* 背景的高 */
		transform: scale(0.8,0.8);
	}
</style>
