<template>
	<view class="content">
		<error-tips :propData="errorData" @hide="errorHide"></error-tips>
		<view class="text-tips">
			<text style="margin-left: 35rpx;">提示：请填写正确的银行卡信息，有助于审核通过</text>
		</view>
		<view class="text-head" v-show="!ifVerified">添加银行卡信息</view>
		<view class="row-wrap">
			<view class="row-title">银行卡号</view>
			<input focus placeholder="请输入银行卡号" type="number" class="row-input" v-model="cardNumber" />
		</view>
		<view class="row-wrap">
			<view class="row-title">开户行</view>
			<picker :range="bankList" :value="bankIndex" class="row-picker" @change="handleBankChange">
				<view>{{bankList[bankIndex]}}</view>
			</picker>
			<image src="/static/icon-right.png" class="nav-icon" />
		</view>
		<view class="row-wrap">
			<view class="row-title">预留手机号码</view>
			<input placeholder="请输入手机号" type="number" class="row-input" v-model="phone" />
		</view>
		<view class="row-wrap">
			<view class="row-title">短信验证码</view>
			<input placeholder="请填写验证码" type="number" class="row-input" v-model="identityCode" />
			<view class="code-button" @click="getCode">{{countDownNum>0?'剩余'+countDownNum+'秒':'获取验证码'}}</view>
		</view>

		<view class="bottom" @click="upload">{{!ifVerified ? '提交': '下一步'}}</view>
		<view class="bottom" @click="jump">跳过</view>
	</view>
