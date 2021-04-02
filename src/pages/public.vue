<template>
	<view>
		<!-- 引导公众号 -->
		<view class="Public-page">
			<view class="Public-tip">检测到您的微信版本过低，请前往友邻优选公众号下载手机app</view>
			<image class="Public-img" src="../static/service_logo.jpg" @tap="previewImg"></image>
			<view class="Public-tip" style="margin-top: 20upx;">扫二维码，下载app</view>
		</view>
	</view>
</template>

<script>
	import Toast from '../common/js/toast.js'
	export default {
		mixins: [Toast],
		methods: {
			previewImg: function() {
				let self = this
				uni.showModal({
					content: '保存二维码到相册',
					confirmColor: "#1dc422",
					success: (res) => {
						if ( res.confirm ) {
							self.auth()
						}
						
					}
				})
			},
			auth: function() {
				let self = this
				uni.getSetting({
					success: (res) => {
						console.log(res)
						if (!res.authSetting['scope.writePhotosAlbum']) {
							uni.authorize({
								scope: 'scope.writePhotosAlbum',
								success: (info) => {
									self.save()
								},
								fail: () => {
									wx.openSetting({  
										success: function(data) {
											self.toast({
												desc: '获取授权成功',
												type: 'success'
											})
										},
										fail: function() {
											self.toast({
												desc: '获取授权失败',
												type: 'warn'
											})
										}
									})
								}
							})
						} else {
							self.save()
						}
					}
				})
			},
			save: function() {
				let self = this
				uni.saveImageToPhotosAlbum({
					filePath: '/static/service_logo.jpg',
					success: (res) => {
						self.toast({
							desc: '保存成功',
							type: 'success'
						})
					},
					fail: () => {
						self.toast({
							desc: '保存失败',
							type: 'warn'
						})
					}
				})
			}
		}
	}
</script>

<style>
	.Public-page {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
	.Public-tip {
		width: 80%;
		margin: 200upx 10% 0 10%;
	}
	.Public-img {
		width: 500upx;
		height: 500upx;
	}
</style>
