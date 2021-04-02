<template>
	<view class="content">
		<error-tips :propData="errorData" @hide="errorHide"></error-tips>
		<view class="row-wrap" v-if="type === 'pass'">
			<view class="row-title">运营商服务密码</view>
			<input placeholder="请输入运营商服务密码" class="row-input" v-model="operaterPwd" />
		</view>

		<view class="row-wrap" v-if="type === 'sms_verify_code'">
			<view class="row-title">验证码</view>
			<input placeholder="请输入短信验证码" class="row-input" v-model="code" />
		</view>
		<view v-if="type === 'image_verify_code'">
			<!--<img src="imgSrc" class="verifyImg" />-->
			<input placeholder="请输入收到的验证码" v-model="code" />
		</view>

		<view class="bottom" v-if="type === 'pass'" @click="upload">提交</view>
		<view class="bottom" v-else @click="append">提交验证码</view>

		<view class="wxts-tip">
			<view class="wxts-p">
				<view class="fc-red">*</view> 温馨提示：拨打手机客服转人工咨询服务密码是多少！
			</view>
			<view class="wxts-p pt9 ti8">例如: 中国移动拨打10086; </view>
			<view class="wxts-p ti44">中国联通拨打10010;</view>
			<view class="wxts-p ti44">中国电信拨打10000</view>
		</view>
	</view>
