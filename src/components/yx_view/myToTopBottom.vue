<template>
	<view class='to-top' :style="propData.style" v-if="propData.show" @tap='toTop'>
      <image src='../../static/ic_to_top.png'></image>
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
		methods:{
			toTop: function() {
				this.$emit('toTop', '');
			}
		}
	}
</script>

<style>
	.to-top{
	  position:fixed;
	  bottom: 40rpx;
	  right: 40rpx;
	  width: 80rpx;
	  height: 80rpx;
	}

	.to-top image{
	  width: 80rpx;
	  height: 80rpx;
	}
</style>
