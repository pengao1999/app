<template>
	<view v-if="propData.show">
		<view class="myPicker-mask" @tap.stop="close"></view>
		<view class="myPicker-bottom slide-up">
			<button class="middle-text" style="border-top: 1upx solid #F8F8F8;" open-type="share">分享给朋友</button>
			<view class="middle-text" style="border-top: 1upx solid #F8F8F8;" @tap.stop="toShare">生成卡片保存分享</view>
			<view class="middle-text" style="border-top: 20upx solid #F8F8F8;" @tap.stop="close">取消</view>
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
			close: function() {
				this.$emit('close')
			},
			toShare: function() {
				this.$emit('toShare')
			}
		}
	}
</script>

<style>
	@import url("../../common/css/animation.css");
	.myPicker-mask {
	  width: 100%;
	  height: 100%;
	  position: fixed;
	  top: 0;
	  left: 0;
	  background: #000;
	  opacity: 0;
	  overflow: hidden;
	  z-index: 98;
	  color: #fff;
	}
	.myPicker-bottom {
		width: 100%;
		overflow: hidden;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 10001;
		padding-bottom: constant(safe-area-inset-bottom);  
		padding-bottom: env(safe-area-inset-bottom); 
	}
	.myPicker-bottom .middle-text {
		width: 100%;
		height: 100upx;
		text-align: center;
		line-height: 100upx;
		font-size: 32upx;
		color: #333333;
		background-color: white;
	}
	.button-hover {
		background-color: white;
	}
</style>
