<template>
	<view class="content">
		<error-tips :propData="errorData" @hide="errorHide"></error-tips>
		<view class="block">
			<view v-if="idCardTopPath">
				<image class="upload-img" :src="idCardTopPath" @click="addIdCardTop" />
			</view>
			<view v-else>
				<image src="/static/zulin/verify/idCardTop2.png" class="face-img" />
				<view class="action-wrap">
					<image class="action-start-img" src="/static/zulin/verify/add.png" @click="addIdCardTop" />
					<view class="action-text">请上传身份证正面</view>
				</view>
			</view>
		</view>
		<view class="block">
			<view v-if="idCardBackPath">
				<image class="upload-img" :src="idCardBackPath" @click="addIdCardBack" />
			</view>
			<view v-else>
				<image src="/static/zulin/verify/idCardBack2.png" class="face-img" />
				<view class="action-wrap">
					<image class="action-start-img" src="/static/zulin/verify/add.png" @click="addIdCardBack" />
					<view class="action-text">请上传身份证反面</view>
				</view>
			</view>
		</view>
		<view class="bottom" @click="upload">下一步</view>
		
		<myDialog
		        title="认证信息"
		        :dialog-show="dialogShow"
				confirmText="确认无误"
				cancelText="重新认证"
				textalign='left'
		        @cancelButton="addIdCardTop()"
		        @confirmButton="dialogShow=false"
		>
		<view class="coloum-container" style="padding-left: 30upx;">
			<view>您的姓名：{{idCardName}}</view>
			<view>您的身份证号：{{idCardNum}}</view>
		</view>
		</myDialog>
	</view>
