<template>
	<view class='bottom-tools'>
	  <view class='min-item' @tap.stop='toHome'>
		<image src='../../static/tab_home_normal.png'></image>
		<text>回首页</text>
	  </view>
	  <view class='min-item' @tap.stop='toCart'>
		<image src='../../static/tab_cart_normal.png'></image>
		<text>购物车</text>
		<text class='tag' v-if="propData.cartNum">{{propData.cartNum}}</text>
	  </view>
	  <button class='cart cu-btn' style="-webkit-border-radius: 0px;-moz-border-radius: 0px;border-radius: 0px;" @tap.stop='addCart'>加入购物车</button>
	  <button class='buy cu-btn' style="-webkit-border-radius: 0px;-moz-border-radius: 0px;border-radius: 0px;" @tap.stop='buy'>立即购买</button>
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
			}
		},
		methods: {
			toHome: function() {
				this.$emit('toHome', '')
			},
			toCart: function() {
				this.$emit('toCart', '')
			},
			addCart: function() {
				this.$emit('addCart', 1)
			},
			buy: function() {
				this.$emit('buy', 1)
			}
		}
	}
</script>

<style>
	.bottom-tools {
	  width: 100%;
	  height: 98rpx;
	  background: #fff;
	  position: fixed;
	  left: 0;
	  bottom: 0;
	  display: flex;
	  padding-bottom: 0;
	  padding-bottom: constant(safe-area-inset-bottom);
	  padding-bottom: env(safe-area-inset-bottom);
	}
	.bottom-tools .min-item {
	  width: 120rpx;
	  height: 98rpx;
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	  align-items: center;
	}

	.bottom-tools .min-item image {
	  width: 40rpx;
	  height: 40rpx;
	}

	.bottom-tools .min-item text {
	  font-size: 18rpx;
	  color: #888;
	}

	.bottom-tools .min-item .tag {
	  width: 30rpx;
	  height: 30rpx;
	  line-height: 30rpx;
	  text-align: center;
	  background: #e84118;
	  border-radius: 15rpx;
	  color: #fff;
	  position: absolute;
	  font-size: 20rpx;
	  margin-top: -25rpx;
	  margin-left: 25rpx;
	  align-self: auto;
	}

	.bottom-tools .cart {
	  width: calc(50% - 120rpx);
	  height: 98rpx;
	  line-height: 98rpx;
	  text-align: center;
	  background: #fbc531;
	  font-size: 28rpx;
	  font-weight: bold;
	  color: #fff;
	}

	.bottom-tools .buy {
	  width: calc(50% - 98rpx);
	  height: 98rpx;
	  line-height: 98rpx;
	  text-align: center;
	  background: #e84118;
	  font-size: 28rpx;
	  font-weight: bold;
	  color: #fff;
	}
</style>
