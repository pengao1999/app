<template>
	<view>
	<view class='center-bar' :style="propData.isFixed?'position:fixed; top:0; left:0;z-index:2': ''">
		<view class='stages' style="margin-top: 25upx;">
			<view class='stage' @tap="switchItem(0)" :class="myData.checkIndex == 0? 'activate': ''">{{myData.stage1}}</view>
			<view class='stage' @tap="switchItem(1)" :class="myData.checkIndex == 1? 'activate': ''">{{myData.stage2}}</view>
		</view>
		<view style="float: right;margin-top: 20upx;">
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
		</view>
	</view>
	<view class="center-bar" v-if="propData.isFixed"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				myData: {
					stage1: '',
					stage2: '',
					checkIndex: 0,
				},
				currentIndex: 0,
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
		watch: {
			propData: {
				handler() {
					let data = {}
					data = Object.assign({}, data, this.myData, this.propData)
					this.myData = data
				},
				immediate: true
			}
		},
		methods: {
			switchItem(checkIndex) {
				if (this.currentIndex === checkIndex) return;
				this.currentIndex = checkIndex
				this.$emit('switchItem', checkIndex)
			}
		}
	}
</script>

<style>
	.center-bar {
		width: calc(100% - 50rpx);
		height: 120rpx;
		padding-left: 30rpx;
		padding-right: 20rpx;
		align-items: center;
		background: #fff;
	}
	.stages {
		width: 360rpx;
		height: 60rpx;
		border-radius: 30rpx;
		background: #eff1f6;
		display: inline-flex;
	}
	
	.stages .stage {
		width: 180rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border-radius: 30rpx;
		font-size: 26rpx;
		font-weight: 500;
		color: #2f3640;
	}
	
	.stages .activate {
		background: #1dc422;
		color: #fff;
	}
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
