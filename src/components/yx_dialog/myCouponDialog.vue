<template>
	<div>
		<view class="uni-banner" :style="bannerStyle" v-if="bannerShow">
		    <view style="justify-content:flex-end;" @tap="closeBanner">
		        <view style="justify-content:flex-end; text-align:right; padding:20upx;">
		            <text class="uni-icon uni-icon-close" style="color:white;"></text>
		        </view>
		    </view>
		    <view class="Coupon-container">
				<coupon-card v-for="(item, index) in coupons" :key="index" :coupon="item"></coupon-card>
		    </view>
		    <view style="padding:50upx 0; padding-bottom:68upx;">
		        <button type='warn' class="mini-btn" @tap="getCoupons" style="background:#06C00C; margin:0 80upx">一键领取</button>
		    </view>
		</view>
		<view class="uni-mask" v-if="bannerShow"></view>
	</div>
</template>

<script>
	import CouponCard from '../yx_view/myCouponCard.vue'
	export default {
		data() {
			return {
			}
		},
		components: {CouponCard},
		props: {
			bannerShow: {
				type: Boolean,
				default: false
			},
			bannerStyle: {
				type: String,
				default: ''
			},
			coupons: {
				type: Array,
				default() {
					return []
				}
			}
		},
		methods: {
			closeBanner: function() {
				this.$emit('closeCouponDialog')
			},
			getCoupons: function() {
				this.$emit('getCoupons')
			}
		}
	}
</script>

<style>
	/* 遮罩层 */
	.uni-mask {
	    background: rgba(0, 0, 0, 0.6);
	    position: fixed;
	    width: 100%;
	    height: 100%;
	    left: 0;
	    top: 0;
	    z-index: 1;
	}
	
	/* 弹出层形式的广告 */
	.uni-banner {
	    width: calc(100% - 60upx);
	    position: fixed;
	    left: 50%;
	    top: 50%;
	    background: #FFF;
	    border-radius: 10upx;
	    z-index: 99;
	    transform: translate(-50%, -50%);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-origin: content-box;
	}
</style>
