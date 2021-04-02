<template>
	<view class="main-center-page bg-white" style="background: white;">
		<error-tip :propData="errorData" @hide="errorHide"></error-tip>
		<!-- <view class="logo-box">
			<image class="login-logo" src="../../static/chaoyuezu/logo-cyz.png"/>
		</view> -->

		<view class='content mrg-top-30'>
			<form @submit="formSubmit">
				<view class='column-box'>
					<view class='col'>
						<image class="mlr30 cyz-icon-phone" src="../../static/icon-phone.png" mode=""></image>
						<input v-model="mobile" type="number" name="mobile" class='input' maxlength="11" placeholder='请输入您的手机号码' />
					</view>
					<view class='col mrg-top-20'>
						<image class="mlr30 cyz-icon-key" src="../../static/icon-key.png" mode=""></image>
						<input name="code" type="number" class='input' placeholder='请输入验证码' maxlength="6" @input="codeInput" />
						<view class="btn round" @tap='verify'>{{countDownNum>0?'剩余'+countDownNum+'秒':'获取验证码'}}</view>
					</view>
				</view>
				<button class="formBtn bg-blue round" formType="submit">登 录</button>
			</form>
		</view>

		<!-- 第三方登录 Start -->
		<view class="flex-bottom">
			<!-- <view class="text-grey mrg-top-60 text-center"> 推荐使用微信登录 </view>
			<view class="login-group">
				<image class="login-group-item lgi-wx" src="../../static/wx.png" @click="handleWx"></image>
			</view> -->
			<view style="display: flex;justify-content: center;align-items: center;" class="mrg-top-20 ">
				<view style="margin-right: 20rpx;">
					<view @click="radioChange" style="width: 50rpx;height: 50rpx;border-radius: 50%;border: 1rpx solid #D3D3D3;box-sizing: border-box;">
						<image v-if="isread" style="width: 50rpx;height: 50rpx;" src="../../static/success.jpg" mode=""></image>
					</view>
				</view>
				<view class="text-center fb-text-bottom">登录使用就表示同意超悦租<view class="text-blue" @click="toArticle('f01d136d4e9e4a9d98877ad1126908d0', '隐私权政策')">条款</view>和<view
					 class="text-blue" @click="toArticle('f01d136d4e9e4a9d98877ad1126908d0', '隐私权政策')">隐私</view>政策
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import Config from "../../common/js/Config"
	import toast from '../../common/js/toast.js'
	import Util from '../../common/js/util.js'
	import Login from "../../common/js/Login"

	import ErrorTip from '../../components/yx_dialog/myErrorTip.vue'
	import {
		mapMutations
	} from "vuex"

	export default {
		name: "wxLogin",
		mixins: [toast],
		components: {
			ErrorTip
		},
		watch: {
			userInfo: {
				handler() {
					console.log(this.userInfo)

				},
				immediate: false
			}
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			},
			globalI() {
				return this.$store.state.globalI
			}
		},
		onShow() {},
		data() {
			return {
				mobile: '',
				countDownNum: 0,
				timer: Object,
				// 错误提示
				errorData: {
					show: false,
					desc: ''
				},
				code: '',
				isread: false
			}
		},
		methods: {
			...mapMutations(['setUserInfo']),
			toTelLogin() {
				uni.redirectTo({
					url: "./phoneLogin"
				})
			},
			toArticle(id, title) {
				uni.navigateTo({
					url: "/pkUserInfo/info/protocolDetails?id=" + id + "&title=" + title
				})
			},
			radioChange() {
				this.isread = !this.isread
			},
			wxLogin(data) {
				let self = this
				self.$Phttp.post(Config.JAVA_SAAS_URLS.loginByWxapp, data, 'application/json').then(res => {
					res = res.data
					if (res.code === 0) {
						self.setUserInfo(res.data)
						if (!res.data.bind_user_key) {
							uni.redirectTo({
								url: './phone'
							})
							return
						} else {
							self.setUserInfo({
								user_key: res.data.bind_user_key
							})
						}

						uni.navigateBack()
					}
				})
			},
			handleWx() {
				let self = this
				//拿去推送id
				let clientId = this.$store.state.clientId
				Login.getLoginCode((loginRes) => {
					console.log(loginRes);
					if (loginRes.errMsg === 'login:ok') {
						self.setUserInfo(loginRes.authResult)
						Login.getUserInfo(resInfo => {
							if (resInfo.errMsg === 'getUserInfo:ok') {
								self.setUserInfo(resInfo.userInfo)
								let postData = {
									app_key: "123",
									avatar_url: resInfo.userInfo.avatarUrl,
									city: resInfo.userInfo.city,
									country: resInfo.userInfo.country,
									gender: resInfo.userInfo.gender,
									nick_name: resInfo.userInfo.nickName,
									wx_app_openid: resInfo.userInfo.openId,
									province: resInfo.userInfo.province,
									union_id: resInfo.userInfo.unionId,
									client_id: clientId
								}
								self.wxLogin(postData)
							}
						})
					}
				})
			},
			getPhoneNumber: function(e) {
				let self = this
				console.log(e)
				if (e.detail.errMsg === 'getPhoneNumber:ok') {
					var detail = e.detail
					self.Toast({
						desc: '加载中...',
						type: 'loading',
						time: 8000
					})
					Login.getLoginCode(loginRes => {
						console.log(loginRes)
						let data = {
							data: detail.encryptedData,
							iv: detail.iv,
							code: loginRes.code
						}
						self.$Phttp.post(Config.JAVA_SAAS_URLS.decryptTelByCode, data).then((res) => {
							res = res.data
							if (res.code === 0) {
								self.telLogin(res.data.phoneNumber)
							}
						})
					})
				}
			},
			telLogin: function(tel) {
				let self = this
				let postData = Object.assign(self.userInfo, {
					tel: tel
				})
				self.$Phttp.post(Config.JAVA_SAAS_URLS.loginByTelWx, postData).then(res => {
					res = res.data
					if (res.code === 0) {
						delete res.data.openid
						self.setUserInfo(res.data)

						if (res.data.img === null) {
							uni.redirectTo({
								url: '/pkUserInfo/info/wxInfoAuth'
							})
						} else {
							uni.navigateBack();
						}
					}
				})
			},
			verify: function() {
				let self = this
				if (self.countDownNum > 0) {
					self.errorData = Object.assign({}, self.errorData, {
						show: true,
						desc: "还需要等待" + self.countDownNum + "秒"
					})
					return
				}
				if (!(/^1(1|2|3|4|5|6|7|8|9)\d{9}$/.test(self.mobile))) {
					self.errorData = Object.assign({}, self.errorData, {
						show: true,
						desc: "请输入正确的手机号码"
					})
					return
				}

				// get code.
				let data = {
					tel: self.mobile,
					m: 'sqtg_sun'
				}
				self.$Phttp.post(Config.JAVA_SAAS_URLS.getCode, data).then((res) => {
					res = res.data
					if (res.code === 0) {
						self.countDownNum = 120
						self.countDown()
					} else {
						self.errorData = Object.assign({}, self.errorData, {
							show: true,
							desc: res.msg
						})
					}
				})
			},
			countDown: function() {
				let self = this;
				//如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
				self.timer = setInterval(function() {
					self.countDownNum--;
					if (self.countDownNum == 0) {
						self.clearTimer()
					}
				}, 1000)
			},
			clearTimer: function() {
				if (!Util.isEmptyObject(this.timer))
					clearInterval(this.timer)
			},
			// 错误隐藏
			errorHide: function(e) {
				if (!e.detail) {
					this.errorData.show = false;
					return
				}
				this.errorData = e.detail
			},
			mobileInput: function(e) {
				console.log(e)
				this.mobile = e.detail.value
			},
			codeInput: function(e) {
				this.code = e.detail.code
			},
			formSubmit: function(e) {
				let self = this
				let mobile = e.detail.value.mobile
				let code = e.detail.value.code
				if (!(/^1(1|2|3|4|5|6|7|8|9)\d{9}$/.test(mobile))) {
					self.errorData = Object.assign({}, self.errorData, {
						show: true,
						desc: "请输入正确的手机号码"
					})
					return
				}
				if (code == '') {
					self.errorData = Object.assign({}, self.errorData, {
						show: true,
						desc: "请输入验证码"
					})
					return
				}
				if (!self.isread) {
					self.errorData = Object.assign({}, self.errorData, {
						show: true,
						desc: "请阅读同意超悦租条款及隐私政策"
					})
					return
				}
				let clientId = this.$store.state.clientId
				let postData = Object.assign(self.userInfo, {
					tel: mobile,
					sms_code: code,
					client_id: clientId
				})
				console.log(JSON.stringify(postData))
				self.$Phttp.post(Config.JAVA_SAAS_URLS.loginByTel, postData).then((res) => {
					res = res.data
					console.log("接口返回：" + JSON.stringify(res));
					if (res.code === 0) {
						delete res.data.openid
						self.setUserInfo(Object.assign(res.data, {
							avatarUrl: res.data.avatar_url,
							nickName: res.data.nick_name
						}))

						uni.navigateBack();
					} else {
						self.toast({
							desc: '登录失败'
						})
					}
				})
			}
		},
		onUnload() {
			this.clearTimer()
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
	}

	.logo-box {
		margin-top: 60rpx;

		.login-logo {
			width: 167rpx;
			height: 228rpx;
		}
	}

	.column-box {
		width: calc(100% - 40rpx);
		margin-left: 20rpx;
		margin-right: 20rpx;
		background: #fff;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
	}

	.column-box .col {
		display: flex;
		align-items: center;
		width: calc(100% - 48rpx);
		height: 100rpx;
		line-height: 100rpx;
		margin-left: 24rpx;
		margin-right: 24rpx;
		border: 1rpx solid #ebebeb;
		border-radius: 50rpx;
		box-shadow: 0 1px 5px 0px #ebebeb;
	}

	.column-box .col:last-child {
		border-bottom: 0;
	}

	.column-box .col .mlr30 {
		margin: 0 30rpx 0 48rpx;
	}

	.column-box .col .name {
		width: 160rpx;
		font-size: 28rpx;
		color: #333;
	}

	.column-box .col .input {
		flex: 1;
		height: 80rpx;
		font-size: 28rpx;
		color: #666;
	}

	.column-box .col .cyz-icon-phone {
		width: 36rpx;
		height: 56rpx;
	}

	.column-box .col .cyz-icon-key {
		width: 36rpx;
		height: 36rpx;
	}

	.column-box .col .btn {
		margin-right: 10rpx;
		width: 200rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 24rpx;
		color: #fff;
		text-align: center;
		background: #1f6ecf;
	}

	.formBtn {
		width: calc(100% - 60rpx);
		margin: 180rpx auto 0;
		height: 100rpx;
		line-height: 100rpx;
		color: #fff;
		font-size: 30rpx;
		box-shadow: 0px 3px 10px 0px #b9cff5
	}

	.flex-bottom {
		// position: fixed;
		// bottom: 80rpx;
		// left: 0;
		// right: 0;
		width: 100%;

		.login-group {
			margin-top: 30rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			.login-group-item {
				width: 66rpx;
				height: 66rpx;
			}
		}

		.fb-text-bottom {
			display: flex;
			align-content: center;
			justify-content: center;
		}
	}
</style>
