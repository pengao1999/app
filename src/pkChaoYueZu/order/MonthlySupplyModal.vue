<template>
  <view v-if="show">
    <view class="mask" @click="close"></view>
    <view class="container">
      <view class="title">月供详情</view>
      <view class="content">
				<view class="head">
					<view>合计需还</view>
					<view style="font-weight: bold;">¥ {{staging.repay_amount_sum}}</view>
				</view>
				<view class="detail">
					<view class="row">
						<text class="left">本金</text>
						<text class="right">¥ {{originalPrice}}</text>
					</view>
					<view class="row">
						<text class="left">利息</text>
						<text class="right">¥ {{staging.repay_amount_sum-originalPrice}}</text>
					</view>
					<view class="row">
						<text class="left">期数</text>
						<text class="right">{{staging.periods}} 期</text>
					</view>
				</view>
				<view class="plan">
					<text class="plan-head">还款计划</text>
					<view class="plan-table">
						<view class="table-row" v-for="(pay, index) in staging.repayment_detail_list" :key="index">
							<view class="first-column">第{{pay.period}}期</view>
							<view class="second-column">¥ {{pay.repay_amount}}</view>
							<view class="third-column">{{pay.repay_date}}到期</view>
						</view>
					</view>
				</view>
      </view>
			<view style="height: 120rpx;"></view>
      <view class="bottom-btn" @click="close">确定</view>
    </view>
  </view>
</template>
<script>
export default {
  name: 'MonthlySupplyModal',
	props:{
		show: {
			type: Boolean,
			default: false
		},
		staging: {
			type: Object,
			default() {
				return {}
			}
		},
		originalPrice: {
			type: Number,
			default: 0
		}
	},
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.mask {
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100%;
  height: 100vh;
  left: 0;
  background: black;
  overflow: hidden;
  opacity: 0.3;
}
.container {
  width: 100%;
  min-height: 600rpx;
  overflow: hidden;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10001;
  background: #fff;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  .title {
    height: 120rpx;
    line-height: 120rpx;
    font-size: 36rpx;
    text-align: center;
    margin: 0 10rpx;
    color: #333;
    border-bottom: 1rpx solid #f4f4f4;
  }
  .content {
    margin: 16rpx 30rpx;
    display: flex;
    flex-direction: column;
		.head {
			height: 140rpx;
			line-height: 70rpx;
			// border-bottom: 1rpx solid #f4f4f4;
			font-size: 30rpx;
			text-align: center;
			margin: 0;
		}
		.detail {
			height: 130rpx;
			line-height: 40rpx;
			display: flex;
			flex-direction: column;
			// border-bottom: 1rpx solid #F4F4F4;
			background: #f4f4f4;
			// margin-top: 10rpx;
			border-radius: 20rpx;
			margin: 0 10rpx;
			padding: 10rpx;
			.row {
				height: 40rpx;
				line-height: 40rpx;
				display: flex;
				flex-direction: row;
				margin: 0 10rpx;
				.left {
					color: #333;
				}
				.right {
					color: grey;
					position: absolute;
					right: 50rpx;
				}
			}
		}
		.plan {
			margin: 20rpx 10rpx;
			font-size: 32rpx;
			.plan-head{
				font-weight: bold;
				margin-bottom: 10rpx;
			}
			.plan-table{
				background: #f4f4f4;
				border-radius: 20rpx;
				.table-row {
					display: flex;
					flex-direction: row;
					width: 100%;
					height: 50rpx;
					line-height: 50rpx;
					justify-content: space-between;
					text-align: center;
					// border-collapse:collapse;
					.first-column{
						// border: 1rpx solid grey;
						flex: 2;
					}
					.second-column{
						// border: 1rpx solid grey;
						flex: 3;
					}
					.third-column{
						// border: 1rpx solid grey;
						flex: 4;
					}
				}
			}
		}
  }
  .bottom-btn {
    height: 100rpx;
    width: 100%;
    line-height: 100rpx;
    background: #f37b1d;
    color: #fff;
    font-size: 28rpx;
    position: absolute;
    bottom: 0;
    text-align: center;
  }
}
</style>