</template>
<script>
	import Config from './config.js'
	import errorTips from '../../components/yx_dialog/myErrorTip.vue'

	export default {
		name: 'Operater',
		components: {
			errorTips
		},
		data() {
			return {
				// 错误提示
				errorData: {
					show: false,
					desc: ''
				},
				operaterPwd: '',
				userKey: '',
				code: '',
				type: 'pass',
				imgSrc: '',
				crawlerObj: {},
				bool: true,
				bool2: true
			}
		},
		onLoad(options) {
			this.userKey = options.userKey
		},
		onBackPress(options) {
			if (options.from === 'navigateBack') {
				return false;
			}
			if (this.type === 'pass') {
				return false
			}
			uni.showToast({
				title: '请完成输入验证码',
				icon: "none"
			})
			uni.showModal({
				title: '提示',
				content: '确定要返回吗？',
				success: function(res) {
					if (res.confirm) {
						// console.log('用户点击确定');
						uni.navigateBack();
						return false;
					} else if (res.cancel) {
						// console.log('用户点击取消');
						return true;
					}
				}
			});
			return true;
		},
		methods: {
			errorHide: function(e) {
				if (!e.detail) {
					this.errorData.show = false;
					return
				}
				this.errorData = e.detail
			},

			//code=' + self.form.sms + '&crawlerId=' + smsTemp.crawlerId + '&crawlerToken='
			//   smsTemp.crawlerToken+ '&name=' + smsTemp.name + '&userKey=' + userKey
			append() {
				let self = this
				const params = {
					code: self.code,
					crawlerId: self.crawlerObj.crawlerId,
					crawlerToken: self.crawlerObj.crawlerToken,
					name: self.crawlerObj.name,
					userKey: self.userKey
				}
				uni.showLoading({
					title: '认证中...'
				})
				if (self.code === '') {
					self.errorData = Object.assign({}, self.errorData, {
						show: true,
						desc: '请输入短信验证码！'
					})
					uni.hideLoading()
					return
				}
				const smsTemp = JSON.parse(self.crawlerData.data.data);
				const getUrl = 'http://192.168.0.134:8083/risk/xingpang/appendData?code=' + self.code + '&crawlerId=' + self.crawlerObj
					.crawlerId + '&crawlerToken=' + smsTemp.crawlerToken + '&name=' + self.crawlerObj.name + '&userKey=' + smsTemp.userKey;
				if (this.bool) {
					self.$Phttp.get(getUrl).then(res => {
						res = JSON.parse(res.data.data)
						if (!!!!res.message) {
							res = JSON.parse(res.message)
						}
						if (res.code === "SUCCESS" && !!!res.data) {
							uni.navigateTo({
								url: '/pkChaoYueZu/verify/operaterSuccess'
							})
						} else {
							self.errorData = Object.assign({}, self.errorData, {
								show: true,
								desc: res.msg
							})
							this.bool = true
							this.bool2 = true
						}
						uni.hideLoading()
					})
				} else {
					self.errorData = Object.assign({}, self.errorData, {
						show: true,
						desc: "重复点击，请退回上个界面后重新进入此界面"
					})
				}
				this.bool = false;
			},
			upload() {
				let self = this
				uni.showLoading({
					title: '认证中...'
				})

				if (self.operaterPwd === '') {
					self.errorData = Object.assign({}, self.errorData, {
						show: true,
						desc: '请输入密码！'
					})
					uni.hideLoading()
					return
				}
				if (this.bool2) {
					self.$Phttp.get('http://192.168.0.134:8083/risk/xingpang/crawlerData?userKey=' + self.userKey + '&pass=' + self.operaterPwd)
						.then(res => {
							self.crawlerData = res
							res = JSON.parse(res.data.data)
							if (!!!!res.message) {
								res = JSON.parse(res.message)
							}
							if (res.code === "200" && res.data === null) {
								console.log('null')
								this.type = 'image_verify_code';
							} else {
								console.log('else')
								self.errorData = Object.assign({}, self.errorData, {
									show: true,
									desc: res.msg
								})
								this.bool = true;
							}
							uni.hideLoading()
						})
				} else {
					self.errorData = Object.assign({}, self.errorData, {
						show: true,
						desc: "请耐心等待，如等待时间过长请尝试退回上个界面后重新进入此界面"
					})
				}
				this.bool2 = false;
			},
			parseJsonResponse() {
				// const parsedData = JSON.parse(data)
				this.type = 'image_verify_code';

				// this.crawlerObj = Object.assign(this.crawlerObj, parsedData)
			},
			parseResData(data) {
				const str = data.substring(1, data.length - 1)
				const arr = str.split(', ')
				let obj = {}
				arr.forEach(element => {
					const elementArr = element.split('=')
					obj[elementArr[0]] = elementArr[1]
				});
				if (obj.name) {
					this.type = obj.name
					if (obj.name === 'image_verify_code') {
						this.imgSrc = obj.imageUrl
					}
				}
				this.crawlerObj = Object.assign(this.crawlerObj, obj)
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
		background: #fff;

		.text-tips {
			height: 60rpx;
			line-height: 60rpx;
			background: rgba(255, 236, 230, 1);
			font-size: 24rpx;
			color: #ff4230;
			width: 100%;
		}

		.row-wrap {
			display: flex;
			flex-direction: row;
			width: 100%;
			background: #fff;
			border-bottom: 1rpx solid #f4f4f4;
			border-top: 1rpx solid #f4f4f4;
			color: #999;
			align-items: center;

			.row-title {
				width: 360rpx;
				font-size: 30rpx;
				color: #999;
				height: 96rpx;
				line-height: 96rpx;
				margin-left: 20rpx;
			}

			.row-select {
				font-size: 26rpx;
				margin-left: 20rpx;
				margin-bottom: 4rpx;
				border-bottom: 1rpx solid #f4f4f4;
				width: 500rpx;
				height: 50rpx;
				background: #fff;
				text-align: center;
			}

			.row-input {
				height: 96rpx;
				width: 100%;
				text-align: right;
				margin-right: 36rpx;
				font-size: 30rpx;
			}

			.row-picker {
				width: 100%;
				height: 100%;
				line-height: 96rpx;
				text-align: right;
				align-content: center;
				margin-right: 20rpx;
				font-size: 30rpx;
			}

			.nav-icon {
				width: 32rpx;
				height: 32rpx;
				margin-right: 20rpx;
			}
		}

		.verifyImg {
			height: 400rpx;
			width: 400rpx;
			border: 1rpx solid #f4f4f4;
		}

		.wxts-tip {
			display: flex;
			flex-direction: column;
			padding: 100rpx 30rpx 0;
			box-sizing: border-box;
			font-size: 32rpx;

			.wxts-p {
				display: flex;
				align-items: center;
				line-height: 48rpx;
			}

			.fc-red {
				color: #f30;
			}

			.pt9 {
				padding-top: 18rpx;
			}

			.ti8 {
				text-indent: 16rpx;
			}

			.ti44 {
				text-indent: 88rpx;
			}
		}
	}

	.bottom {
		background: linear-gradient(180deg, rgba(82, 171, 252, 1) 0%, rgba(6, 135, 255, 1) 100%);
		border-radius: 50rpx;
		width: 666rpx;
		height: 88rpx;
		line-height: 88rpx;
		color: #fff;
		font-size: 32rpx;
		font-weight: 400;
		align-items: center;
		text-align: center;
		margin-top: 40rpx;
	}
</style>
