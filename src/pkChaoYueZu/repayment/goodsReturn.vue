<template>
	<view class="content">
		<error-tips :propData="errorData" @hide="errorHide"></error-tips>
		<view class="brLine"></view>

		<!-- 录入快递单 -->
		<view class="row-wrap">
			<view class="row-title">收件人姓名</view>
			<view class="row-value">{{ persion.consigneeName }}</view>
		</view>
		<view class="row-wrap">
			<view class="row-title">收件人电话</view>
			<view class="row-value">{{ persion.consigneeTel }}</view>
		</view>
		<view class="row-wrap">
			<view class="row-title">收件地址</view>
			<view class="row-value">{{ persion.deliveryAddress }}</view>
		</view>
		<view class="row-wrap">
			<view class="row-title">状态</view>
			<view class="row-value fcred">{{ applyStatusDict[persion.applyStatus] }}</view>
		</view>

		<view v-if="persion.applyStatus === 0">
			<view class="brLine"></view>
			<view class="row-wrap">
				<view class="row-title">快递单号</view>
				<input placeholder="请输入快递单号" class="row-input" v-model="expressNo" />
			</view>
			<view class="row-wrap">
				<view class="row-title">设备IMEI</view>
				<input placeholder="请输入IMEI" class="row-input" v-model="expressMei" />
			</view>
		</view>

		<view class="bottom" v-if="persion.applyStatus === 0" @click="handleSubmit">提交</view>
	</view>
</template>

<script>
	import iosBlur from '../../common/js/iosBlur.js'
	import errorTips from '../../components/yx_dialog/myErrorTip.vue'
	import Config from '../../common/js/Config.js'
	import Toast from '../../common/js/toast.js'
	export default {
		name: 'goodsReturn',
		components: {
			errorTips
		},
		mixins: [iosBlur],
		data() {
			return {
				userKey: '',
				orderKey: '',
				// 错误提示
				errorData: {
					show: false,
					desc: ''
				},
				expressNo: '',
				expressMei: '',
				persion: {
					applyStatus: 0, // 0未申请 1申请中 2已确认
					consigneeName: '',
					consigneeTel: '',
					deliveryAddress: ''
				},
				applyStatusDict: ['未申请', '申请中', '已确认'],
				returnType: null
			}
		},
		onLoad(options) {
			console.log(options)
			this.userKey = options.userKey;
			this.orderKey = options.orderKey;
			options.returnType ? this.returnType = 1 : this.returnType = null
			// 解决ios兼容性
			// #ifdef H5
			document.body.addEventListener('focusout', () => {
				this.iosBlur()
			})
			document.body.addEventListener('focusin', () => {
				this.iosBlur()
			})
			// #endif
			this.init();
		},
		onShow() {
			let self = this
			if (self.userKey == undefined) {
				self.userKey = '';
				return;
			}
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			},
		},
		methods: {
			init() {
				let self = this;
				let params = {
					userKey: self.userInfo.user_key,
					orderKey: self.orderKey
				};

				uni.showLoading({
					title: '加载中...'
				})

				console.log('提交参数：' + JSON.stringify(params));

				this.$Phttp.post(Config.REQUEST_URLS.getReturnInfo, params).then(res => {
					console.log('返回结果：' + JSON.stringify(res));
					uni.hideLoading();
					if (res.data.code === 200) {

						self.persion.applyStatus = res.data.data.applyStatus;
						self.persion.consigneeName = res.data.data.consigneeName;
						self.persion.consigneeTel = res.data.data.consigneeTel;
						self.persion.deliveryAddress = res.data.data.deliveryAddress;
					}
				})
			},

			handleSubmit() {
				let self = this;

				if (!self.expressNo) {
					self.errorData = Object.assign({}, self.errorData, {
						show: true,
						desc: '请填写快递单号~'
					})
				}
				if (!self.expressMei) {
					self.errorData = Object.assign({}, self.errorData, {
						show: true,
						desc: '请填写快递单MEI码~'
					})
				}

				let params = {
					userKey: self.userInfo.user_key,
					orderKey: self.orderKey,
					expressNo: self.expressNo,
					expressMei: self.expressMei,
					type: self.returnType
				};

				uni.showLoading({
					title: '提交中...'
				})

				console.log('提交参数：' + JSON.stringify(params));

				this.$Phttp.post(Config.REQUEST_URLS.executeReturn, params).then(res => {
					console.log('返回结果：' + JSON.stringify(res));
					uni.hideLoading();
					if (res.data.code === 200) {
						uni.showToast({
							title: '归还申请已提交！',
							duration: 3000
						})
						self.persion.applyStatus = 1;


					} else {
						uni.showToast({
							title: res.data.message,
							duration: 3000,
							icon: 'none'
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
		padding-bottom: 100rpx;

		.text-tips {
			height: 60rpx;
			line-height: 60rpx;
			background: rgba(244, 249, 255, 1);
			font-size: 24rpx;
			color: #1677FF;
			width: 100%;
		}

		.row-wrap {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			width: 100%;
			background: rgba(255, 255, 255, 1);
			border-bottom: 1rpx solid #f4f4f4;
			color: #999;
			align-items: center;

			.row-title {
				width: 40%;
				font-size: 30rpx;
				color: #999;
				height: 96rpx;
				line-height: 96rpx;
				margin-left: 20rpx;
			}

			.row-input {
				height: 96rpx;
				width: 100%;
				text-align: right;
				margin-right: 36rpx;
				font-size: 30rpx;
			}

			.row-value {
				margin-right: 20rpx;
			}

			.nav-icon {
				width: 32rpx;
				height: 32rpx;
				margin-right: 20rpx;
			}
		}

		.bottom {
			background: linear-gradient(90deg,
					rgba(255, 131, 18, 1) 0%,
					rgba(251, 38, 34, 1) 100%);
			border-radius: 50rpx;
			width: 666rpx;
			height: 88rpx;
			line-height: 88rpx;
			color: #fff;
			font-size: 32rpx;
			font-weight: 400;
			align-items: center;
			text-align: center;
			margin-top: 100rpx;
			// margin-top: 200rpx;
			// bottom: 20rpx;
			// position: fixed;
		}

		.brLine {
			width: 100%;
			height: 20rpx;
			background: #f4f4f4;
		}

		.fcred {
			color: #F43F3B !important;
		}
	}
</style>
