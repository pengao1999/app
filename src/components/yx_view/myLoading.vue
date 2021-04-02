<template>
	<view class="load-page-page" :style="myData.style">
		<view class='views'>
			<view></view>
			<view></view>
			<view></view>
			<view></view>
		</view>
		<text class='text'>加载中...</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				myData: {
					style: ''
				},
			}
		},
		props: {
		    propData: {
				type: Object,
				default() {
					return {}
				}
			},
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
	}
</script>

<style>
	.load-page-page{
	  top: 0;
	  left: 0;
	  width: 100%;
	  height: 100%;
	  background: #fff;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	}
	.load-page-page .text {
	  color: #999;
	  margin: 0;
	  font: 24rpx verdana;
	  text-transform: uppercase;
	  letter-spacing: 4rpx;
	  margin-bttom:10rpx;
	}

	.load-page-page .views{
	  margin-top: 10rpx;
	}

	/*
	 * Loading Dots
	 * Can we use pseudo elements here instead :after?
	 */
	.load-page-page .views view {
	  display: inline-block;
	  vertical-align: middle;
	  width: 16rpx;
	  height: 16rpx;
	  margin: 6rpx;
	  background: #00A77D;
	  border-radius: 50%;
	  -webkit-animation: loading 1s infinite alternate;
			  animation: loading 1s infinite alternate;
	}

	/*
	 * Dots Colors
	 * Smarter targeting vs nth-of-type?
	 */
	.load-page-page .views view:nth-of-type(2) {
	  background: #00B247;
	  -webkit-animation-delay: 0.2s;
			  animation-delay: 0.2s;
	}
	.load-page-page .views view:nth-of-type(3) {
	  background: #5AB027;
	  -webkit-animation-delay: 0.4s;
			  animation-delay: 0.4s;
	}
	.load-page-page .views view:nth-of-type(4) {
	  background: #A0B61E;
	  -webkit-animation-delay: 0.6s;
			  animation-delay: 0.6s;
	}

	/*
	 * Animation keyframes
	 * Use transition opacity instead of keyframes?
	 */
	@-webkit-keyframes loading {
	  0% {
		opacity: 0;
	  }
	  100% {
		opacity: 1;
	  }
	}
	@keyframes loading {
	  0% {
		opacity: 0;
	  }
	  100% {
		opacity: 1;
	  }
}
</style>
