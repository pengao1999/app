<template>
	<view v-if="propData.show">
		<view class="mask" ></view>
		<view class="ad-box fade-in" v-if="propData.show">
			<image class='ad' :src="propData.image_root + propData.pic" @tap.stop="adClick"></image>
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
			adClick(id) {
				this.$emit('adClick', this.propData)
			},
			closeAdDialog() {
				this.$emit('closeAdDialog', {})
			}
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

	.ad-box {
	  position: fixed;
	  width: 480rpx;
	  top: calc(50% - 340rpx);
	  left: calc(50% - 240rpx);
	  z-index: 1001;
	  border-radius: 15rpx;
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	  align-items: center;
	}

	.ad-box .ad{
	  width: 480rpx;
	  height: 680rpx;
	  border-radius: 15rpx;
	}

	.ad-box .close{
	  width: 60rpx;
	  height: 60rpx;
	  margin-top: 40rpx;
	  z-index: 1001;
	}
</style>
