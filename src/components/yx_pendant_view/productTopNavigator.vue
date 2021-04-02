<template>
	<view class='tabs' v-if="propData.show">
	  <view class="row-container">
		  <view class='tab' :class="propData.isProduct?'active':''" @tap.stop='goTop'>商品</view>
		  <view class='tab' :class="propData.isRecorder?'active':''" @tap.stop='goBuyers'>记录</view>
		  <view class='tab' :class="propData.isDetail?'active':''" @tap.stop='goDetail'>详情</view>
	  </view>
<!--	  <view class='count-down'>-->
<!--	  	<text style='margin-right:5rpx;'>{{titleName}}</text>-->
<!--	  	<text class='time'>{{countDownDay}}</text>-->
<!--	  	<text>天</text>-->
<!--	  	<text class='time'>{{countDownHour}}</text>-->
<!--	  	<text>:</text>-->
<!--	  	<text class='time'>{{countDownMinute}}</text>-->
<!--	  	<text>:</text>-->
<!--	  	<text class='time'>{{countDownSecond}}</text>-->
<!--	  </view>-->
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		props: {
		    propData: {
				type: Object,
				default() {
					return {}
				}
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
		},
		methods: {
			goTop: function() {
				if (this.propData.isProduct) return;
				this.$emit('goTop', '');
			},
			goBuyers: function() {
				if (this.propData.isRecorder) return;
				this.$emit('goBuyers', '');
			},
			goDetail: function() {
				if (this.propData.isDetail) return;
				this.$emit('goDetail', '');
			}
		}
	}
</script>

<style>
	.tabs {
	  width: 100%;
	  height: 80rpx;
	  position: fixed;
	  top: 0;
	  left: 0;
	  background: #fff;
	  border-bottom: solid 2rpx #eee;
	  display: flex;
	  justify-content: space-between;
	}

	.tabs .tab {
	  height: 74rpx;
	  text-align: center;
	  line-height: 74rpx;
	  font-size: 28rpx;
	  font-weight: 600;
	  margin-left: 20rpx;
	  margin-right: 20rpx;
	  border-bottom: 6rpx solid #fff;
	}

	.tabs .tab.active {
	  color: #e84118;
	  border-bottom: solid 6rpx #e84118;
	}
	.row-container {
		display: flex;
		flex-direction: row;
	}
	.count-down {
		font-size: 26rpx;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		color: #353b48;
		font-weight: 400;
		margin-left: auto;
		margin-right: 20rpx;
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
