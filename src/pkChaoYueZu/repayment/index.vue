<template>
	<view class="content">
		<!--缺省页-->
		<view class="default-page" v-if="isShowDefault">
			<view class="icon-default">
				<img src="/static/icon-none.png" alt="">
			</view>
			<view class="text">暂无数据</view>
		</view>

		<view class="main-page" v-if="!isShowDefault">
			<view class="vor-tabBar bkfff" v-if="billStatus==1">
				<view class="vor-tabBar-inner">
					<view class="vor-tabBar-item" :class="{active: isShowTab}" @click="changeTab(0)">当前账单<view
							class="cute-active"></view>
					</view>
					<view class="vor-tabBar-item" :class="{active: !isShowTab}" @click="changeTab(1)">提前买断/归还 <view
							class="cute-active"></view>
					</view>
				</view>
			</view>
			<!-- 我的还款 -->
			<view class="tabBar-content" v-show="isShowTab" v-if="billStatus==1">
				<view class="repayment-total bkfff">
					<view class="repayment-total-item">
						<view class="text">交租期数</view>
						<view class="value">{{pageObject.repayPeriods}}/{{pageObject.periods}}</view>
					</view>
					<view class="repayment-total-item">
						<view class="text">待交总租金(元）</view>
						<view class="value">{{(pageObject.surTotalAmt - pageObject.billBuyAmt).toFixed(2)}}</view>
					</view>
					<!--<view class="repayment-total-item">-->
					<!--<view class="text">租金总额(元）</view>-->
					<!--<view class="value">{{pageObject.billAmt}}</view>-->
					<!--</view>-->
				</view>
				<view class="ptb50 tc bkfff">
					<view class="fs28 fc999">本期应交租金(元)</view>
					<view class="mt20 fs92 fcred fb600">{{(pageObject.unPayTotalAmt).toFixed(2)}}</view>
					<view class="mt20 fs28 fc222">最后交租日 {{pageObject.unPayLastDate}}</view>
				</view>
				<view class="mt20 ptb48 repayment-total tc bkfff">
					<!--<view class="">-->
					<!--<view class="fs24 fc999">租金本金(元）</view>-->
					<!--<view class="mt10 fs32 fc222 fb600">{{pageObject.unPayAmt}}</view>-->
					<!--</view>-->
					<view class="">
						<view class="fs24 fc999">违约金(元）</view>
						<view class="mt10 fs32 fc222 fb600">{{pageObject.unPayFineAmt}}</view>
					</view>
				</view>

				<view class="list-wrap mt20">
					<view class="list-row" @click="handleViewBillDetails">
						<image class="row-image" src="/static/icon-bill-details.png" />
						<text class="row-content">账单明细</text>
						<image class="row-right" src="/static/ic_arrow_right.png" />
					</view>
				</view>

				<view class="list-wrap mt20">
					<view class="list-row" @click="onViewOverdueEvent">
						<image class="row-image" src="/static/icon-yuqi-details.png" />
						<text class="row-content">查看违约</text>
						<image class="row-right" src="/static/ic_arrow_right.png" />
					</view>
				</view>

				<div class="coloum-container mrg-top-20 bg-white" style="padding:0px 30upx;margin-bottom: 50upx;">
					<div style="height: 1px;width: 690upx;background: #F8F8F8;margin-bottom: 30upx;"></div>
					<div class="row-container text-black" style="height: 80upx;font-size: 32upx;">
						<div>支付方式</div>
					</div>
					<checkbox-group class="block" @change="CheckboxChange">
						<radio-group @change="radioChange">
							<view class="cu-form-group" style="padding-left: 0upx;">
								<view class="row-container align-center">
									<radio class='round blue' value="wxpay" :class="payType=='wxpay'?'checked':''"
										:checked="payType=='wxpay'?true:false" color="#0081ff"></radio>
									<view style="font-size: 24upx;color: #222222;margin-left: 12upx;">微信支付</view>
								</view>
							</view>
							<view class="cu-form-group" style="padding-left: 0upx;">
								<view class="row-container align-center">
									<radio class='round blue' value="alipay" :class="payType=='alipay'?'checked':''"
										:checked="payType=='alipay'?true:false" color="#0081ff"></radio>
									<view style="font-size: 24upx;color: #222222;margin-left: 12upx;">支付宝支付</view>
								</view>
							</view>
						</radio-group>
					</checkbox-group>
				</div>
				<view class="flex-bottom" style="position: relative;">
					<view class="bottom" v-if="billStatus===1" @click="onRepaymentEvent">立即交租</view>
					<view class="bottom" v-if="billStatus===2" @click="onBuyoutEvent">买断</view>
					<view class="bottom" v-if="billStatus===3" :class="'disabled'">已还清</view>
				</view>
			</view>
			<!-- 提前结清 -->
			<view class="tabBar-content" v-show="!isShowTab" v-if="billStatus===1">
				<view class="ptb60 tc bkfff">
					<!--<view class="fs28 fc999">待交租金额(元)</view>-->
					<!--<view class="mt24 fs92 fcred fb600">{{pageObject.unPayTotalAmt || 0}}</view>-->
					<view class="fs24 fc999">剩余租金(元)</view>
					<view class="mt10 fs32 fc222 fb600">{{(pageObject.surTotalAmt - pageObject.billBuyAmt).toFixed(2)}}
					</view>
				</view>
				<view class="mt20 ptb48 repayment-total tc bkfff">
					<!--<view class="">-->
					<!--<view class="fs24 fc999">剩余租金(元)</view>-->
					<!--<view class="mt10 fs32 fc222 fb600">{{pageObject.surTotalAmt || 0}}</view>-->
					<!--</view>-->
					<view class="">
						<view class="fs24 fc999">买断金额(元)</view>
						<view class="mt10 fs32 fc222 fb600">{{pageObject.beforePayAmt}}</view>
					</view>
					<view class="">
						<view class="fs24 fc999">违约金(元)</view>
						<view class="mt10 fs32 fc222 fb600">{{pageObject.surFineAmt}}</view>
					</view>
				</view>
				<view class="list-wrap mt20">
					<view class="list-row" @click="toReturnPage(true)">
						<image class="row-image" src="/static/icon-yuqi-details.png" />
						<text class="row-content">提前归还</text>
						<image class="row-right" src="/static/ic_arrow_right.png" />
					</view>
				</view>

				<div class="coloum-container mrg-top-20 bg-white" style="padding:0px 30upx;margin-bottom: 50upx;">
					<div style="height: 1px;width: 690upx;background: #F8F8F8;margin-bottom: 30upx;"></div>
					<div class="row-container text-black" style="height: 80upx;font-size: 32upx;">
						<div>支付方式</div>
					</div>
					<checkbox-group class="block" @change="CheckboxChange">
						<radio-group @change="radioChange">
							<view class="cu-form-group" style="padding-left: 0upx;">
								<view class="row-container align-center">
									<radio class='round blue' value="wxpay" :class="payType=='wxpay'?'checked':''"
										:checked="payType=='wxpay'?true:false" color="#0081ff"></radio>
									<view style="font-size: 24upx;color: #222222;margin-left: 12upx;">微信支付</view>
								</view>
							</view>
							<view class="cu-form-group" style="padding-left: 0upx;">
								<view class="row-container align-center">
									<radio class='round blue' value="alipay" :class="payType=='alipay'?'checked':''"
										:checked="payType=='alipay'?true:false" color="#0081ff"></radio>
									<view style="font-size: 24upx;color: #222222;margin-left: 12upx;">支付宝支付</view>
								</view>
							</view>
						</radio-group>
					</checkbox-group>
				</div>
				<view class="flex-bottom" style="position: relative;">
					<view class="bottom" v-if="billStatus==1" @click="onBuyoutEvent">提还买断</view>
					<view class="bottom" v-if="billStatus==2" @click="onBuyoutEvent">买断</view>
					<view class="bottom" v-if="billStatus==3" :class="'disabled'">已还清</view>
				</view>
			</view>

			<!-- 买断 Start -->
			<view class="tabBar-content" v-if="billStatus==2">
				<view class="ptb60 tc bkfff">
					<view class="fs28 fc999">买断金额(元)</view>
					<view class="mt24 fs92 fcred fb600">{{pageObject.beforePayAmt || 0}}</view>
				</view>

				<view class="list-wrap mt20" v-if="pageObject.isBuyOut===0">
					<view class="list-row" @click="onViewRenewalEvent">
						<image class="row-image" src="/static/icon-yuqi-details.png" />
						<text class="row-content">到期续租</text>
						<image class="row-right" src="/static/ic_arrow_right.png" />
					</view>
				</view>

				<view class="list-wrap mt20" v-if="pageObject.isBuyOut===0">
					<view class="list-row" @click="toReturnPage(false)">
						<image class="row-image" src="/static/icon-yuqi-details.png" />
						<text class="row-content">归还</text>
						<image class="row-right" src="/static/ic_arrow_right.png" />
					</view>
				</view>

				<div class="coloum-container mrg-top-20 bg-white" style="padding:0px 30upx;margin-bottom: 50upx;">
					<div style="height: 1px;width: 690upx;background: #F8F8F8;margin-bottom: 30upx;"></div>
					<div class="row-container text-black" style="height: 80upx;font-size: 32upx;">
						<div>支付方式</div>
					</div>
					<checkbox-group class="block" @change="CheckboxChange">
						<radio-group @change="radioChange">
							<view class="cu-form-group" style="padding-left: 0upx;">
								<view class="row-container align-center">
									<radio class='round blue' value="wxpay" :class="payType=='wxpay'?'checked':''"
										:checked="payType=='wxpay'?true:false" color="#0081ff"></radio>
									<view style="font-size: 24upx;color: #222222;margin-left: 12upx;">微信支付</view>
								</view>
							</view>
							<view class="cu-form-group" style="padding-left: 0upx;">
								<view class="row-container align-center">
									<radio class='round blue' value="alipay" :class="payType=='alipay'?'checked':''"
										:checked="payType=='alipay'?true:false" color="#0081ff"></radio>
									<view style="font-size: 24upx;color: #222222;margin-left: 12upx;">支付宝支付</view>
								</view>
							</view>
						</radio-group>
					</checkbox-group>
				</div>
				<view class="flex-bottom" style="position: relative;">
					<view class="bottom" v-if="billStatus==1" @click="onBuyoutEvent">提还买断</view>
					<view class="bottom" v-if="billStatus==2" @click="onBuyoutEvent">买断</view>
					<view class="bottom" v-if="billStatus==3" :class="'disabled'">已还清</view>
				</view>
			</view>

			<!-- 买断 End -->
		</view>

	</view>
</template>

<script>
	import Config from '../../common/js/Config.js'
	import Toast from '../../common/js/toast.js'
	import Pay from '../../common/js/pay.js'
	export default {
		name: 'BillIndex',
		mixins: [Toast, Pay],
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			},
			billStatus() {
				const self = this;
				if (self.pageObject.status === '00' || self.pageObject.status === '01' || self.pageObject.status ===
					'02') {
					return 1;
				}
				if (self.pageObject.isBuyOut != 2) {
					return 2;
				} else {
					return 3;
				}
			}
		},
		data() {
			return {
				userKey: '',
				billKey: '',
				orderKey: '',
				isShowTab: true,
				isShowDefault: true,
				pageObject: {},
				isBuyOut: null,
				payType: 'wxpay',
			}
		},
		onLoad(options) {
			this.userKey = options.userKey;
			this.billKey = options.billKey;
			this.orderKey = options.orderKey;

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
		onShow() {
			let self = this;
			self.onInitBillDetails();
		},
		methods: {
			changeTab(index) {
				if (index === 0) {
					this.isShowTab = true
				} else {
					this.isShowTab = false
				}
			},
			/**
			 * 初始化页面数据
			 */
			onInitBillDetails() {
				let self = this;
				uni.showLoading({
					title: '加载中'
				});
				console.log('billKey:' + self.billKey);
				this.$Phttp.get(Config.REQUEST_URLS.getBillResult, {
						billKey: self.billKey
					})
					.then(res => {
						console.log("初始化页面数据-->" + JSON.stringify(res));
						res = res.data;
						if (res.code === 200) {
							self.pageObject = res.data;

							if (Object.keys(self.pageObject).length === 0) {
								self.isShowDefault = true;
							} else {
								self.isShowDefault = false;
							}
						}
						uni.hideLoading();
					})
			},
			radioChange: function(e) {
				this.payType = e.target.value
			},
			CheckboxChange(e) {
				console.log(e);
			},
			/**
			 * 查看违约
			 * @param {String}
			 * @return {type}
			 */
			onViewOverdueEvent() {
				uni.navigateTo({
					url: '/pkChaoYueZu/repayment/overdueInfo?userKey=' + this.userKey + '&billKey=' + this.billKey
				})
			},
			handleViewBillDetails() {
				uni.navigateTo({
					url: '/pkChaoYueZu/repayment/billDetails?userKey=' + this.userKey + '&billKey=' + this.billKey
				})
			},
			/**
			 * 到期续租
			 */
			onViewRenewalEvent() {
				uni.navigateTo({
					url: '/pkChaoYueZu/repayment/rerentDetails?userKey=' + this.userKey + '&billKey=' + this
						.billKey
				})
			},
			/**
			 * 交租
			 */
			onRepaymentEvent() {
				let self = this;
				console.log(self.payType == 'wxpay' ? '02' : '01', )
				if (!plus.runtime.isApplicationExist({
						pname: 'com.tencent.mm',
						action: 'weixin://'
					})) {
					uni.showToast({
						title: '请先安装微信',
						duration: 2000
					});
					return false;
				}


				// 已还清情况
				if (self.pageObject.status === '00' || self.pageObject.status === '01' || self.pageObject.status ===
					'02') {} else {
					uni.showToast({
						title: '账单已还清',
						duration: 2000
					});
					return false;
				}

				self.toast({
					desc: '加载中...',
					type: 'loading',
					time: 2000,
				})

				let params = {
					billKey: self.pageObject.billKey, // 账单id
					period: self.pageObject.repayPeriods, // 期数Id
					payAmt: self.pageObject.unPayTotalAmt, // 还款金额
					payType: self.payType == 'wxpay' ? '02' : '01',
					userKey: self.userKey,
					payModel: '2'
				};
				console.log('请求参数：' + self.payType);
				this.$Phttp.post(Config.REQUEST_URLS.executeBillResult, params)
					.then(res => {
						console.log('返回结果：' + JSON.stringify(res));
						if (res.data.code === 200) {
							console.log('我要开始开始支付--》');

							let payData = self.payType === 'wxpay' ? JSON.parse(res.data.data.payData) : res.data.data
								.payData;
							let orderInfo = {};
							orderInfo.orderId = res.data.data.orderId;


							orderInfo = Object.assign(orderInfo, {
								provider: self.payType,
							});


							self.pay(
								payData,
								orderInfo,
								successInfo => {
									console.log('success', successInfo);
									uni.redirectTo({
										url: '/pkChaoYueZu/repayment/repaymentResult?orderId=' + orderInfo
											.orderId + '&userKey=' + self.userKey
									})
								},
								failInfo => {
									console.log('fail', failInfo)
								}
							)

						} else {
							uni.showToast({
								title: res.data.message,
								icon: 'none',
								duration: 3000
							});
						}
					})
			},
			/**
			 * 买断
			 * @params { String } id
			 */
			onBuyoutEvent() {
				console.log('??????????????????????')
				if (!plus.runtime.isApplicationExist({
						pname: 'com.tencent.mm',
						action: 'weixin://'
					})) {
					uni.showToast({
						title: '请先安装微信!',
						duration: 2000
					});
					return false;
				}

				let self = this;
				// 已还清情况
				if (self.pageObject.status === '00' || self.pageObject.status === '01' || self.pageObject.status ===
					'02' || self.isBuyOut !=
					2) {

				} else {
					uni.showToast({
						title: '账单已还清.',
						duration: 3000
					});
					return false;
				}
				let params = {
					billKey: self.pageObject.billKey,
					payAmt: self.pageObject.beforePayAmt,
					payType: self.payType == 'wxpay' ? '02' : '01',
					userKey: self.userKey,
					payModel: '2'
				};

				console.log("买断参数：" + JSON.stringify(params))
				this.$Phttp.post(Config.REQUEST_URLS.executeRepayBefore, params)
					.then(res => {
						console.log('返回结果：' + JSON.stringify(res));

						if (res.data.code === 200) {

							let payData = self.payType === 'wxpay' ? JSON.parse(res.data.data.payData) : res.data.data
								.payData;
							let orderInfo = res.data.data.orderId;

							orderInfo = Object.assign(orderInfo, {
								provider: self.payType,
							})
							console.log(orderInfo)

							self.pay(
								payData,
								orderInfo,
								successInfo => {
									console.log('success', successInfo)
									console.log(orderInfo.orderId, self.userKey)
									uni.redirectTo({
										url: '/pkChaoYueZu/repayment/repaymentResult?orderId=' +
											orderInfo + '&userKey=' + self.userKey
									})
								},
								failInfo => {
									console.log('fail', failInfo)
								}
							)

						} else {
							uni.showToast({
								title: res.data.message,
								icon: 'none',
								duration: 3000
							});
						}
					})
			},
			toReturnPage(returnType) {
				uni.navigateTo({
					url: '/pkChaoYueZu/repayment/goodsReturn?orderKey=' + this.orderKey + '&userKey=' + this
						.userKey + '&returnType=' + returnType
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #f8f8f8;
	}

	.content {
		width: 100%;
		height: calc(100vh);
		background: #f8f8f8;

		.vor-tabBar {
			padding: 0 40rpx;
			width: 100%;
			height: 104rpx;
			box-sizing: border-box;

			.vor-tabBar-inner {
				width: 100%;
				height: 100%;
				border-bottom: 2rpx solid #f0f0f0;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: space-around;

				.vor-tabBar-item {
					text-align: center;
					font-size: 30rpx;
					color: #666;
					display: flex;
					flex-direction: column;
					align-items: center;

					.cute-active {
						visibility: hidden;
						margin-top: 10rpx;
						background: linear-gradient(90deg,
								rgba(251, 38, 34, 1) 0%,
								rgba(255, 131, 18, 1) 100%);
						border-radius: 50rpx;
						width: 40rpx;
						height: 6rpx;
						line-height: 6rpx;
					}

					&.active {
						color: #FD501B;

						.cute-active {
							visibility: visible;
						}
					}
				}
			}
		}

		.tabBar-content {
			width: 100%;
		}

		.repayment-total {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			justify-content: space-around;
			padding: 0 24rpx;
			width: 100%;
			box-sizing: border-box;

			.repayment-total-item {
				margin-top: 30rpx;

				.text {
					font-size: 24rpx;
					color: #999;
				}

				.value {
					margin-top: 12rpx;
					font-size: 28rpx;
					font-weight: 600;
					color: #222;
					text-align: center;
				}
			}
		}

		.list-wrap {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 750rpx;
			background: #fff;

			.list-row {
				display: flex;
				flex-direction: row;
				align-items: center;
				width: 700rpx;
				height: 110rpx;

				/*border-bottom: 1rpx solid #f4f4f4;*/
				.row-image {
					width: 40rpx;
					height: 40rpx;
					margin: 0 20rpx;
				}

				.row-content {
					flex: 1;
					font-size: 30rpx;
					color: #333;
				}

				.row-right {
					width: 40rpx;
					height: 40rpx;
				}
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
			z-index: 100;
			background: #FFFFFF;
		}

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

		.disabled {
			background: linear-gradient(90deg,
					rgba(234, 234, 234, 1) 0%,
					rgba(191, 191, 191, 1) 100%);
			color: #b9b9b9;
		}

		.mt10 {
			margin-top: 10rpx;
		}

		.mt20 {
			margin-top: 20rpx;
		}

		.ptb48 {
			padding: 48rpx 0;
		}

		.ptb50 {
			padding: 50rpx 0;
		}

		.ptb60 {
			padding: 60rpx 0;
		}

		.mt24 {
			margin-top: 24rpx;
		}

		.mt60 {
			margin-top: 60rpx;
		}

		.fs24 {
			font-size: 24rpx;
		}

		.fs28 {
			font-size: 28rpx;
		}

		.fs32 {
			font-size: 32rpx;
		}

		.fs92 {
			font-size: 92rpx;
		}

		.fc222 {
			color: #222;
		}

		.fc999 {
			color: #999;
		}

		.fcred {
			color: #FF4230;
		}

		.fb600 {
			font-weight: 600;
		}

		.tc {
			text-align: center;
		}

		.bkfff {
			background: #fff;
		}
	}

	.main-page {
		width: 100%;
	}

	.default-page {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 100%;

		.icon-default {
			margin-top: 382rpx;
			width: 400rpx;
			height: 252rpx;

			img {
				width: 100%;
			}
		}

		.text {
			margin-top: 60rpx;
			font-size: 30rpx;
			color: #888;
		}
	}
</style>
