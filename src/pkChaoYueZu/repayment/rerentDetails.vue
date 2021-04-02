<template>
	<view class="content">

		<view class="brLine"></view>

		<view class="row-wrap">
			<view class="row-title">周期单位</view>
			<view class="row-value">月</view>
			<!-- <image src="/static/zulin/verify/icon-right.png" class="nav-icon" /> -->
		</view>

		<view class="row-wrap">
			<view class="row-title">续租期数</view>
			<picker :range="rerentPeriodList" :value="rerentPeriodIndex" class="row-picker" @change="handleRerentPeriodChange">
				<view>{{rerentPeriodList[rerentPeriodIndex]}}</view>
			</picker>
			<image src="/static/ic_arrow_right.png" class="nav-icon" />
		</view>

		<view class="flex-bottom">
			<view class="bottom" @click="onRerentEvent">续租</view>
		</view>
	</view>
</template>

<script>
	import Config from '../../common/js/Config.js'
	import Toast from '../../common/js/toast.js'
	export default {
		name: 'RerentDetails',
		mixins: [Toast],
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			}
		},
		data() {
			return {
				userKey: '',
				billKey: '',
				rerentPeriodList: ['请选择', '1期', '3期', '6期', '12期'],
				rerentPeriodIndex: 0,
			}
		},
		onLoad(options) {
			this.userKey = options.userKey;
			this.billKey = options.billKey;
			// 解决ios兼容性
			// #ifdef H5
			document.body.addEventListener('focusout', () => {
				this.iosBlur()
			})
			document.body.addEventListener('focusin', () => {
				this.iosBlur()
			})
			// #endif
		},
		onShow() {},
		methods: {
			handleRerentPeriodChange(e) {
				this.rerentPeriodIndex = e.target.value
				console.log(this.rerentPeriodIndex)
			},
			onRerentEvent() {
				var self = this;
				let params = {
					billKey: self.billKey, //租聘订单ID
					periods: self.rerentPeriodIndex == 0 ? 0 : self.rerentPeriodIndex == 1 ? 1 : self.rerentPeriodIndex == 2 ? 3 : self
						.rerentPeriodIndex == 3 ? 6 : self.rerentPeriodIndex == 4 ? 12 : '', //周期数
					periodType: '2', //周期单位1:天|2:周|3:月
					periodDays: '' //类型为天时必须传
				};

				uni.showLoading({
					title: '续租中...'
				})

				console.log("续租参数：" + JSON.stringify(params));
				console.log("续租接口：" + Config.REQUEST_URLS.executeRerent);
				this.$Phttp.post(Config.REQUEST_URLS.executeRerent, params).then(res => {
					console.log('返回结果：' + JSON.stringify(res));
					uni.hideLoading();
					if (res.data.code === 200) {

						//跳转续租成功页
						uni.navigateTo({
							url: '/pkChaoYueZu/repayment/rerentResult?userKey=' + this.userKey + '&billKey=' + this.billKey
						})
					} else {
						uni.showToast({
							title: res.data.message,
							duration: 3000,
							icon: 'none'
						})
					}
				})

			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		height: calc(100vh);
		background: #f8f8f8;

		.row-wrap {
			display: flex;
			flex-direction: row;
			width: 100%;
			background: rgba(255, 255, 255, 1);
			border-bottom: 1rpx solid #f4f4f4;
			color: #999;
			align-items: center;

			.row-title {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				width: 700rpx;
				font-size: 30rpx;
				color: #999;
				height: 96rpx;
				line-height: 96rpx;
				margin-left: 20rpx;

				.red-dot {
					float: left;
					color: #F43F3B;
					font-size: 24rpx;
				}
			}

			.row-value {
				margin-right: 20rpx;
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
				width: 64rpx;
				height: 32rpx;
				margin-right: 20rpx;
			}
		}

		.flex-bottom {
			position: fixed;
			bottom: 0;
			padding: 12rpx 0;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;

			.bottom {
				background: linear-gradient(90deg,
					rgba(255, 131, 18, 1) 0%,
					rgba(251, 38, 34, 1) 100%);
				border-radius: 50rpx;
				width: 622rpx;
				height: 84rpx;
				line-height: 84rpx;
				color: #fff;
				font-size: 30rpx;
				font-weight: 400;
				align-items: center;
				text-align: center;
			}
		}

		.brLine {
			width: 100%;
			height: 20rpx;
			background: #f4f4f4;
		}



	}
</style>
