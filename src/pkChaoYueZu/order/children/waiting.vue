<template>
	<view class="main-center-page column bg-white" style="padding-bottom: 224upx;">
		<image style="width: 160upx;height: 160upx;margin-top: 84upx;" src="/static/chaoyuezu/waiting.png"></image>
		<view style="font-size: 30upx;margin-top: 52upx;">审核中，请等待</view>
	</view>
</template>

<script>
	export default {
		onBackPress() {
			uni.switchTab({
				url: '/pkChaoYueZu/order/list'
			})
			return true
		}
	}
</script>

<style>
	page {
		background: #F8F8F8;
	}
</style>
