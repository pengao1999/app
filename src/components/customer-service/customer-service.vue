<template>
	<view>
		<view class="flow-service-box" @click="handleShowDialog">
			<image class="fsb-img" src="../../static/chaoyuezu/index/icon-service.png"></image>
			<view class="fsb-text">客服</view>
		</view>
		
		<!-- 弹框 -->
		<view class="mask" v-if="show"></view>
		<view class="cust-ser-box" v-if="show">
			<view class="csb-card" @click="handleCopyWxID('CYZ2018001')">
				<image src="../../static/wechat.png" mode="" class="cc-wechat-img"></image>
				店小二 CYZ2018001（租前咨询）
			</view>
			<view class="csb-card" @click="handleCopyWxID('cyzcyzcy888')">
				<image src="../../static/wechat.png" mode="" class="cc-wechat-img"></image>
				包租公 cyzcyzcy888（交租咨询）
			</view>
			<view class="csb-card" @click="handleCopyWxID('CYZ2018003')">
				<image src="../../static/wechat.png" mode="" class="cc-wechat-img"></image>
				产品售后 CYZ2018003（产品售后）
			</view>
			
			<view class="csb-card">
				点击可复制微信号→打开微信→搜索添加
			</view>
		</view>
		<view class="btn-close-mask" @click="show = false" v-if="show">
			<image src="../../static/ic_circle_close.png" class="icon-closed"></image>
		</view>
	</view>
	
</template>

<script>

export default {
	data() {
		return {
			show: false
		}
	},
	onLoad() {
		
	},
	methods:{
		handleShowDialog() {
			let self = this;
			self.show = true;
		},
		handleCopyWxID(id) {
			uni.setClipboardData({
				data: id,
				success: function () {
					uni.showToast({
						title: '微信号复制成功',
						duration: 3000
					})
				}
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.flow-service-box {
	position: fixed;
	z-index: 100;
	right: 20rpx;
	bottom: 150rpx;
	display: flex;
	flex-direction: column;
	padding: 25rpx 25rpx;
	border: 1px solid #dfdfdf;
	border-top-left-radius: 100rpx;
	border-top-right-radius: 100rpx;
	border-bottom-left-radius: 100rpx;
	border-bottom-right-radius: 100rpx;
	background-color: #fefefe;
	text-align: center;
	color: #999;
	.fsb-img {
		margin-bottom: 5rpx;
		width: 64rpx;
		height: 64rpx;
	}
}
.mask {
	position: fixed;
	z-index: 101;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0,0,0,.6);
}
.cust-ser-box {
	position: fixed;
	top: 300rpx;
	left: 50%;
	z-index: 102;
	margin-left: -325rpx;
	padding: 30rpx 50rpx;
	width: 650rpx;
	height: 440rpx;
	background-color: #fff;
	border-radius: 10rpx;
	box-sizing: border-box;
	.csb-card {
		height: 100rpx;
		line-height: 100rpx;
		border-bottom: 1px solid #eee;
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #666;
		&:last-child {
			border-bottom: 0;
		}
		.cc-wechat-img {
			width: 60rpx;
			height: 60rpx;
			margin-right: 20rpx;
		}
	}
}
.btn-close-mask {
	position: fixed;
	top: 750rpx;
	left: 50%;
	z-index: 102;
	margin-left: -30rpx;
	width: 60rpx;
	height: 60rpx;
	.icon-closed {
		width: 60rpx;
		height: 60rpx;
	}
}
</style>
