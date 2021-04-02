<template>
	<view>
		<error-tip :propData="errorData" @hide="errorHide"></error-tip>
		<view class="error-content">
			<image class="empty" src="../static/empty.png"></image>
			<button class="home" hover-class="btnClick" @tap="toHome">返回主页</button>
		</view>
	</view>
</template>

<script>
	import ErrorTip from '../components/yx_dialog/myErrorTip.vue'
	export default {
		data(){
			return {
				// 错误提示
				errorData: {
					show: true,
					desc: '网络崩溃啦~'
				},
			}
		},
		components: {
			ErrorTip
		},
		methods: {
			toHome: function() {
				uni.reLaunch({
					url: '/pages/index/main'
				})
			},
			// 错误隐藏
			errorHide: function (e) {
			    if (!e.detail) {
			        this.errorData.show = false;
			        return
			    }
			    this.errorData = e.detail
			},
		}
	}
</script>

<style>
	.error-content {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.empty {
		width: 250upx;
		height: 200upx;
		margin-top: 300upx;
	}
	.home {
		margin-top: 15upx;
		background: #05BF0A;
		color: #FFFFFF;
		font-size: 28upx;
	}
</style>
