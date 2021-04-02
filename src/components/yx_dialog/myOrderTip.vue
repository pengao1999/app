<template>
	<view v-if="propData.show">
		<view class="mask" ></view>
		<view class="ad-box-order fade-in" v-if="propData.show">
			<view class="title">提示</view>
			<view class="content">
				<div class="tip1">济南地区</div>
				<div class="tip0">提货点信息：</div>
				<div class="tip0">取货地址：</div>
				<div class="tip0" style="font-size:24upx;color:#999">请确认您的收获地址填写无误</div>
			</view>
			<image class='close' @tap.stop='closeAdDialog' src='../../static/ic_circle_close.png'></image>
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
		}
	}
</script>

<style>
	@import url("../../common/css/animation");
	.mask {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
		background: #000;
		opacity: 0.5;
	}

	.ad-box-order {
		position: fixed;
		width: 80%;
		top: calc(50% - 340rpx);
		left: 10%;
		z-index: 1001;
		border-radius: 15rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background:white;
	}
	.ad-box-order .title {
		font-size:32upx;
		color: #333;
		margin-top: 20upx;
	}
	.ad-box-order .content{
		width: 100%;
		margin-top:20upx;
		text-align: left;
		font-size: 28upx;
		color:#999;
	}
	.ad-box-order .content div {
		margin-left: 20upx;
	}
	.ad-box-order .content .tip0 {
		font-size: 28upx;
		color: #333;
	}
	.ad-box-order .content .tip1 {
		font-size: 38upx;
		color: #333;
		font-weight: bold;
		color: #1dc422;
	}
	.ad-box .close{
		width: 60rpx;
		height: 60rpx;
		margin-top: 40rpx;
		z-index: 1001;
	}
</style>
