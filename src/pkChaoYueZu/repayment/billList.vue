<template>
	<!--<view class="content" :class="isShowDefault ? 'persentH100': ''">-->
	<!--&lt;!&ndash;缺省页&ndash;&gt;-->
	<!--<view class="default-page" v-show="isShowDefault">-->
	<!--<view class="icon-default">-->
	<!--<img src="/static/icon-none.png" alt="">-->
	<!--</view>-->
	<!--<view class="text">暂无数据</view>-->
	<!--</view>-->

	<!--<view class="bill-card" v-for="(item, index) in billListArray" :key="index" v-show="!isShowDefault">-->
	<!--<view class="bill-card_header">ID: {{item.rentOrderNo}}</view>-->
	<!--<view class="bill-card_body">-->
	<!--<view class="bill-card_body_billImg">-->
	<!--<image src="/static/icon-phone-white.png" class="billImg"></image>-->
	<!--</view>-->
	<!--<view class="bill-card_body_billName">{{item.goodsTitle}}</view>-->
	<!--</view>-->
	<!--<view class="bill-card_footer">-->
	<!--<span class="btn-bill btn-bill-info" @click="handleInfo(item.billKey)">详情</span>-->
	<!--</view>-->
	<!--</view>-->
	<!--</view>-->
	<view class="container" v-if="show">
		<!--缺省页-->
		<view class="container align-center" v-if="billListArray.length==0">
			<image src="/static/zulin/profile/empty.png" class="empty-img" />
			<view class="empty-text">暂无数据</view>
			<view class="bottom-btn" @click="toIndex">返回首页看看</view>
		</view>


		<view class="bill-card" v-for="(item, index) in billListArray" :key="index">
			<view class="bill-card_header">ID: {{item.rentOrderNo}}</view>
			<view class="bill-card_body">
				<view class="bill-card_body_billImg">
					<image src="/static/icon-phone-white.png" class="billImg"></image>
				</view>
				<view class="bill-card_body_billName">{{item.goodsTitle}}</view>
			</view>
			<view class="bill-card_footer">
				<span class="btn-bill btn-bill-info" @click="handleInfo(item.billKey, item.orderKey)">详情</span>
			</view>
		</view>

	</view>
</template>

<script>
	import Config from '../../common/js/Config.js'
	export default {
		name: "billList",
		data() {
			return {
				show: false,
				triggered: false,
				userKey: '',
				isShowDefault: true,
				billListArray: []
			}
		},
		onLoad() {
			let self = this;
			self.initBillList()
			setTimeout(() => {
				self.show = true
			}, 1500)
		},
		onShow() {},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			},
		},
		methods: {
			toIndex() {
				uni.switchTab({
					url: '/pkChaoYueZu/index/main'
				})
			},
			initBillList() {
				let self = this;
				uni.showLoading({
					title: '加载中'
				});
				console.log('userkey' + self.userInfo.user_key);
				const data = {
					// appKey: 123,  // hard code app key here
					// collectType: 'GOODS',
					userKey: self.userInfo.user_key
				}

				self.$Phttp.get(Config.REQUEST_URLS.getBillList, data)
					.then(res => {

						res = res.data;

						if (res.code === 200) {
							self.billListArray = res.data;

							if (Object.keys(self.billListArray).length === 0) {
								self.isShowDefault = true;
							} else {
								self.isShowDefault = false;
							}
						} else if (res.code === 1001) {
							self.isShowDefault = true
						}
						uni.hideLoading();
					})
			},
			handleInfo(billKey, orderKey) {
				// 跳转到账单详情页
				uni.navigateTo({
					url: '/pkChaoYueZu/repayment/index?billKey=' + billKey + '&userKey=' + this.userInfo.user_key + '&orderKey=' +
						orderKey
				})
			},
			onPulling(e) {
				console.log("onpulling", e);
			},
			onRefresh() {
				if (this._freshing) return;
				this._freshing = true;
				setTimeout(() => {
					this.triggered = false;
					this._freshing = false;
				}, 3000)
			},
			onRestore() {
				this.triggered = 'restore'; // 需要重置
				console.log("onRestore");
			},
			onAbort() {
				console.log("onAbort");
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: #f4f4f4;
		height: 100%;
		display: flex;
		flex-direction: column;

		.empty-img {
			width: 400rpx;
			height: 250rpx;
			margin-top: 300rpx;
		}

		.empty-text {
			font-size: 30rpx;
			color: #888;
			margin: 60rpx 0;
		}

		.bottom-btn {
			width: 500rpx;
			height: 80rpx;
			line-height: 80rpx;
			background: linear-gradient(180deg, rgba(82, 171, 252, 1) 0%, rgba(6, 135, 255, 1) 100%);
			border-radius: 40rpx;
			font-size: 30rpx;
			color: #fff;
			text-align: center;
		}

		.srcoll-box {
			height: 100%;
		}

		.bill-card {
			display: flex;
			align-items: flex-start;
			flex-direction: column;
			margin-top: 20rpx;
			padding: 30rpx;
			width: 100%;
			height: 300rpx;
			min-height: 300rpx;
			background-color: #fff;
			box-sizing: border-box;

			.bill-card_header {
				padding: 0 0 20rpx;
				width: 100%;
				font-weight: 400;
				font-size: 30rpx;
				color: #222;
				border-bottom: 1px solid #efefef;
			}

			.bill-card_body {
				display: flex;
				justify-content: flex-start;
				align-items: flex-start;
				margin-top: 25rpx;

				.bill-card_body_billImg {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 48rpx;
					height: 48rpx;
					border: 1px solid #1677FF;
					background-color: #1677FF;
					border-radius: 60rpx;

					.billImg {
						width: 70%;
						height: 70%;
					}
				}

				.bill-card_body_billName {
					flex: 1;
					margin-left: 20rpx;
					height: 96rpx;
					line-height: 48rpx;
					max-height: 96rpx;
					font-size: 30rpx;
					color: #222;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
			}

			.bill-card_footer {
				width: 100%;
				text-align: right;

				.btn-bill {
					padding: 3rpx 20rpx;
					border-radius: 10rpx;
					font-size: 28rpx;
				}

				.btn-bill-info {
					border: 1px solid #4288ff;
					color: #4288ff;
					background-color: #fff;
				}
			}
		}
	}
</style>
