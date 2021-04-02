<template>
	<view class='count-down'>
		<text style='margin-right:5rpx;'>{{titleName}}</text>
		<text class='time'>{{countDownDay}}</text>
		<text>天</text>
		<text class='time'>{{countDownHour}}</text>
		<text>:</text>
		<text class='time'>{{countDownMinute}}</text>
		<text>:</text>
		<text class='time'>{{countDownSecond}}</text>
	</view>
</template>

<script>
	export default {
		props: {
			titleName: {
				type: String,
				default: ''
			},
			countDownDay: {
				type: String,
				default: '-'
			},
			countDownHour: {
				type: String,
				default: '-'
			},
			countDownMinute: {
				type: String,
				default: '-'
			},
			countDownSecond: {
				type: String,
				default: '-'
			}
		}
	}
</script>

<style>
	.count-down {
		font-size: 26rpx;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		color: #353b48;
		font-weight: 400;
		margin-left: auto;
	}
	
	.count-down .time {
		height: 32rpx;
		line-height: 32rpx;
		background: #fbc531;
		font-size: 24rpx;
		border-radius: 5rpx;
		color: #fff;
		text-align: center;
		margin-left: 5rpx;
		margin-right: 5rpx;
		padding-left: 5rpx;
		padding-right: 5rpx;
	}
</style>
