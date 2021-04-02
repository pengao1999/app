<template>
	<view v-if="show">
		<view class="modal-mask"></view>
		<view class="dialog">
			<view class="main">
				<image src="/static/update.png" class="image"></image>
				<view class="content">
					<text class="version">更新版本：{{updateInfo.version_name}}</text>
					<text class="text">{{updateInfo.content}}</text>
					<progress :percent="percent" activeColor="#FC5B3F" show-info stroke-width="3" v-if="percent>0" />
				</view>
				<view class="btns" v-if="!isDownload">
					<view class="btn" @click="close()" v-if="updateInfo.is_force==0">取消</view>
					<view class="line" v-if="updateInfo.is_force==0"></view>
					<!-- <view class="btn" @click="close()">取消</view>
					<view class="line"></view> -->
					<view class="btn actvite" @click="toUpdate()">立即升级</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const platform = uni.getSystemInfoSync().platform
	export default {
		data() {
			return {
				percent: 0,
				isDownload: false,
				time:1
			}
		},
		props: {
			show: {
				type: Boolean,
				default: false
			},
			updateInfo: {
				type: Object,
				default: null
			}
		},
		methods: {
			toUpdate() {
				let self = this;
				if (self.isDownload) {
					return
				}
				if (self.updateInfo.type == 'ALL') {
					plus.runtime.openURL(self.updateInfo.url);
					return
				}
				if (self.updateInfo.type == 'FIX') {
					self.close()
					plus.nativeUI.showWaiting("正在下载升级文件...");
					plus.downloader.createDownload(self.updateInfo.url, {
						filename: "_downloads/"
					}, function(d, status) {
						if (status == 200) {
							console.log("下载wgt成功：" + d.filename);
							plus.nativeUI.showWaiting("正在安装...");
							plus.runtime.install(d.filename, {
								force: true
							}, function() {
								plus.nativeUI.closeWaiting();
								console.log("安装wgt结束！");
								plus.nativeUI.alert("升级完成！", function() {
									plus.runtime.restart();
								});
							}, function(e) {
								plus.nativeUI.closeWaiting();
								console.log("安装wgt文件失败[" + e.code + "]：" + e.message);
								// plus.nativeUI.alert("安装文件失败[" + e.code + "]：" + e.message);
								if(self.time>0){
									self.toUpdate()
									self.time--
								}
							});
						} else {
							console.log("下载wgt失败！");
							plus.nativeUI.alert("下载失败！");
						}
						plus.nativeUI.closeWaiting();
					}).start();
					return;
				}

				self.isDownload = true
				let downloadTask = uni.downloadFile({
					url: self.updateInfo.url,
					success: (res) => {
						if (res.statusCode === 200) {
							// self.isDownload = false
							console.log(JSON.stringify(res))
							console.log('下载成功');
							plus.runtime.install(res.tempFilePath, {
								force: false
							}, function() {
								console.log('install success...');
								self.close()
								plus.runtime.restart();
							}, function(e) {
								console.error('install fail...');
							});
						}
					}
				});
				downloadTask.onProgressUpdate((res) => {
					self.percent = res.progress
				});
			},
			close: function() {
				uni.showTabBar({
					animation: false
				})
				this.$emit('close')
			}
		}
	}
</script>

<style lang="scss">
	.modal-mask {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: #000;
		opacity: 0.5;
		overflow: hidden;
		z-index: 9000;
	}

	.dialog {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 9001;
	}

	.main {
		width: 584upx;
		display: flex;
		flex-direction: column;
	}

	.image {
		width: 584upx;
		height: 214upx;
	}

	.content {
		width: 484upx;
		padding: 40upx 50upx;
		display: flex;
		flex-direction: column;
		background: #fff;
		font-size: 28upx;
		color: #333;
		line-height: 40upx;
		overflow: hidden;

		.version {
			width: 100%;
			font-size: 32upx;
			color: #222;
		}

		.text {
			width: 100%;
			margin-top: 20upx;
		}
	}

	.btns {
		width: 100%;
		height: 100upx;
		border-bottom-right-radius: 10upx;
		border-bottom-left-radius: 10upx;
		background: #fff;
		display: flex;
		border-top: solid 1upx #eee;

		.btn {
			flex: 1;
			height: 100upx;
			text-align: center;
			line-height: 100upx;
			font-size: 28upx;
			color: #999;
		}

		.line {
			width: 1upx;
			background: #eee;
		}

		.actvite {
			color: rgba(249, 136, 14, 1);
		}
	}

	.close {
		width: 40upx;
		height: 40upx;
		margin-top: 60upx;
		z-index: 9001;
	}
</style>
