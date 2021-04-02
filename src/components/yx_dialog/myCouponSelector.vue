<template>
	<view v-if="propData.show">
		<view class="mask" @tap="close"></view>
		<view class="select-window slide-up">
			<image class='close' @tap='close' src='../../static/ic_close.png'></image>
			<view class="Coupon-container">
				<coupon-card v-for="(item, index) in coupons" @clickBtn="getCouponById" :key="index" :showBtn="true" handlerText="已领取" :isGet="item.isGet" :btnText="btnText" :index="index" :coupon="item"></coupon-card>
			</view>
		</view>
	</view>
</template>

<script>
	import CouponCard from '../yx_view/myCouponCard.vue'
	import Util from '../../common/js/util.js'
	export default {
		data() {
			return {
				myData: {},
				integerPrice: '0',
				decimalPrice: '0',
			}
		},
		components: {CouponCard},
		props: {
			propData: {
				type: Object,
				default() {
					return {}
				}
			},
			coupons: {
				type: Array,
				default() {
					return {}
				}
			},
			btnText: {
				type: String,
				default: ''
			}
		},
		watch:{
			propData: {
				handler() {
					let self = this
				},
				immediate: true
			}
		},
		methods: {
			close: function() {
				this.$emit('close', '')
			},
			getCouponById: function(coupon, index) {
				this.$emit('getCouponById', coupon.id, index)
			}
		}
	}
</script>

<style>
	@import url("../../common/css/animation.css");
	.mask {
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

	.select-window {
	  width: 100%;
	  overflow: hidden;
	  position: fixed;
	  bottom: 0;
	  left: 0;
	  z-index: 10001;
	  background: #fff;
	  border-top-left-radius: 20rpx;
	  border-top-right-radius: 20rpx;
	}

	.select-window .close {
	  width: 30rpx;
	  height: 30rpx;
	  position: absolute;
	  top: 40rpx;
	  right: 30rpx;
	}
	.Coupon-container {
		padding: 80upx 0 60rpx 0;
	}

</style>