</template>
<script>
	import errorTips from '../../components/yx_dialog/myErrorTip.vue'
	import util from '../../common/js/util.js'
	import Config from './config.js'
	export default {
		name: 'bankCard',
		components: {
			errorTips
		},
		data() {
			return {
				userKey: '',
				bankIndex: 0,
				bankList: Config.BANK_LIST,
				cardNumber: '',
				phone: '',
				identityCode: '',
				countDownNum: 0,
				// 错误提示
				errorData: {
					show: false,
					desc: ''
				},
				ifVerified: false,
			}
		},
		onLoad(options) {
			this.userKey = options.userKey
		},
		onShow() {
			let self = this
			self.$Phttp.get(Config.REQUEST_URLS.getBankCard, {
				userKey: self.userKey,
				appKey: 123
			}).then(res => {
				res = res.data
				if (res.code === 200 && res.data.bankCardNumber) {
					self.cardNumber = res.data.bankCardNumber
					self.bankIndex = Config.BANK_LIST.indexOf(res.data.bankName)
					self.phone = res.data.bankPhone
					self.ifVerified = true
				}
			})
		},
		methods: {
			getCode() {
				let self = this
				if (self.countDownNum > 0) {
					self.errorData = Object.assign({}, self.errorData, {
						show: true,
						desc: '还需等待' + self.countDownNum + '秒'
					})
					return
				}
				if (!(/^1(3|4|5|7|8|9)\d{9}$/.test(self.phone))) {
					self.errorData = Object.assign({}, self.errorData, {
						show: true,
						desc: "请输入正确的手机号码"
					})
					return
				}
				const data = {
					phone: self.phone
				}
				self.$Phttp.get(Config.REQUEST_URLS.getIdentityCode, data).then(res => {
					res = res.data
					if (res.code === 200) {
						self.errorData = Object.assign({}, self.errorData, {
							show: true,
							desc: "已成功发送验证码"
						})
						self.countDownNum = 120
						self.countDown()
					} else {
						self.errorData = Object.assign({}, self.errorData, {
							show: true,
							desc: res.data
						})
					}
				})
			},
			countDown: function() {
				let self = this;
				//如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
				self.timer = setInterval(function() {
					self.countDownNum--;
					if (self.countDownNum === 0) {
						self.clearTimer()
					}
				}, 1000)
			},
			clearTimer: function() {
				if (!util.isEmptyObject(this.timer))
					clearInterval(this.timer)
			},
			errorHide: function(e) {
				if (!e.detail) {
					this.errorData.show = false;
					return
				}
				this.errorData = e.detail
			},
			handleBankChange(e) {
				this.bankIndex = e.target.value
			},
			getCurrentBankCode() {
				let map = {}
				map[map['000'] = '请选择开户行'] = '000'
				map[map['001'] = '中国工商银行'] = '001'
				map[map['002'] = '中国农业银行'] = '002'
				map[map['003'] = '中国银行'] = '003'
				map[map['004'] = '中国建设银行'] = '004'
				map[map['005'] = '交通银行'] = '005'
				map[map['006'] = '招商银行'] = '006'
				map[map['007'] = '中信银行'] = '007'
				map[map['008'] = '中国民生银行'] = '008'
				map[map['009'] = '中国邮政储蓄银行'] = '009'
				map[map['010'] = '华夏银行'] = '010'
				map[map['011'] = '中国光大银行'] = '011'

				const text = this.bankList[this.bankIndex]
				const code = map[this.bankList[this.bankIndex]]
				return {
					code: code,
					text: text
				}
			},
			upload() {
				let self = this
				if (self.ifVerified) {
					uni.navigateTo({
						url: '/pkChaoYueZu/verify/bankCardSuccess?userKey=' + self.userKey
					})
					return
				}
				if (!self.checkInfo()) {
					self.errorData = Object.assign({}, self.errorData, {
						show: true,
						desc: '请填写完整信息~'
					})
					return
				}
				if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(self.phone))) {
					self.errorData = Object.assign({}, self.errorData, {
						show: true,
						desc: "请输入正确的手机号码"
					})
					return
				}
				const data = {
					userKey: self.userKey,
					// bankName: self.getCurrentBankCode(),
					bankName: self.bankList[self.bankIndex],
					bankPhone: self.phone,
					bankCardNumber: self.cardNumber,
					phoneCode: self.identityCode
				}
				self.$Phttp.post(Config.REQUEST_URLS.bandCardCredit, data).then(res => {
					res = res.data
					if (res.code === 200) {
						self.errorData = Object.assign({}, self.errorData, {
							show: true,
							desc: "已成功保存"
						})
						// uni.navigateBack()
						uni.navigateTo({
							url: '/pkChaoYueZu/verify/bankCardSuccess?userKey=' + self.userKey
						})
					} else {
						self.errorData = Object.assign({}, self.errorData, {
							show: true,
							desc: res.message
						})
					}
				})
			},
			jump() {
				let self = this
				uni.navigateTo({
					url: '/pkChaoYueZu/verify/bankCardSuccess?userKey=' + self.userKey
				})
				return
			},
			checkInfo() {
				return this.cardNumber && this.bank !== '请选择开户行' && this.phone && this.identityCode
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

		.text-tips {
			height: 60rpx;
			line-height: 60rpx;
			background: rgba(255, 236, 230, 1);
			font-size: 24rpx;
			color: #1677FF;
			width: 100%;
		}

		.text-head {
			width: 100%;
			margin-left: 20rpx;
			color: #999;
			font-size: 24rpx;
			height: 60rpx;
			line-height: 60rpx;
		}

		.row-wrap {
			display: flex;
			flex-direction: row;
			width: 100%;
			background: #fff;
			border-bottom: 1rpx solid #f4f4f4;
			color: #999;
			align-items: center;

			.row-title {
				width: 310rpx;
				font-size: 26rpx;
				color: #999;
				height: 96rpx;
				line-height: 96rpx;
				margin-left: 20rpx;
			}

			.row-select {
				font-size: 26rpx;
				margin-left: 20rpx;
				margin-bottom: 4rpx;
				width: 500rpx;
				height: 40rpx;
				text-align: center;
			}

			.row-input {
				height: 96rpx;
				width: 100%;
				text-align: right;
				margin-right: 36rpx;
				font-size: 30rpx;
			}

			.code-button {
				color: #1677FF;
				border: 1rpx solid #1677FF;
				font-size: 18rpx;
				font-weight: 400;
				width: 300rpx;
				height: 50rpx;
				line-height: 50rpx;
				border-radius: 25rpx;
				margin-right: 36rpx;
				text-align: center;
			}

			.row-picker {
				width: 100%;
				// height: 100%;
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
		// position: absolute;
		// bottom: 50rpx;
		margin: 50rpx 0;
	}

	.active-item-text {
		color: #f00a1e;
	}
</style>