</template>
<script>
	import errorTips from '../../components/yx_dialog/myErrorTip.vue'
	import Config from './config.js'
	import Toast from '../../common/js/toast.js'
	const {
		platform
	} = uni.getSystemInfoSync()
	export default {
		name: 'idCard',
		components: {
			errorTips
		},
		mixins: [Toast],
		data() {
			return {
				userKey: '',
				idCardTopPath: '',
				idCardTopFile: '',
				idCardBackPath: '',
				idCardBackFile: '',
				// 错误提示
				errorData: {
					show: false,
					desc: ''
				},
				topSuccess: false,
				backSuccess: false,
				state: 0,
				orderNo: "",
				dialogShow: false,
				idCardName: "",
				idCardNum: ""
			}
		},
		onLoad(options) {
			this.userKey = options.userKey
			this.state = options.state
		},
		onShow() {
			let self = this
			self.$Phttp.get(Config.REQUEST_URLS.creditStatus, {
				userKey: self.userKey,
				appKey: 123
			}).then(res => {
				res = res.data
				if (res.code === 200) {
					self.idCardTopPath = res.data.idcard_front_view ? Config.IMG_ROOT + res.data.idcard_front_view : ""
					self.idCardBackPath = res.data.idcard_back_view ? Config.IMG_ROOT + res.data.idcard_back_view : ""
					self.topSuccess = true
					self.backSuccess = true
				}
			})
		},
		methods: {
			openIosOCR(data) {
				let self = this
				let JYTencentWBOCR = uni.requireNativePlugin("JY-TencentWBOCR")
				JYTencentWBOCR.ocrIDCardFrontSideOCRWithOptions(data,
					startCallback => {
						//    程序拉起认证
						console.log("startCallback:" + JSON.stringify(startCallback))
					},
					successedCallback => {
						//    认证成功
						console.log("successedCallback:" + JSON.stringify(successedCallback))
						self.idCardName = successedCallback.name
						self.idCardNum = successedCallback.idcard
						self.getFronPhotos()
					},
					faileCallback => {
						//    认证失败
						console.log("faileCallback:" + JSON.stringify(faileCallback))
					},
					resultCallback => {
						console.log("resultCallback:" + JSON.stringify(resultCallback))
					});
			},
			openAndroidOCR(data) {
				let self = this
				console.log(JSON.stringify(data))
				let JYTencentWBOCR = uni.requireNativePlugin("JY-TencentWBOCR")
				JYTencentWBOCR.android_ocrIDCardFrontSideOCRWithOptions(data,
					startCallback => {
						//    程序拉起认证
						console.log("startCallback:" + JSON.stringify(startCallback))
					},
					successedCallback => {
						//    认证成功
						console.log("successedCallback:" + JSON.stringify(successedCallback))
						self.idCardName = successedCallback.name
						self.idCardNum = successedCallback.cardNum
						self.getFronPhotos()
					},
					faileCallback => {
						//    认证失败
						console.log("faileCallback:" + JSON.stringify(faileCallback))
					});
			},
			addIdCardTop() {
				let self = this
				self.toast({
					type: 'loading',
					time: 8000
				})
				console.log(Config.REQUEST_URLS.getOcrParams+"?userKey=" + this.userKey)
				self.$Phttp.get(Config.REQUEST_URLS.getOcrParams+"?userKey=" + this.userKey, {}).then(res => {
					self.toast(true)
					res = res.data
					if (res.code === 200) {
						self.orderNo = res.data.orderNo
						switch (platform) {
							case "android":
								self.openAndroidOCR(res.data)
								break
							case "ios":
								self.openIosOCR(res.data)
								break
						}

					} else {
						self.errorData = Object.assign({}, self.errorData, {
							show: true,
							desc: res.message
						})
					}
				})
			},
			openIosOCRBack(data) {
				let self = this
				let JYTencentWBOCR = uni.requireNativePlugin("JY-TencentWBOCR")
				JYTencentWBOCR.ocrIDCardBackSideOCRWithOptions(data,
					startCallback => {
						//    程序拉起认证
						console.log("startCallback:" + JSON.stringify(startCallback))
					},
					successedCallback => {
						//    认证成功
						console.log("successedCallback:" + JSON.stringify(successedCallback))
						self.getBackhotos()
					},
					faileCallback => {
						//    认证失败
						console.log("faileCallback:" + JSON.stringify(faileCallback))
					},
					resultCallback => {
						console.log("resultCallback:" + JSON.stringify(resultCallback))
					});
			},
			openAndroidOCRBack(data) {
				let self = this
				console.log(JSON.stringify(data))
				let JYTencentWBOCR = uni.requireNativePlugin("JY-TencentWBOCR")
				JYTencentWBOCR.android_ocrIDCardBackSideOCRWithOptions(data,
					startCallback => {
						//    程序拉起认证
						console.log("startCallback:" + JSON.stringify(startCallback))
					},
					successedCallback => {
						//    认证成功
						console.log("successedCallback:" + JSON.stringify(successedCallback))
						self.getBackhotos()
					},
					faileCallback => {
						//    认证失败
						console.log("faileCallback:" + JSON.stringify(faileCallback))
					});
			},
			addIdCardBack() {
				let self = this
				self.toast({
					type: 'loading',
					time: 8000
				})
				self.$Phttp.get(Config.REQUEST_URLS.getOcrParams+"?userKey=" + this.userKey, {}).then(res => {
					self.toast(true)
					res = res.data
					if (res.code === 200) {
						self.orderNo = res.data.orderNo
						switch (platform) {
							case "android":
								self.openAndroidOCRBack(res.data)
								break
							case "ios":
								self.openIosOCRBack(res.data)
								break
						}

					} else {
						self.errorData = Object.assign({}, self.errorData, {
							show: true,
							desc: res.message
						})
					}
				})
			},
			getFronPhotos() {
				let self = this
				let getData = {
					orderNo: self.orderNo,
					userKey: self.userKey
				}
				self.toast({
					type: 'loading',
					desc: '正在校验...',
					time: 8000
				})
				console.log(JSON.stringify(getData))
				self.$Phttp.get(Config.REQUEST_URLS.getFrontOcrImg, getData).then(res => {
					console.log(JSON.stringify(res))
					self.toast(true)
					res = res.data
					if (res.code === 200) {
						self.idCardTopPath = res.data ? Config.IMG_ROOT + res.data : ""
						self.topSuccess = true
						self.dialogShow = true
					} else {
						self.errorData = Object.assign({}, self.errorData, {
							show: true,
							desc: res.message
						})
					}
				})
			},
			getBackhotos() {
				let self = this
				let getData = {
					orderNo: self.orderNo,
					userKey: self.userKey
				}
				self.toast({
					type: 'loading',
					desc: '正在校验...',
					time: 8000
				})
				console.log(JSON.stringify(getData))
				self.$Phttp.get(Config.REQUEST_URLS.getBackOcrImg, getData).then(res => {
					console.log(JSON.stringify(res))
					self.toast(true)
					res = res.data
					if (res.code === 200) {
						self.idCardBackPath = res.data ? Config.IMG_ROOT + res.data : ""
						self.backSuccess = true
					} else {
						self.errorData = Object.assign({}, self.errorData, {
							show: true,
							desc: res.message
						})
					}
				})
			},
			errorHide: function(e) {
				if (!e.detail) {
					this.errorData.show = false;
					return
				}
				this.errorData = e.detail
			},
			upload() {
				let self = this
				if (!(self.topSuccess && self.backSuccess)) {
					self.errorData = Object.assign({}, self.errorData, {
						show: true,
						desc: "请先上传身份证正反面照片～"
					})
					return
				}
				self.toast({
					type: 'loading',
					time: 8000
				})
				console.log(Config.REQUEST_URLS.idCardVerify+"?userKey=" + self.userKey)
				self.$Phttp.get(Config.REQUEST_URLS.idCardVerify+"?userKey=" + self.userKey, {}).then(res => {
					console.log(JSON.stringify(res))
					self.toast(true)
					res = res.data
					if (res.code === 200) {
						uni.navigateTo({
							// url: '/pages/auth/idCardSuccess?userKey=' + this.userKey
							url: '/pkChaoYueZu/verify/idCardSuccess?userKey=' + self.userKey
						})
					} else {
						self.errorData = Object.assign({}, self.errorData, {
							show: true,
							desc: res.message
						})
					}
				})

			}
		}
	}
</script>
<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: calc(100vh - 0rpx);
		background: #f4f4f4;
		position: relative;

		.block {
			display: flex;
			background: #fff;
			width: 100%;
			height: 520rpx;
			align-items: center;
			justify-content: center;
			position: relative;

			.face-img {
				width: 640rpx;
				height: 440rpx;
			}

			.action-wrap {
				display: flex;
				flex-direction: column;
				position: absolute;
				top: 160rpx;
				left: 250rpx;
				text-align: center;
				align-items: center;

				.action-start-img {
					width: 120rpx;
					height: 120rpx;
				}

				.action-text {
					margin-top: 80rpx;
					font-size: 32rpx;
					color: #fff;
				}
			}

			.upload-img {
				width: 640rpx;
				height: 440rpx;
				border: 2rpx dashed #f00a1e;
				border-radius: 20rpx;
			}
		}
	}

	.bottom {
		background-image: linear-gradient(270deg, #f00a1e 0%, #f08414 100%);
		border-radius: 50rpx;
		width: 666rpx;
		height: 88rpx;
		line-height: 88rpx;
		color: #fff;
		font-size: 32rpx;
		font-weight: 400;
		align-items: center;
		text-align: center;
		margin: 50rpx 0;
	}
</style>
